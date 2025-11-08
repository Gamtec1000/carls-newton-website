# Fix Foreign Key Constraint Error (23503)

## The Problem

Error **23503** means: **Foreign key constraint violation**

```
Key (id)=(xxx) is not present in table "users"
insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
```

This happens because:
1. **Email confirmation is enabled** in Supabase
2. When a user signs up, they're created in a **"pending" state**
3. The user exists **client-side** (in JavaScript) but **NOT in auth.users table** (database)
4. When we try to create a profile with their ID, it fails because the FK requires the user to exist in the database
5. The user only appears in auth.users **after they confirm their email**

## Solution 1: Disable Email Confirmation (Recommended for Testing)

### Steps:

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth**
4. **Uncheck** "Enable email confirmations"
5. Click **Save**

This allows users to sign up without confirming email, and the profile can be created immediately.

---

## Solution 2: Handle Email Confirmation Properly (Production)

The code has been updated to:
- ✅ Check if `authData.session` exists
- ✅ If no session → Email confirmation required → Skip profile creation
- ✅ If session exists → User is confirmed → Create profile

### What happens now:

**With email confirmation DISABLED:**
- User signs up → Session created immediately → Profile created → ✅ Works!

**With email confirmation ENABLED:**
- User signs up → No session → Profile NOT created
- User confirms email → Signs in → Profile created on first login
- OR use database trigger (Solution 3)

---

## Solution 3: Database Trigger (Advanced - Optional)

Create a trigger to auto-create profiles when users are created:

```sql
-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

This automatically creates a profile when a user is added to auth.users (after email confirmation).

---

## Testing the Fix

### Step 1: Disable Email Confirmation (Supabase Dashboard)
Follow "Solution 1" above

### Step 2: Delete Test Users
Go to Supabase → **Authentication** → **Users** and delete any test users

### Step 3: Clear Browser Cache
- Press **F12** → **Network** tab → Check **"Disable cache"**
- Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### Step 4: Test Registration
1. Try to register a new user
2. Check browser console - should see:
   ```
   Auth user created: xxx
   Session exists: true
   Email confirmation required: false
   Creating profile for confirmed user...
   ```
3. Registration should complete successfully!

---

## What to Expect

**Before Fix (with email confirmation):**
- ❌ Error 23503 - Foreign key constraint violation
- ❌ Profile not created
- ❌ Sign up fails

**After Fix (email confirmation disabled):**
- ✅ Session created immediately
- ✅ Profile created successfully
- ✅ Preferences saved
- ✅ User can use the app immediately

**After Fix (email confirmation enabled with trigger):**
- ✅ User signs up
- ✅ User confirms email
- ✅ Profile created automatically by trigger
- ✅ User can sign in and use the app
