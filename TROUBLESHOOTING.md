# Troubleshooting Authentication and API Errors

## Current Errors and Solutions

### Error 1: 500 Error on `/api/get-bookings`
**Cause:** Bookings table has wrong schema (missing columns like `customer_name`, `organization_name`, etc.)

**Solution:**
1. Run `database-complete-reset.sql` in Supabase SQL Editor
2. This will recreate the bookings table with ALL required columns

---

### Error 2: 409 Conflict on Profiles (`on_conflict=id`)
**Cause:** Browser is using cached JavaScript with old code

**Solution:**
1. **Clear browser cache completely:**
   - Chrome: Ctrl+Shift+Delete → Clear "Cached images and files" → Last hour
   - Or open DevTools (F12) → Network tab → Check "Disable cache"

2. **Hard refresh the page:**
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

3. **If still failing, delete test users:**
   - Go to Supabase → Authentication → Users
   - Delete any test users you created
   - Try registering again

---

### Error 3: Sign Up Error (Related to 409)
**Cause:** Same as Error 2 - cached code or existing user

**Solution:** Follow steps in Error 2

---

### Error 4: `Unchecked runtime.lastError: No tab with id`
**Cause:** Chrome browser extensions trying to access closed tabs

**Solution:**
- ✅ **IGNORE** - These are harmless and not from your app
- They come from Chrome extensions like ad blockers, password managers, etc.
- They don't affect your application functionality

---

### Error 5: "using deprecated parameters for the initialization function"
**Cause:** Browser cache still has old Supabase SDK code

**Solution:**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear cache as described in Error 2
- This warning will disappear after refresh

---

### Error 6: "Cleaning up map and autocomplete instances"
**Cause:** This is NORMAL - Google Maps is properly cleaning up

**Solution:**
- ✅ **IGNORE** - This is just a log message, not an error
- It shows the map is being properly destroyed when component unmounts

---

## Complete Reset Procedure

If you want to start completely fresh:

### Step 1: Clear Supabase Data
Run this SQL in Supabase SQL Editor:
```sql
-- Copy and paste entire database-complete-reset.sql file
```

### Step 2: Delete Test Users
- Go to Supabase Dashboard → Authentication → Users
- Delete all test users

### Step 3: Clear Browser
1. Close all browser tabs with your app
2. Clear browser cache (Ctrl+Shift+Delete)
3. Close and reopen browser
4. Open app in new tab

### Step 4: Test Registration
1. Try registering a new user
2. Check browser console - should have no errors except the harmless tab ID ones
3. Check Supabase → Table Editor → profiles - should see your profile
4. Check Supabase → Table Editor → user_preferences - should see your interests

---

## Debugging Tips

### Check what's actually in your database:

**In Supabase SQL Editor, run:**
```sql
-- Check bookings table schema
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings';

-- Check if profiles table exists
SELECT * FROM profiles LIMIT 5;

-- Check if bookings table exists
SELECT * FROM bookings LIMIT 5;
```

### Check browser console logs:

When you try to register or fetch bookings, check:
1. Network tab in DevTools (F12)
2. Look for failed requests (red)
3. Click on them to see the response
4. Share the error details if needed

---

## Quick Checklist

Before reporting an issue, verify:

- [ ] Ran `database-complete-reset.sql` in Supabase
- [ ] Cleared browser cache
- [ ] Hard refreshed page (Ctrl+Shift+R)
- [ ] Deleted test users from Supabase Auth
- [ ] Checked browser console for actual errors (ignore tab ID warnings)
- [ ] Verified tables exist in Supabase Table Editor

---

## Expected Console Messages (NORMAL)

These are **NOT errors**:
- ✅ "Cleaning up map and autocomplete instances"
- ✅ "Unchecked runtime.lastError: No tab with id: ..."

These **ARE errors** (report if you see them):
- ❌ 500 Internal Server Error
- ❌ 409 Conflict
- ❌ 404 Not Found on `/rest/v1/profiles` or `/rest/v1/bookings`
- ❌ "Failed to fetch bookings"
- ❌ "Sign up error"
