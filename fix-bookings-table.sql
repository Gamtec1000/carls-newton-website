-- Fix Bookings Table Schema
-- This updates the bookings table to match what the API expects

-- 1. Drop the existing bookings table
DROP TABLE IF EXISTS bookings CASCADE;

-- 2. Create the correct bookings table with all required columns
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT UNIQUE,
  title TEXT,
  customer_name TEXT NOT NULL,
  job_position TEXT,
  organization_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  full_address TEXT NOT NULL,
  address_details TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  package_type TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  price DECIMAL(10, 2),
  message TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create function to generate booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_number := 'BK' || to_char(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('booking_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create sequence for booking numbers
CREATE SEQUENCE IF NOT EXISTS booking_number_seq START 1;

-- 5. Create trigger to auto-generate booking numbers
DROP TRIGGER IF EXISTS set_booking_number ON bookings;
CREATE TRIGGER set_booking_number
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.booking_number IS NULL)
  EXECUTE FUNCTION generate_booking_number();

-- 6. Create indexes for performance
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);

-- 7. Disable RLS for testing (match the simple setup)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- 8. Create trigger for updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Done! Bookings table now matches API expectations
