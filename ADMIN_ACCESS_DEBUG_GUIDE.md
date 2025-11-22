# Admin Access Debugging Guide

## Issue: "You do not have admin access" Error

This guide will help you debug and fix admin access issues.

---

## 🔍 Step 1: Check Browser Console Logs

I've added enhanced logging to help identify the issue. Follow these steps:

### 1.1 Open Browser Console
```
1. Log in as hello@carlsnewton.com
2. Navigate to /admin
3. Open Developer Tools (F12 or Right-click → Inspect)
4. Go to Console tab
```

### 1.2 Look for These Log Messages
```
🔐 Admin permission check - authLoading: false, user: {...}
👤 Current user ID: [some-uuid]
📧 Current user email: hello@carlsnewton.com
🔍 Checking admin permission for user ID: [some-uuid]
📊 Admin users query result: { data: ..., error: ... }
```

### 1.3 Identify the Issue

**Case A: User ID doesn't match**
```
Console shows:
👤 Current user ID: abc-123-xyz
🔍 Checking admin permission for user ID: abc-123-xyz
⚠️ No admin user found for ID: abc-123-xyz
```
**Solution:** The user ID in `admin_users` doesn't match the authenticated user ID.
- Go to Supabase → Authentication → Users
- Copy the EXACT user ID for hello@carlsnewton.com
- Update admin_users table with correct ID

**Case B: RLS Policy Blocking Query**
```
Console shows:
👤 Current user ID: 5e3e54c8-bfb9-4e62-8fca-8128987285f6
🔍 Checking admin permission for user ID: 5e3e54c8-bfb9-4e62-8fca-8128987285f6
❌ Error querying admin_users: { code: "PGRST116", message: "..." }
```
**Solution:** RLS policy is blocking the query. Run the fix-admin-rls-policy.sql script.

**Case C: Admin User Not in Database**
```
Console shows:
👤 Current user ID: 5e3e54c8-bfb9-4e62-8fca-8128987285f6
📊 Admin users query result: { data: null, error: null }
⚠️ No admin user found for ID: 5e3e54c8-bfb9-4e62-8fca-8128987285f6
```
**Solution:** User not in admin_users table. Add them.

---

## 🔧 Step 2: Fix RLS Policy Issues

If you see RLS/permission errors in the console:

### Run the RLS Fix Script

```bash
# Go to Supabase Dashboard → SQL Editor
# Copy and paste the contents of:
fix-admin-rls-policy.sql
```

This script:
- ✅ Enables RLS on admin_users table
- ✅ Allows authenticated users to read admin_users (needed for permission checks)
- ✅ Allows super_admins to manage admin users
- ✅ Verifies policies were created correctly

---

## 🆔 Step 3: Verify User ID Match

### 3.1 Get Auth User ID
```sql
-- Run in Supabase SQL Editor
SELECT id, email
FROM auth.users
WHERE email = 'hello@carlsnewton.com';
```

**Copy the `id` value** (e.g., `5e3e54c8-bfb9-4e62-8fca-8128987285f6`)

### 3.2 Check Admin Users Table
```sql
-- Run in Supabase SQL Editor
SELECT *
FROM admin_users
WHERE id = '5e3e54c8-bfb9-4e62-8fca-8128987285f6';
```

**Expected result:**
```
id: 5e3e54c8-bfb9-4e62-8fca-8128987285f6
role: super_admin
created_at: 2025-11-22...
```

### 3.3 If IDs Don't Match

**Delete wrong entry:**
```sql
DELETE FROM admin_users
WHERE id != '5e3e54c8-bfb9-4e62-8fca-8128987285f6';
```

**Insert correct entry:**
```sql
INSERT INTO admin_users (id, role)
VALUES ('5e3e54c8-bfb9-4e62-8fca-8128987285f6', 'super_admin');
```

---

## 🧪 Step 4: Test Admin Access

### 4.1 Clear Browser Cache
```
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
```

### 4.2 Log Out and Log In
```
1. Log out from the website
2. Close all browser tabs
3. Open website in new tab
4. Log in as hello@carlsnewton.com
```

### 4.3 Navigate to Admin
```
1. Go to: /admin
2. Check browser console for logs
3. Should see: 🎉 Admin access granted with role: super_admin
```

---

## 🎯 Common Issues & Solutions

### Issue: "User is null"
```
Console: 🔐 Admin permission check - authLoading: false, user: null
```
**Solution:** User not logged in
- Log in first
- Check if session is persisted
- Clear cookies and try again

### Issue: "authLoading stuck at true"
```
Console: 🔐 Admin permission check - authLoading: true, user: null
```
**Solution:** Auth context not loading
- Check AuthContext.tsx
- Verify Supabase credentials in .env
- Check browser console for Supabase errors

### Issue: "Email doesn't match"
```
Console: 📧 Current user email: different@email.com
```
**Solution:** Wrong user logged in
- Log out
- Log in with hello@carlsnewton.com
- Verify email is correct

### Issue: "PGRST116 error"
```
Console: ❌ Error querying admin_users: { code: "PGRST116" }
```
**Solution:** RLS policy blocking query
- Run fix-admin-rls-policy.sql
- Verify policies with: SELECT * FROM pg_policies WHERE tablename = 'admin_users'

---

## ✅ Verification Checklist

After fixing, verify everything works:

- [ ] Browser console shows correct user ID
- [ ] Browser console shows: "✅ Admin role found: super_admin"
- [ ] No errors in console
- [ ] Admin dashboard loads (no redirect)
- [ ] Can see bookings in admin dashboard
- [ ] Can click on booking cards
- [ ] BookingDetailModal opens correctly

---

## 📊 Complete Debug Query

Run this comprehensive query to check everything:

```sql
-- Complete admin access check
SELECT
  'Auth User' as source,
  u.id,
  u.email,
  NULL as role
FROM auth.users u
WHERE u.email = 'hello@carlsnewton.com'

UNION ALL

SELECT
  'Admin User' as source,
  au.id,
  u.email,
  au.role
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.id
WHERE u.email = 'hello@carlsnewton.com';
```

**Expected Result:**
```
source       | id                                   | email                  | role
-------------|--------------------------------------|------------------------|-------------
Auth User    | 5e3e54c8-bfb9-4e62-8fca-8128987285f6 | hello@carlsnewton.com | NULL
Admin User   | 5e3e54c8-bfb9-4e62-8fca-8128987285f6 | hello@carlsnewton.com | super_admin
```

**Both rows must have the SAME ID!**

---

## 🆘 Still Not Working?

If you still get "Access Denied" after following all steps:

### 1. Export Debug Info
Run these queries and share the output:

```sql
-- Check user
SELECT id, email FROM auth.users WHERE email = 'hello@carlsnewton.com';

-- Check admin user
SELECT * FROM admin_users;

-- Check RLS policies
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'admin_users';
```

### 2. Check Environment Variables
```bash
# Verify these are set in .env:
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test Supabase Connection
Add this to a test page:
```typescript
import { supabase } from './lib/supabase';

// Test query
const testConnection = async () => {
  const { data, error } = await supabase.from('admin_users').select('*');
  console.log('Connection test:', { data, error });
};
```

---

## 🎉 Success!

Once you see these logs in the console:
```
🔐 Admin permission check - authLoading: false, user: {...}
👤 Current user ID: 5e3e54c8-bfb9-4e62-8fca-8128987285f6
📧 Current user email: hello@carlsnewton.com
🔍 Checking admin permission for user ID: 5e3e54c8-bfb9-4e62-8fca-8128987285f6
📊 Admin users query result: { data: { role: 'super_admin' }, error: null }
✅ Admin role found: super_admin
🎉 Admin access granted with role: super_admin
```

**You're all set!** 🚀

The admin console should now be fully accessible at `/admin`.
