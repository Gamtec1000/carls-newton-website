-- Sample Bookings Data for Testing
-- This script inserts test bookings for the logged-in user

-- ⚠️ IMPORTANT: Replace 'YOUR_EMAIL_HERE' with your actual email address
-- To get your email, run: SELECT id, email FROM auth.users WHERE email = 'mataguille@gmail.com';

-- ═══════════════════════════════════════════════════════════
-- STEP 1: Get your user ID (run this first!)
-- ═══════════════════════════════════════════════════════════
-- Copy the 'id' value from the result and use it below

SELECT
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email = 'mataguille@gmail.com';

-- ═══════════════════════════════════════════════════════════
-- STEP 2: Insert Sample Bookings
-- ═══════════════════════════════════════════════════════════
-- Replace 'YOUR_USER_ID_HERE' with the ID from Step 1

-- Sample Booking 1: Confirmed & Paid - Classic Show
INSERT INTO public.bookings (
  customer_name,
  job_position,
  organization_name,
  email,
  phone,
  full_address,
  city,
  package_type,
  date,
  time_slot,
  status,
  payment_status,
  price,
  special_requests,
  created_at
) VALUES (
  'Guillermo Mata',
  'Team Principal',
  'alklskllsls',
  'mataguille@gmail.com',
  '+971544374657',
  '123 Science Street, Dubai Marina',
  'Dubai',
  'classic',
  '2025-12-15',
  '10:00 AM - 11:00 AM',
  'confirmed',
  'paid',
  1800,
  'Interested in chemistry experiments for Grade 5-6 students',
  NOW() - INTERVAL '5 days'
);

-- Sample Booking 2: Pending Payment - Half-Day Experience
INSERT INTO public.bookings (
  customer_name,
  job_position,
  organization_name,
  email,
  phone,
  full_address,
  city,
  package_type,
  date,
  time_slot,
  status,
  payment_status,
  price,
  special_requests,
  created_at
) VALUES (
  'Guillermo Mata',
  'Team Principal',
  'alklskllsls',
  'mataguille@gmail.com',
  '+971544374657',
  '456 Learning Avenue, Business Bay',
  'Dubai',
  'halfday',
  '2025-11-25',
  '9:00 AM - 1:00 PM',
  'pending',
  'pending',
  2500,
  'Need outdoor space for physics experiments with Grade 7-8',
  NOW() - INTERVAL '2 days'
);

-- Sample Booking 3: Confirmed & Paid - Preschool Special
INSERT INTO public.bookings (
  customer_name,
  job_position,
  organization_name,
  email,
  phone,
  full_address,
  city,
  package_type,
  date,
  time_slot,
  status,
  payment_status,
  price,
  message,
  created_at
) VALUES (
  'Guillermo Mata',
  'Team Principal',
  'alklskllsls',
  'mataguille@gmail.com',
  '+971544374657',
  '789 Education Road, Jumeirah',
  'Dubai',
  'preschool',
  '2025-12-01',
  '2:00 PM - 3:00 PM',
  'confirmed',
  'paid',
  1200,
  'Fun science show for preschoolers age 4-5',
  NOW() - INTERVAL '10 days'
);

-- Sample Booking 4: Upcoming Confirmed - Classic Show
INSERT INTO public.bookings (
  customer_name,
  job_position,
  organization_name,
  email,
  phone,
  full_address,
  city,
  package_type,
  date,
  time_slot,
  status,
  payment_status,
  price,
  special_requests,
  created_at
) VALUES (
  'Guillermo Mata',
  'Team Principal',
  'alklskllsls',
  'mataguille@gmail.com',
  '+971544374657',
  '321 School Lane, Al Barsha',
  'Dubai',
  'classic',
  '2026-01-20',
  '11:00 AM - 12:00 PM',
  'confirmed',
  'paid',
  1800,
  'Biology and life sciences focus for Grade 4',
  NOW() - INTERVAL '1 day'
);

-- Sample Booking 5: Cancelled Booking (for testing filters)
INSERT INTO public.bookings (
  customer_name,
  job_position,
  organization_name,
  email,
  phone,
  full_address,
  city,
  package_type,
  date,
  time_slot,
  status,
  payment_status,
  price,
  message,
  created_at
) VALUES (
  'Guillermo Mata',
  'Team Principal',
  'alklskllsls',
  'mataguille@gmail.com',
  '+971544374657',
  '555 Campus Drive, Academic City',
  'Dubai',
  'halfday',
  '2025-11-20',
  '9:00 AM - 1:00 PM',
  'cancelled',
  'refunded',
  2500,
  'Cancelled due to scheduling conflict',
  NOW() - INTERVAL '15 days'
);

-- ═══════════════════════════════════════════════════════════
-- STEP 3: Verify the inserted data
-- ═══════════════════════════════════════════════════════════

SELECT
  booking_number,
  customer_name,
  package_type,
  date,
  status,
  payment_status,
  price,
  created_at
FROM bookings
WHERE email = 'mataguille@gmail.com'
ORDER BY date DESC;

-- Check total bookings for user
SELECT
  COUNT(*) as total_bookings,
  SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
  SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid,
  SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as payment_pending
FROM bookings
WHERE email = 'mataguille@gmail.com';
