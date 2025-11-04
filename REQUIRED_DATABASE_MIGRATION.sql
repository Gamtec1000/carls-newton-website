-- ========================================
-- REQUIRED DATABASE MIGRATION
-- Run this in Supabase SQL Editor
-- ========================================
-- This adds the missing columns that the API needs

-- Add missing columns to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS address_details TEXT,
ADD COLUMN IF NOT EXISTS special_requests TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS message TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'bookings'
ORDER BY ordinal_position;

-- Check if Row Level Security is enabled and has proper policies
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'bookings';

-- Show existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bookings';

-- If no policies exist for INSERT, add them:
-- (Remove the /* */ comments to enable)

/*
-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for booking form)
CREATE POLICY "Allow anonymous inserts"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow anonymous selects (for viewing bookings)
CREATE POLICY "Allow anonymous selects"
ON public.bookings FOR SELECT
TO anon, authenticated
USING (true);

-- Create policy to allow anonymous updates (for status changes)
CREATE POLICY "Allow anonymous updates"
ON public.bookings FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
*/

-- Success message
SELECT 'Migration completed! All required columns have been added.' as status;
