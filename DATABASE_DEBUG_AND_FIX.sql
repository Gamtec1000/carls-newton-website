-- Carls Newton Booking System - Database Debug and Fix Script
-- Run this in Supabase SQL Editor to diagnose and fix database issues

-- ============================================
-- STEP 1: CHECK IF TABLE EXISTS
-- ============================================
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'bookings'
) AS table_exists;

-- ============================================
-- STEP 2: CHECK EXISTING COLUMNS
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- ============================================
-- STEP 3: CHECK ROW LEVEL SECURITY POLICIES
-- ============================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'bookings';

-- ============================================
-- STEP 4: ADD MISSING COLUMNS (IF NEEDED)
-- ============================================
-- Add address_details if missing
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS address_details TEXT;

-- Add special_requests if missing
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Add message if missing (for backward compatibility)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS message TEXT;

-- Ensure city column exists
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS city TEXT;

-- Ensure latitude/longitude exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- ============================================
-- STEP 5: FIX DATA TYPES (IF NEEDED)
-- ============================================
-- Ensure price is numeric
ALTER TABLE public.bookings
ALTER COLUMN price TYPE INTEGER USING price::integer;

-- Ensure date is date type
ALTER TABLE public.bookings
ALTER COLUMN date TYPE DATE USING date::date;

-- ============================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: CREATE INSERT POLICY (IF MISSING)
-- ============================================
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert" ON public.bookings;

-- Create new insert policy that allows anyone to insert
CREATE POLICY "Allow anonymous inserts"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- STEP 8: CREATE SELECT POLICY (IF MISSING)
-- ============================================
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anonymous reads" ON public.bookings;
DROP POLICY IF EXISTS "Allow public select" ON public.bookings;

-- Create new select policy
CREATE POLICY "Allow anonymous reads"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================
-- STEP 9: CREATE UPDATE POLICY (IF MISSING)
-- ============================================
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.bookings;

-- Create update policy for authenticated users
CREATE POLICY "Allow authenticated updates"
ON public.bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- STEP 10: VERIFY SCHEMA
-- ============================================
-- Check all columns are present
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'id') THEN '✓'
        ELSE '✗'
    END AS id,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'customer_name') THEN '✓'
        ELSE '✗'
    END AS customer_name,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'organization_name') THEN '✓'
        ELSE '✗'
    END AS organization_name,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'email') THEN '✓'
        ELSE '✗'
    END AS email,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'phone') THEN '✓'
        ELSE '✗'
    END AS phone,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'address') THEN '✓'
        ELSE '✗'
    END AS address,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'address_details') THEN '✓'
        ELSE '✗'
    END AS address_details,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'city') THEN '✓'
        ELSE '✗'
    END AS city,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'latitude') THEN '✓'
        ELSE '✗'
    END AS latitude,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'longitude') THEN '✓'
        ELSE '✗'
    END AS longitude,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'package_type') THEN '✓'
        ELSE '✗'
    END AS package_type,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'date') THEN '✓'
        ELSE '✗'
    END AS date,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'time_slot') THEN '✓'
        ELSE '✗'
    END AS time_slot,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'status') THEN '✓'
        ELSE '✗'
    END AS status,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN '✓'
        ELSE '✗'
    END AS payment_status,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'price') THEN '✓'
        ELSE '✗'
    END AS price,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'message') THEN '✓'
        ELSE '✗'
    END AS message,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'special_requests') THEN '✓'
        ELSE '✗'
    END AS special_requests,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'created_at') THEN '✓'
        ELSE '✗'
    END AS created_at;

-- ============================================
-- STEP 11: TEST INSERT
-- ============================================
-- Try a minimal insert to test if it works
INSERT INTO public.bookings (
    customer_name,
    organization_name,
    email,
    phone,
    address,
    package_type,
    date,
    time_slot,
    price,
    status,
    payment_status
) VALUES (
    'Test Customer',
    'Test Organization',
    'test@example.com',
    '+971501234567',
    'Test Address, Dubai',
    'classic',
    '2025-12-01',
    '10:00 AM',
    1800,
    'pending',
    'pending'
);

-- Check if the test insert worked
SELECT * FROM public.bookings
WHERE email = 'test@example.com'
ORDER BY created_at DESC
LIMIT 1;

-- Clean up test data
DELETE FROM public.bookings WHERE email = 'test@example.com';

-- ============================================
-- STEP 12: GRANT PERMISSIONS
-- ============================================
-- Ensure anon and authenticated roles have proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.bookings TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT '✓ Database schema check and fix completed!' AS status;
SELECT 'If you see this message, the script ran successfully.' AS info;
SELECT 'Try submitting a booking again.' AS next_step;
