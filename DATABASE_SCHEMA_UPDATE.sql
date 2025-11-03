-- Update Carls Newton Booking System - Add missing columns
-- Run this SQL in your Supabase SQL Editor to add missing columns

-- Add address_details column for apartment/building information
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS address_details TEXT;

-- Add special_requests column (rename from message for clarity)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Add comments
COMMENT ON COLUMN public.bookings.address_details IS 'Additional address details like apartment number, floor, building name, or landmarks';
COMMENT ON COLUMN public.bookings.special_requests IS 'Special requests, topics to cover, or specific requirements from the customer';

-- Note: The 'message' column can coexist with special_requests for backward compatibility
-- If you want to rename message to special_requests instead:
-- ALTER TABLE public.bookings RENAME COLUMN message TO special_requests;
