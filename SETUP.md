# Carls Newton Booking System - Setup Guide

This guide will help you set up the complete booking management system for Carls Newton's science show business.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Deployment](#deployment)
5. [Admin Access](#admin-access)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Resend account for email notifications (free tier works)
- A Netlify account for deployment (free tier works)

## Environment Variables

### Step 1: Create Environment File

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### Step 2: Configure Supabase

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project (or use existing)
3. Go to Project Settings → API
4. Copy your:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon/Public Key → `VITE_SUPABASE_ANON_KEY`
5. Update your `.env` file with these values

### Step 3: Configure Resend

1. Go to [Resend](https://resend.com)
2. Create an account and verify your domain (or use their test domain)
3. Go to API Keys section
4. Create a new API key
5. Copy the key → `RESEND_API_KEY`
6. Update your `.env` file with this value

## Database Setup

### Supabase Schema

Run this SQL in your Supabase SQL Editor (Database → SQL Editor):

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('preschool', 'classic', 'halfday')),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  price INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for booking form)
CREATE POLICY "Allow anonymous inserts" ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow anonymous reads (for calendar availability)
CREATE POLICY "Allow anonymous reads" ON public.bookings
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow authenticated updates (for admin)
CREATE POLICY "Allow authenticated updates" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Verify Database Setup

After running the SQL:

1. Go to Table Editor in Supabase
2. You should see a `bookings` table
3. Check that all columns are present
4. Verify that RLS is enabled (shield icon should be visible)

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# The site will be available at http://localhost:5173
```

### Deploy to Netlify

#### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Deploy
netlify deploy --prod
```

#### Option 2: Deploy via Netlify Dashboard

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
6. Add environment variables in Netlify:
   - Go to Site settings → Environment variables
   - Add all variables from `.env` file
7. Deploy!

### Environment Variables in Netlify

Add these in Netlify Dashboard → Site settings → Environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`

## Admin Access

### Accessing the Admin Panel

The admin booking management panel is accessible at:

```
https://your-site.netlify.app/admin
```

**Note:** Currently, the admin panel is publicly accessible. For production use, you should:

1. Add authentication (Supabase Auth, Auth0, etc.)
2. Protect the `/admin` route
3. Update RLS policies to restrict admin operations

### Admin Features

- View all bookings (pending, confirmed, cancelled)
- Filter bookings by status
- Confirm pending bookings
- Mark bookings as paid
- Cancel bookings
- See customer details and booking information

## Package Information

The system supports three package types:

1. **Preschool Special** - AED 1,200 (30-45 mins)
2. **Classic Show** - AED 1,800 (45-60 mins)
3. **Half-Day Experience** - AED 2,500 (4 hours)

## Booking Rules

- **Operating Hours:** First show at 8:00 AM, last booking at 4:00 PM
- **Half-Day Bookings:** Block the entire day (only 1 per day)
- **Classic/Preschool:** Maximum 3 shows per day
- **Buffer Time:** 2-hour minimum buffer between shows

## Email Notifications

When a booking is created:

1. Customer submits booking form
2. Booking is saved to Supabase with "pending" status
3. Email notification is sent to: `carls.newton10@gmail.com`
4. Email includes all booking details
5. Admin can confirm/manage booking via admin panel

## Troubleshooting

### Database Connection Issues

- Verify Supabase URL and key in environment variables
- Check that RLS policies are correctly configured
- Ensure the bookings table exists

### Email Not Sending

- Verify Resend API key is correct
- Check that the key has send permissions
- Verify the sending domain is configured in Resend
- Check Netlify function logs for errors

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 18+
- Verify all import paths are correct
- Check browser console for errors

## Support

For issues or questions:

- Check the Supabase documentation: https://supabase.com/docs
- Check the Resend documentation: https://resend.com/docs
- Check the Netlify documentation: https://docs.netlify.com

## License

This project is proprietary software for Carls Newton's Science Shows.
