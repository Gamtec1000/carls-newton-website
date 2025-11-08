-- Cleanup Orphaned Users
-- This script removes users from auth.users who don't have corresponding profiles
-- Run this if you're getting 409 conflicts during signup

-- WARNING: This will delete users without profiles!
-- Make sure you want to do this before running

-- Option 1: View orphaned users first (safe, just viewing)
SELECT
  au.id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Option 2: Delete orphaned users (run this after confirming above query)
-- Uncomment the lines below to actually delete:

-- DELETE FROM auth.users
-- WHERE id IN (
--   SELECT au.id
--   FROM auth.users au
--   LEFT JOIN profiles p ON au.id = p.id
--   WHERE p.id IS NULL
-- );

-- After deletion, you should be able to register with those emails again
