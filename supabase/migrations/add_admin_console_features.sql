-- ═══════════════════════════════════════════════════════════
-- ADMIN CONSOLE DATABASE SCHEMA
-- Add admin features to bookings system
-- ═══════════════════════════════════════════════════════════

-- Step 1: Add new columns to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_link TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS confirmed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejected_reason TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS customer_notified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gcal_event_id TEXT,
ADD COLUMN IF NOT EXISTS payment_link_sent_at TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN public.bookings.payment_link IS 'Stripe payment link sent to customer';
COMMENT ON COLUMN public.bookings.admin_notes IS 'Internal notes visible to admins only';
COMMENT ON COLUMN public.bookings.confirmed_by IS 'Admin user who confirmed the booking';
COMMENT ON COLUMN public.bookings.confirmed_at IS 'Timestamp when booking was confirmed';
COMMENT ON COLUMN public.bookings.rejected_reason IS 'Reason for booking rejection (visible to customer)';
COMMENT ON COLUMN public.bookings.internal_notes IS 'Private notes not sent to customer';
COMMENT ON COLUMN public.bookings.customer_notified IS 'Whether customer has been notified of confirmation';
COMMENT ON COLUMN public.bookings.gcal_event_id IS 'Google Calendar event ID for syncing';

-- Step 2: Create admin_users table for role-based access
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_role CHECK (role IN ('super_admin', 'admin', 'viewer'))
);

-- Add comment
COMMENT ON TABLE public.admin_users IS 'Admin users with role-based access control';
COMMENT ON COLUMN public.admin_users.role IS 'Admin role: super_admin (full access), admin (manage bookings), viewer (read only)';

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can view all admin users
CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Step 3: Update RLS policies for bookings table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can insert bookings" ON public.bookings;

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can update all bookings (except viewers)
CREATE POLICY "Admins can update all bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Admins can insert bookings
CREATE POLICY "Admins can insert bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Step 4: Create booking_history table for audit trail
CREATE TABLE IF NOT EXISTS public.booking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_payment_status TEXT,
  new_payment_status TEXT,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_action CHECK (action IN (
    'created', 'confirmed', 'rejected', 'cancelled',
    'payment_added', 'payment_updated', 'payment_completed',
    'status_changed', 'notes_added', 'gcal_synced'
  ))
);

-- Add comment
COMMENT ON TABLE public.booking_history IS 'Audit trail of all booking changes';

-- Create indexes
CREATE INDEX IF NOT EXISTS booking_history_booking_id_idx ON public.booking_history(booking_id);
CREATE INDEX IF NOT EXISTS booking_history_changed_by_idx ON public.booking_history(changed_by);
CREATE INDEX IF NOT EXISTS booking_history_created_at_idx ON public.booking_history(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_payment_link_idx ON public.bookings(payment_link) WHERE payment_link IS NOT NULL;
CREATE INDEX IF NOT EXISTS bookings_confirmed_by_idx ON public.bookings(confirmed_by) WHERE confirmed_by IS NOT NULL;

-- Enable RLS
ALTER TABLE public.booking_history ENABLE ROW LEVEL SECURITY;

-- Admins can view booking history
CREATE POLICY "Admins can view booking history"
  ON public.booking_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can insert booking history
CREATE POLICY "Admins can insert booking history"
  ON public.booking_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Step 5: Create function to automatically log booking changes
CREATE OR REPLACE FUNCTION log_booking_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_history (
      booking_id,
      changed_by,
      action,
      old_status,
      new_status,
      notes
    ) VALUES (
      NEW.id,
      auth.uid(),
      'status_changed',
      OLD.status,
      NEW.status,
      'Status changed from ' || OLD.status || ' to ' || NEW.status
    );
  END IF;

  -- Log payment status changes
  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN
    INSERT INTO public.booking_history (
      booking_id,
      changed_by,
      action,
      old_payment_status,
      new_payment_status,
      notes
    ) VALUES (
      NEW.id,
      auth.uid(),
      CASE
        WHEN NEW.payment_status = 'paid' THEN 'payment_completed'
        ELSE 'status_changed'
      END,
      OLD.payment_status,
      NEW.payment_status,
      'Payment status changed from ' || OLD.payment_status || ' to ' || NEW.payment_status
    );
  END IF;

  -- Log payment link addition
  IF OLD.payment_link IS NULL AND NEW.payment_link IS NOT NULL THEN
    INSERT INTO public.booking_history (
      booking_id,
      changed_by,
      action,
      notes,
      metadata
    ) VALUES (
      NEW.id,
      auth.uid(),
      'payment_added',
      'Payment link added',
      jsonb_build_object('payment_link', NEW.payment_link)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS booking_change_logger ON public.bookings;
CREATE TRIGGER booking_change_logger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_booking_change();

-- Step 6: Make specific users admins
-- Replace with your actual admin emails

-- Make hello@carlsnewton.com a super admin
INSERT INTO public.admin_users (id, role, full_name, email)
SELECT
  id,
  'super_admin',
  raw_user_meta_data->>'full_name',
  email
FROM auth.users
WHERE email = 'hello@carlsnewton.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  updated_at = NOW();

-- Make mataguille@gmail.com an admin (for testing)
INSERT INTO public.admin_users (id, role, full_name, email)
SELECT
  id,
  'admin',
  raw_user_meta_data->>'full_name',
  email
FROM auth.users
WHERE email = 'mataguille@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Step 7: Create view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_booking_stats AS
SELECT
  COUNT(*) FILTER (WHERE booking_status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE booking_status = 'confirmed') as confirmed_count,
  COUNT(*) FILTER (WHERE booking_status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE booking_status = 'cancelled') as cancelled_count,
  COUNT(*) as total_bookings,
  SUM(price) FILTER (WHERE payment_status = 'paid') as total_revenue,
  SUM(price) FILTER (WHERE booking_status = 'confirmed' AND payment_status = 'pending') as pending_revenue,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as bookings_last_7_days,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as bookings_last_30_days,
  COUNT(*) FILTER (WHERE booking_status = 'pending' AND customer_notified = false) as requires_attention
FROM public.bookings;

-- Grant access to admins
GRANT SELECT ON admin_booking_stats TO authenticated;

-- Step 8: Create function to get booking with history
CREATE OR REPLACE FUNCTION get_booking_with_history(booking_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'booking', row_to_json(b.*),
    'history', (
      SELECT json_agg(h.* ORDER BY h.created_at DESC)
      FROM booking_history h
      WHERE h.booking_id = booking_uuid
    ),
    'admin_info', (
      SELECT row_to_json(a.*)
      FROM admin_users a
      JOIN auth.users u ON a.id = u.id
      WHERE a.id = b.confirmed_by
    )
  )
  INTO result
  FROM bookings b
  WHERE b.id = booking_uuid;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Verify setup
-- Run this to check if admin users were added correctly
SELECT
  au.id,
  au.email,
  au.role,
  au.created_at,
  u.email as auth_email
FROM admin_users au
JOIN auth.users u ON au.id = u.id
ORDER BY au.created_at DESC;

-- Check new columns on bookings table
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name IN ('payment_link', 'admin_notes', 'confirmed_by', 'confirmed_at', 'rejected_reason', 'gcal_event_id')
ORDER BY ordinal_position;

-- Check booking_history table
SELECT COUNT(*) as history_records FROM booking_history;

-- Check statistics view
SELECT * FROM admin_booking_stats;

-- Step 10: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT, INSERT ON public.booking_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_booking_with_history(UUID) TO authenticated;
GRANT SELECT ON admin_booking_stats TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin Console Database Schema Setup Complete!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '  - Added 8 new columns to bookings table';
  RAISE NOTICE '  - Created admin_users table with RLS';
  RAISE NOTICE '  - Created booking_history table for audit trail';
  RAISE NOTICE '  - Set up automatic change logging';
  RAISE NOTICE '  - Created admin dashboard statistics view';
  RAISE NOTICE '  - Granted appropriate permissions';
  RAISE NOTICE '';
  RAISE NOTICE '👤 Admin Users:';
  RAISE NOTICE '  - Check admin_users table for configured admins';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Next Steps:';
  RAISE NOTICE '  1. Verify admin users are set up correctly';
  RAISE NOTICE '  2. Deploy admin dashboard frontend';
  RAISE NOTICE '  3. Test booking confirmation with payment links';
  RAISE NOTICE '  4. Configure Stripe payment links';
END $$;
