-- Add title and job_position columns to bookings table
-- This migration adds fields for customer title (Mr/Ms/Dr/Mrs/Prof) and job position

-- Add title column (e.g., Mr, Ms, Dr, Mrs, Prof)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS title VARCHAR(10);

-- Add job_position column (e.g., Science Coordinator, Head Teacher)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS job_position VARCHAR(100);

-- Optional: Add default values for existing records
UPDATE bookings
SET title = 'Mr'
WHERE title IS NULL;

-- Optional: You can add a check constraint if you want to restrict values
-- ALTER TABLE bookings
-- ADD CONSTRAINT title_check CHECK (title IN ('Mr', 'Ms', 'Mrs', 'Dr', 'Prof'));
