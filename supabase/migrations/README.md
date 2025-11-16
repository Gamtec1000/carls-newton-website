# Database Migrations

This directory contains SQL migrations for the Carls Newton application.

---

## 🔥 CRITICAL: Auto Profile Creation (NEW - MUST RUN IMMEDIATELY)

**Problem:** Profiles table is empty after user registration. Users register successfully and receive confirmation emails, but no profile record exists in the database.

**Root Cause:** The application was relying on JavaScript code to create profiles during email confirmation, which was unreliable and had detection bugs.

**Solution:** Database trigger that automatically creates profile records when users sign up.

### Files:
- `create_auto_profile_trigger.sql` - Creates the auto-profile trigger
- `backfill_existing_users.sql` - Creates profiles for existing users

### How to Apply (URGENT):

1. **Create Auto Profile Trigger** (REQUIRED)
   - Go to: Supabase Dashboard → SQL Editor → New Query
   - Copy contents of `create_auto_profile_trigger.sql`
   - Click Run

2. **Backfill Existing Users** (RECOMMENDED)
   - Go to: Supabase Dashboard → SQL Editor → New Query
   - Copy contents of `backfill_existing_users.sql`
   - Click Run

### What This Fixes:
- ✅ Profiles automatically created when user signs up
- ✅ No more empty profiles table
- ✅ Header shows "Hi [FirstName]" instead of "Hi there"
- ✅ Profile Settings pre-fills user data correctly
- ✅ Reliable, database-level solution (not JavaScript)

---

## Database Migration: Add Booking Number System

## Overview
This migration adds a simplified booking ID system using human-readable booking numbers instead of UUIDs.

**Booking Number Format:** `CN250104-1001`
- `CN` = Carls Newton
- `250104` = Date (YYMMDD format - Jan 4, 2025)
- `1001` = Sequential number (starts at 1000)

## How to Apply This Migration

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `add_booking_number.sql`
5. Click **Run** or press `Ctrl/Cmd + Enter`

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to project root
cd /home/user/carls-newton-website

# Apply the migration
supabase db push
```

### Option 3: Manual SQL Execution

Run the SQL commands from `add_booking_number.sql` in your preferred PostgreSQL client.

## What This Migration Does

1. **Adds `booking_number` column** to the `bookings` table
   - Type: VARCHAR(20)
   - Constraint: UNIQUE
   - Nullable (initially, for existing records)

2. **Creates a sequence** `booking_number_seq`
   - Starts at 1000
   - Auto-increments for each new booking

3. **Creates a function** `generate_booking_number()`
   - Generates booking numbers in format: CN250104-1001
   - Uses current date and sequential number

4. **Creates a trigger** `set_booking_number`
   - Automatically generates booking numbers for new bookings
   - Only triggers if booking_number is NULL

5. **Backfills existing bookings**
   - Updates any existing bookings without booking numbers
   - Ensures all bookings have a booking_number

## Verification

After applying the migration, verify it worked:

```sql
-- Check if column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings' AND column_name = 'booking_number';

-- Check if existing bookings have booking numbers
SELECT id, booking_number, customer_name, created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;

-- Test the trigger by inserting a new booking (if safe to do so)
-- The booking_number should be auto-generated
```

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- Drop the trigger
DROP TRIGGER IF EXISTS set_booking_number ON bookings;

-- Drop the function
DROP FUNCTION IF EXISTS generate_booking_number();

-- Drop the sequence
DROP SEQUENCE IF EXISTS booking_number_seq;

-- Remove the column (WARNING: This deletes the booking_number data)
ALTER TABLE bookings DROP COLUMN IF EXISTS booking_number;
```

## Impact on Application

After applying this migration:

✅ All new bookings will automatically receive a booking number (e.g., CN250104-1001)
✅ Admin emails will show simplified booking numbers in subject and body
✅ Customer emails will display booking numbers instead of UUIDs
✅ Frontend success message will show booking number (e.g., "Booking #CN250104-1001")
✅ WhatsApp links will include the simplified booking number

## Email Notification Checklist

After migration, verify emails are working:

- [ ] Create a test booking
- [ ] Check admin email received at: carls.newton10@gmail.com
- [ ] Verify booking number appears in subject line
- [ ] Verify booking number appears in email body
- [ ] Check customer email displays booking number
- [ ] Test WhatsApp button includes booking number
- [ ] Verify frontend success message shows booking number

## Support

If you encounter any issues:
1. Check Supabase logs for errors
2. Verify all SQL commands completed successfully
3. Test with a new booking to ensure triggers are working
4. Check API logs for booking number generation

## Example Booking Numbers

- `CN250104-1001` - First booking on Jan 4, 2025
- `CN250104-1002` - Second booking on Jan 4, 2025
- `CN250105-1003` - First booking on Jan 5, 2025
- `CN250205-2500` - Booking #2500 on Feb 5, 2025
