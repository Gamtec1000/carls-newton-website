# Supabase Authentication & Database Setup Guide

This guide will help you set up Supabase for the Carls Newton website, including authentication and database tables.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your project's Supabase URL and anon key

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: carls-newton (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be fully provisioned (usually 1-2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Find and copy these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

⚠️ **Important**: Never commit `.env.local` to version control!

## Step 4: Create Database Tables

Go to your Supabase project's **SQL Editor** and run these SQL commands in order:

### 1. Create Profiles Table

```sql
-- Profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  school_organization TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Create User Preferences Table

```sql
-- User preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interest_type TEXT NOT NULL CHECK (interest_type IN ('science_topic', 'resource_type', 'methodology')),
  interest_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
```

### 3. Create Bookings Table

```sql
-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  package_type TEXT NOT NULL,
  number_of_students INTEGER,
  special_requests TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);
```

## Step 5: Configure Email Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Under "Email Auth", ensure these are enabled:
   - ✅ **Enable email signup**
   - ✅ **Enable email confirmations** (recommended for production)

### Email Templates (Optional but Recommended)

You can customize the email templates under **Authentication** → **Email Templates**:
- **Confirm signup**: Email sent when users register
- **Magic link**: Email sent for passwordless login
- **Change email address**: Email sent when users change their email
- **Reset password**: Email sent when users request a password reset

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:5173` (or your dev server URL)

3. Click the "SIGN IN" button in the top navigation

4. Try registering a new account:
   - Fill in the registration form
   - Select some interests
   - Click "CREATE ACCOUNT"

5. Check your email for a confirmation link (if email confirmations are enabled)

6. After confirming, try signing in with your credentials

## Step 7: Verify Database

1. Go to your Supabase project's **Table Editor**
2. You should see these tables:
   - `profiles`
   - `user_preferences`
   - `bookings`

3. Click on `profiles` to see your newly created user profile

4. Click on `user_preferences` to see the interests you selected during registration

## Troubleshooting

### "Invalid API key" Error

- Double-check that you copied the **anon** key, not the **service_role** key
- Ensure there are no extra spaces in your `.env.local` file
- Restart your development server after updating `.env.local`

### Profile Not Created

- Check the SQL Editor for errors when creating the trigger
- Make sure the `handle_new_user()` function was created successfully
- Try manually inserting a profile row for testing

### Email Not Sending

- Supabase has a limit on email sending in free tier
- For development, you can disable email confirmations
- For production, set up a custom SMTP server in **Authentication** → **Settings** → **SMTP Settings**

### RLS (Row Level Security) Errors

- Ensure all RLS policies are created correctly
- Check that the `auth.uid()` matches the logged-in user's ID
- You can temporarily disable RLS for testing (not recommended for production)

## Security Best Practices

1. **Never commit** `.env.local` or expose your API keys
2. **Always use RLS** (Row Level Security) policies in production
3. **Enable email confirmations** for production environments
4. **Use strong passwords** for your database
5. **Regularly rotate** your API keys if they're ever exposed
6. **Set up rate limiting** in Supabase for auth endpoints

## Next Steps

Now that your database is set up, you can:

1. Test the sign in/sign up flow
2. Customize the user profile fields
3. Add more interest categories
4. Implement booking functionality with auto-fill
5. Create a user dashboard to view bookings
6. Set up email notifications for bookings

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Supabase dashboard logs
3. Review the SQL Editor for any failed queries
4. Refer to the Supabase documentation
5. Ask for help in the Supabase Discord community

---

**Happy Building! 🚀**
