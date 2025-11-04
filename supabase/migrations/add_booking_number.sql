-- Add booking_number column to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS booking_number VARCHAR(20) UNIQUE;

-- Create sequence for auto-incrementing numbers starting at 1000
CREATE SEQUENCE IF NOT EXISTS booking_number_seq START 1000;

-- Create function to generate booking numbers in format: CN250104-1001
-- CN = Carls Newton, 250104 = date (YYMMDD), 1001 = sequential number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  booking_num TEXT;
BEGIN
  next_num := nextval('booking_number_seq');
  booking_num := 'CN' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN booking_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate booking number on insert
CREATE OR REPLACE TRIGGER set_booking_number
BEFORE INSERT ON bookings
FOR EACH ROW
WHEN (NEW.booking_number IS NULL)
EXECUTE FUNCTION generate_booking_number();

-- Backfill existing bookings with booking numbers (if any exist without them)
DO $$
DECLARE
  booking_record RECORD;
  new_booking_num TEXT;
BEGIN
  FOR booking_record IN
    SELECT id FROM bookings WHERE booking_number IS NULL
  LOOP
    new_booking_num := generate_booking_number();
    UPDATE bookings SET booking_number = new_booking_num WHERE id = booking_record.id;
  END LOOP;
END $$;
