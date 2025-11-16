-- Migration: Backfill profiles for existing users
-- This creates profile records for users who registered before the trigger was added

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

-- Report how many profiles were created
DO $$
DECLARE
  created_count INTEGER;
BEGIN
  GET DIAGNOSTICS created_count = ROW_COUNT;
  RAISE NOTICE 'Created % profile(s) for existing users', created_count;
END $$;
