-- Drop existing sequence, function, and trigger if they exist
DROP TRIGGER IF EXISTS set_booking_number ON bookings;
DROP FUNCTION IF EXISTS generate_booking_number();
DROP SEQUENCE IF EXISTS booking_number_seq;

-- Create new simple sequence starting at 1000
CREATE SEQUENCE booking_number_seq START WITH 1000;

-- Create function to generate simple booking numbers in format CN-001000
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := 'CN-' || LPAD(nextval('booking_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate booking number on insert
CREATE TRIGGER set_booking_number
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION generate_booking_number();

-- Backfill existing bookings with simple booking numbers (if any exist without them)
DO $$
DECLARE
  booking_record RECORD;
  new_booking_num TEXT;
BEGIN
  FOR booking_record IN
    SELECT id FROM bookings WHERE booking_number IS NULL OR booking_number ~ '^[0-9a-f]{8}-[0-9a-f]{4}-'
  LOOP
    new_booking_num := 'CN-' || LPAD(nextval('booking_number_seq')::TEXT, 6, '0');
    UPDATE bookings SET booking_number = new_booking_num WHERE id = booking_record.id;
  END LOOP;
END $$;

