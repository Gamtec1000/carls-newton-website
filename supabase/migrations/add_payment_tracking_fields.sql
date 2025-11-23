-- Add payment tracking fields to bookings table
-- These fields enable automatic payment status updates via Stripe webhook

-- Add payment_intent_id to track Stripe payment intent
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Add paid_at timestamp to track when payment was completed
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Add payment_failure_reason for failed payments
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_failure_reason TEXT;

-- Add payment_link_sent_at to track when payment link was sent
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_link_sent_at TIMESTAMPTZ;

-- Update payment_status to include 'failed' option
-- Note: This may need to be done manually if the enum is strict
-- ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'failed';

-- Add index on payment_intent_id for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent_id
ON bookings(payment_intent_id)
WHERE payment_intent_id IS NOT NULL;

-- Add index on payment_status for filtering paid/unpaid bookings
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status
ON bookings(payment_status);

-- Add comment
COMMENT ON COLUMN bookings.payment_intent_id IS 'Stripe payment intent ID for tracking payments';
COMMENT ON COLUMN bookings.paid_at IS 'Timestamp when payment was completed';
COMMENT ON COLUMN bookings.payment_failure_reason IS 'Reason for payment failure';
COMMENT ON COLUMN bookings.payment_link_sent_at IS 'Timestamp when payment link was sent to customer';
