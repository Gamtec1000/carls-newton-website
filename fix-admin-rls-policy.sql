-- Fix RLS Policy for admin_users table
-- This ensures authenticated users can check if they have admin permissions

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can read their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can read admin_users" ON admin_users;

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin_users table
-- This is necessary for the checkAdminPermission function to work
CREATE POLICY "Authenticated users can read admin_users"
ON admin_users
FOR SELECT
TO authenticated
USING (true);

-- Optional: Allow super_admins to manage admin users
CREATE POLICY "Super admins can manage admin_users"
ON admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND role = 'super_admin'
  )
);

-- Verify the policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'admin_users';
