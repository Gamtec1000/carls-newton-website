-- Carls Newton Booking System - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  package_type TEXT NOT NULL CHECK (package_type IN ('preschool', 'classic', 'halfday')),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  price INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add comments to document columns
COMMENT ON TABLE public.bookings IS 'Stores all booking requests for Carls Newton science shows';
COMMENT ON COLUMN public.bookings.id IS 'Unique identifier for each booking';
COMMENT ON COLUMN public.bookings.customer_name IS 'Full name of the customer';
COMMENT ON COLUMN public.bookings.email IS 'Customer email address';
COMMENT ON COLUMN public.bookings.phone IS 'Customer phone number';
COMMENT ON COLUMN public.bookings.address IS 'Full address where the show will take place';
COMMENT ON COLUMN public.bookings.city IS 'City extracted from the address';
COMMENT ON COLUMN public.bookings.latitude IS 'Latitude coordinate of the booking location';
COMMENT ON COLUMN public.bookings.longitude IS 'Longitude coordinate of the booking location';
COMMENT ON COLUMN public.bookings.package_type IS 'Type of show package: preschool, classic, or halfday';
COMMENT ON COLUMN public.bookings.date IS 'Date of the scheduled show';
COMMENT ON COLUMN public.bookings.time_slot IS 'Time slot for the show (e.g., "09:00 AM")';
COMMENT ON COLUMN public.bookings.status IS 'Booking status: pending, confirmed, or cancelled';
COMMENT ON COLUMN public.bookings.payment_status IS 'Payment status: pending, paid, or refunded';
COMMENT ON COLUMN public.bookings.price IS 'Price in AED (1200, 1800, or 2500)';
COMMENT ON COLUMN public.bookings.message IS 'Optional message or special requests from customer';
COMMENT ON COLUMN public.bookings.created_at IS 'Timestamp when booking was created';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_email_address ON public.bookings(email, address);
CREATE INDEX IF NOT EXISTS idx_bookings_location ON public.bookings(latitude, longitude);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous reads" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.bookings;

-- Create policy to allow anonymous inserts (for booking form submissions)
CREATE POLICY "Allow anonymous inserts" ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow anonymous reads (for checking calendar availability)
CREATE POLICY "Allow anonymous reads" ON public.bookings
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow authenticated updates (for admin panel)
-- Note: You should implement proper authentication for production use
CREATE POLICY "Allow authenticated updates" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Optional: Create a view for available dates (useful for quick lookups)
CREATE OR REPLACE VIEW public.booking_dates AS
SELECT
  date,
  COUNT(*) as booking_count,
  BOOL_OR(package_type = 'halfday') as has_halfday,
  ARRAY_AGG(time_slot ORDER BY time_slot) as booked_slots
FROM public.bookings
WHERE status != 'cancelled'
GROUP BY date;

COMMENT ON VIEW public.booking_dates IS 'Aggregated view of bookings by date for quick availability checks';

-- Grant permissions for the view
GRANT SELECT ON public.booking_dates TO anon;
GRANT SELECT ON public.booking_dates TO authenticated;
