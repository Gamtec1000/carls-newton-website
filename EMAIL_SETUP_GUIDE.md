# Email Setup Guide - Resend Configuration

This guide explains how to configure email sending for booking confirmations using Resend.

## Problem
Confirmation emails are not being sent when confirming bookings in the admin console.

## Root Cause
The `RESEND_API_KEY` environment variable is not configured or is missing.

## Solution

### Option 1: Local Development

1. **Get your Resend API Key**
   - Sign up or log in at [Resend](https://resend.com)
   - Go to [API Keys](https://resend.com/api-keys)
   - Create a new API key or copy an existing one
   - It will look like: `re_123abc456def789...`

2. **Create `.env` file** (if it doesn't exist)
   ```bash
   cp .env.example .env
   ```

3. **Add your Resend API key to `.env`**
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

4. **Restart your development server**
   ```bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm run dev
   ```

### Option 2: Vercel (Production/Deployed)

1. **Go to your Vercel project**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project (`carls-newton-website`)

2. **Add Environment Variable**
   - Go to **Settings → Environment Variables**
   - Click **Add New**
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (e.g., `re_123abc456def789...`)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

3. **Redeploy your application**
   - Go to **Deployments**
   - Click on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

## Verify It's Working

### Check Server Logs

When you confirm a booking, check the server logs for:

**✅ Success:**
```
📧 Sending confirmation email for booking: BK-12345
📧 Recipient email: customer@example.com
✅ Confirmation email sent successfully to: customer@example.com
```

**❌ Missing API Key Error:**
```
❌ Email sending failed: RESEND_API_KEY environment variable is not configured
```

**❌ Invalid API Key Error:**
```
❌ Email sending failed: Invalid API key
```

### Check Admin Console

After confirming a booking:

**✅ Email sent successfully:**
- Modal shows: "✅ Booking confirmed! Confirmation email with payment link sent to customer."
- Modal auto-closes after 2 seconds

**⚠️ Email failed:**
- Modal shows: "⚠️ Booking confirmed, but email failed to send."
- Modal shows the specific error message
- Modal stays open so you can see the error
- You need to manually notify the customer

### Where to Find Server Logs

**Local Development:**
- Check your terminal where you ran `npm run dev`
- Look for lines starting with 📧, ✅, or ❌

**Vercel (Production):**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments**
4. Click on the latest deployment
5. Click **Functions** tab
6. Find the `update-booking` function
7. Click to view logs
8. Look for the 📧, ✅, or ❌ messages

## Testing Email Sending

### Test with a Real Booking

1. Create a test booking (or use an existing pending booking)
2. Open the booking in admin console
3. Generate or enter a Stripe payment link
4. Click "Confirm & Send Payment Link"
5. Watch the browser console and server logs

**Expected Result:**
- Server logs show: "✅ Confirmation email sent successfully"
- Modal shows success message
- Customer receives confirmation email with payment link

### Test Cards for Stripe Payment Links

If you need to generate test payment links:
- Use Stripe test mode API keys
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

## Resend Configuration Details

### From Address
The confirmation emails are sent from:
```
Carls Newton Bookings <bookings@resend.dev>
```

**Note:** For production, you should:
1. Add a custom domain in Resend
2. Verify the domain
3. Update `api/update-booking.js` line 124 to use your verified domain
4. Example: `from: 'Carls Newton Bookings <bookings@carlsnewton.com>'`

### Email Template
The confirmation email includes:
- ✅ Booking details (date, time, location, price)
- 💳 Stripe payment link (if payment pending)
- 💬 WhatsApp contact button
- 📧 Contact information
- 🔬 What to expect section

## Troubleshooting

### Email Still Not Sending

1. **Check API Key Format**
   - Should start with `re_`
   - No quotes, spaces, or extra characters
   - Copy directly from Resend dashboard

2. **Check Environment Variables Are Loaded**
   - Restart your development server
   - For Vercel: Redeploy after adding variables

3. **Check Resend Account Status**
   - Log in to [Resend](https://resend.com)
   - Check if your account is active
   - Check if you've exceeded sending limits

4. **Check Email Recipient**
   - Make sure the booking has a valid email address
   - Check spam folder

5. **View Detailed Logs**
   - Check server logs (terminal or Vercel functions)
   - Look for the full error message after "❌ Email sending failed:"

### Common Errors

**"RESEND_API_KEY environment variable is not configured"**
- Solution: Add RESEND_API_KEY to .env or Vercel environment variables

**"Invalid API key"**
- Solution: Double-check your API key in Resend dashboard
- Make sure you copied the entire key
- Regenerate a new key if needed

**"Rate limit exceeded"**
- Solution: Wait or upgrade your Resend plan
- Free tier: 100 emails/day

**"Invalid from address"**
- Solution: Use a verified domain in Resend
- Or use the default `bookings@resend.dev` for testing

## Security Notes

- ✅ **Never commit `.env` to git** - It's already in `.gitignore`
- ✅ **Use environment variables** - Don't hardcode API keys
- ✅ **Keep API keys secret** - Don't share in screenshots or logs
- ✅ **Use different keys** - Test key for dev, production key for live

## Need Help?

If you're still having issues:

1. Check browser console for frontend errors
2. Check server logs (terminal or Vercel) for backend errors
3. Verify RESEND_API_KEY is set correctly
4. Try generating a new API key in Resend
5. Test with a simple booking first

## Environment Variables Checklist

Make sure these are set:

```env
# Email
RESEND_API_KEY=re_xxxxxxxxxxxx

# Supabase (for database)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_xxxx (or sk_live_xxxx for production)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

All of these are required for the full booking workflow to work.
