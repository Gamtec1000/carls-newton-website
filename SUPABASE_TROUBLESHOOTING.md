# Supabase Insert Error Troubleshooting Guide

## Quick Diagnosis Steps

### 1. Check Vercel Function Logs

Go to: **Vercel Dashboard** → **Your Project** → **Functions** → **`/api/create-booking`**

Look for these log messages:

```
=== CREATE BOOKING API CALLED ===
Checking environment variables...
Supabase URL exists: true/false
Supabase Key exists: true/false
Creating booking in Supabase...
```

### 2. Common Error Codes

| Error Code | Cause | Fix |
|------------|-------|-----|
| `42P01` | Table doesn't exist | Create the `bookings` table using `DATABASE_SCHEMA.sql` |
| `42703` | Column doesn't exist | Run `DATABASE_DEBUG_AND_FIX.sql` to add missing columns |
| `23502` | NULL constraint violation | Check which field is NULL that shouldn't be |
| `23505` | Unique constraint violation | Duplicate entry, check unique fields |
| `42501` | Permission denied | RLS policy blocking insert, run Step 7-9 of debug script |

### 3. Check Environment Variables

In Vercel:
1. Go to **Settings** → **Environment Variables**
2. Verify these exist:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`

### 4. Check Supabase Table

In Supabase SQL Editor, run:

```sql
-- Check table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_name = 'bookings'
);

-- Check columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'bookings';
```

### 5. Test Insert Directly

In Supabase SQL Editor:

```sql
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
    'Test',
    'Test Org',
    'test@test.com',
    '+971123456',
    'Test Address',
    'classic',
    '2025-12-01',
    '10:00 AM',
    1800,
    'pending',
    'pending'
);
```

If this fails, the issue is with your database schema or RLS policies.

If this succeeds, the issue is with your API or environment variables.

## Step-by-Step Fix

### Fix 1: Missing Columns

Run in Supabase SQL Editor:

```sql
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS address_details TEXT,
ADD COLUMN IF NOT EXISTS special_requests TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS message TEXT;
```

### Fix 2: RLS Policy Blocking Inserts

Run in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create insert policy
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.bookings;

CREATE POLICY "Allow anonymous inserts"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create select policy
DROP POLICY IF EXISTS "Allow anonymous reads" ON public.bookings;

CREATE POLICY "Allow anonymous reads"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (true);
```

### Fix 3: Wrong Data Types

Run in Supabase SQL Editor:

```sql
-- Fix price type
ALTER TABLE public.bookings
ALTER COLUMN price TYPE INTEGER USING price::integer;

-- Fix date type
ALTER TABLE public.bookings
ALTER COLUMN date TYPE DATE USING date::date;
```

### Fix 4: Grant Permissions

Run in Supabase SQL Editor:

```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.bookings TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

## Complete Fix Script

Run `DATABASE_DEBUG_AND_FIX.sql` in Supabase SQL Editor. This will:
1. Check if table exists
2. Check existing columns
3. Add missing columns
4. Fix data types
5. Enable RLS
6. Create necessary policies
7. Grant permissions
8. Test insert

## Debugging Checklist

- [ ] Table `bookings` exists in Supabase
- [ ] All required columns exist (run Step 2 of debug script)
- [ ] RLS is enabled with proper policies (run Step 3)
- [ ] Environment variables set in Vercel
- [ ] Supabase URL and Key are correct
- [ ] Test insert works in Supabase SQL Editor
- [ ] API returns detailed error in response
- [ ] Check Vercel Function Logs for exact error

## Still Not Working?

1. **Check the API response in browser console**
   - Should show `supabaseError`, `code`, `details`, `hint`
   - This tells you exactly what's wrong

2. **Check Vercel Function Logs**
   - Shows the exact error from Supabase
   - Look for `=== SUPABASE INSERT FAILED ===`

3. **Check Supabase Dashboard → Logs**
   - Shows database-level errors
   - Look for failed queries

4. **Try minimal insert**
   - Remove optional fields from API
   - Only send required fields
   - See if that works

## Example Error Messages

### "column 'special_requests' does not exist"
**Fix:** Run Step 4 of `DATABASE_DEBUG_AND_FIX.sql`

### "permission denied for table bookings"
**Fix:** Run Step 7-9 of `DATABASE_DEBUG_AND_FIX.sql`

### "new row violates row-level security policy"
**Fix:** Check RLS policies, ensure anon role can insert

### "null value in column 'X' violates not-null constraint"
**Fix:** Either make column nullable or ensure value is sent:
```sql
ALTER TABLE bookings ALTER COLUMN X DROP NOT NULL;
```

## Contact Information

If you still can't resolve the issue:
1. Copy the error from Vercel Function Logs
2. Copy the error from API response (browser console)
3. Check Supabase Logs for the failed query
4. Share all three for better diagnosis
