# Authentication Setup Guide

## Issues Fixed

1. ✅ **Deprecated Supabase initialization** - Updated to use the new options object format
2. ✅ **SignUpData interface mismatch** - Added missing fields (job_position, subscribe_newsletter)
3. ✅ **Profile table schema** - Updated to include all required fields

## Database Setup Required

The 404 error on `/rest/v1/profiles` and 400 error on sign-in indicate that your Supabase database tables need to be created.

### Steps to Set Up Database:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Setup SQL**
   - Copy the entire contents of `database-setup.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should now see these tables:
     - `profiles`
     - `user_preferences`
     - `bookings`

### Environment Variables

Make sure you have these environment variables set:

**Recommended** (works for both local and Vercel):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Alternative** for local Vite development only:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: The code supports both. Use `NEXT_PUBLIC_*` for consistency across environments.

For **Vercel deployment** (if not using NEXT_PUBLIC_):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Email Configuration (Required for Email Verification)

⚠️ **IMPORTANT:** If users are not receiving confirmation emails, you need to configure SMTP.

For sign-up email verification to work:

1. **Configure Resend SMTP** - See detailed guide: [RESEND_SMTP_SETUP.md](./RESEND_SMTP_SETUP.md)
2. Go to **Authentication** → **Settings** → **SMTP Settings** in Supabase Dashboard
3. Enable Custom SMTP and enter Resend credentials
4. Customize email templates under **Authentication** → **Email Templates**

**Quick Setup:**
- SMTP Host: `smtp.resend.com`
- SMTP Port: `465` or `587`
- Username: `resend`
- Password: Your Resend API Key

See [RESEND_SMTP_SETUP.md](./RESEND_SMTP_SETUP.md) for complete step-by-step instructions.

### Test the Authentication

After running the database setup:

1. **Try to Register**
   - Open your app and click "Sign In"
   - Switch to "Register" tab
   - Fill out the form and create an account
   - Check your email for verification (if email is configured)

2. **Try to Sign In**
   - Use the credentials you just created
   - You should be able to sign in successfully

### Troubleshooting

**Still getting 400 errors on sign-in?**
- Make sure the user account exists in Supabase (check Authentication → Users)
- Verify the email is confirmed (or disable email confirmation in Supabase settings)
- Check browser console for detailed error messages

**Getting 404 on profiles?**
- Verify the tables were created (check Table Editor)
- Ensure RLS policies are enabled (run the SQL again if needed)
- Check that your Supabase URL and anon key are correct

**Email verification issues?**
- You can disable email confirmation temporarily:
  - Go to Authentication → Settings
  - Uncheck "Enable email confirmations"
  - Save changes

## Database Schema

### profiles table
- `id` (UUID, Primary Key, references auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `school_organization` (TEXT, optional)
- `phone` (TEXT, optional)
- `job_position` (TEXT, optional)
- `subscribe_newsletter` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### user_preferences table
- `id` (UUID, Primary Key)
- `user_id` (UUID, references auth.users)
- `interest_type` (TEXT: 'science_topic', 'resource_type', 'methodology')
- `interest_value` (TEXT)
- `created_at` (TIMESTAMPTZ)

### bookings table
- `id` (UUID, Primary Key)
- `user_id` (UUID, references auth.users)
- `booking_date` (DATE)
- `booking_time` (TEXT)
- `package_type` (TEXT)
- `number_of_students` (INTEGER)
- `special_requests` (TEXT)
- `status` (TEXT: 'pending', 'confirmed', 'cancelled')
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Security Features

The database setup includes:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies to ensure users can only access their own data
- ✅ Automatic timestamp updates
- ✅ Proper foreign key constraints
- ✅ Data validation with CHECK constraints

## Next Steps

After setting up the database:
1. Test user registration
2. Test user sign-in
3. Verify user profile is created correctly
4. Test booking functionality
5. Configure email templates for better user experience
