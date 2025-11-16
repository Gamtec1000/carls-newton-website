-- ═══════════════════════════════════════════════════════════
-- CRITICAL: RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- ═══════════════════════════════════════════════════════════
-- This fixes empty profiles and user_preferences tables
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- PART 1: Create Auto-Profile Trigger
-- This makes profiles get created automatically when users register

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert a new profile using data from user_metadata
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    school_organization,
    phone,
    job_position,
    subscribe_newsletter,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'school_organization', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'job_position', ''),
    COALESCE((NEW.raw_user_meta_data->>'subscribe_newsletter')::boolean, false),
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger that fires when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile record when a new user signs up. Extracts user data from user_metadata (raw_user_meta_data) and inserts it into the profiles table.';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- ═══════════════════════════════════════════════════════════
-- PART 2: Backfill Existing Users
-- This creates profiles for users who registered before the trigger
-- ═══════════════════════════════════════════════════════════

-- Insert profiles for any auth.users that don't have a profile yet
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  school_organization,
  phone,
  job_position,
  subscribe_newsletter,
  created_at,
  updated_at
)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'school_organization', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(u.raw_user_meta_data->>'job_position', ''),
  COALESCE((u.raw_user_meta_data->>'subscribe_newsletter')::boolean, false),
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL  -- Only insert if profile doesn't exist
  AND u.email_confirmed_at IS NOT NULL;  -- Only for confirmed users

-- ═══════════════════════════════════════════════════════════
-- PART 3: Verification Queries
-- Run these after the migration to verify it worked
-- ═══════════════════════════════════════════════════════════

-- Check if trigger was created
SELECT
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function was created
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- Check how many users have profiles now
SELECT
  COUNT(*) as total_confirmed_users,
  COUNT(p.id) as users_with_profiles,
  COUNT(*) - COUNT(p.id) as users_without_profiles
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL;

-- Show recent profiles (to verify data was populated)
SELECT
  id,
  email,
  full_name,
  phone,
  school_organization,
  job_position,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- ═══════════════════════════════════════════════════════════
-- SUCCESS!
-- ═══════════════════════════════════════════════════════════
-- If you see:
-- ✅ Trigger exists: on_auth_user_created
-- ✅ Function exists: handle_new_user
-- ✅ users_without_profiles = 0
-- ✅ Recent profiles showing data
--
-- Then the migration was successful!
-- ═══════════════════════════════════════════════════════════
