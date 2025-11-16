-- Verify bookings table structure and policies
-- Run this to check if everything is set up correctly

-- 1. Check if bookings table exists
SELECT
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_name = 'bookings';

-- 2. Check table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- 3. Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'bookings';

-- 4. Check if RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'bookings';

-- 5. Count total bookings
SELECT COUNT(*) as total_bookings FROM bookings;

-- 6. Sample of existing bookings (if any)
SELECT
  id,
  booking_number,
  customer_name,
  email,
  package_type,
  date,
  status,
  payment_status,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 5;
