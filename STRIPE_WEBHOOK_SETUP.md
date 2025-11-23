# Stripe Webhook Setup Guide

This guide explains how to set up automatic payment status updates when customers pay through Stripe payment links.

## Overview

When a customer completes payment through a Stripe payment link:
1. Stripe sends a webhook event to your server
2. The webhook handler verifies the event signature
3. The booking's `payment_status` is automatically updated to `'paid'`
4. The booking `status` is automatically updated to `'confirmed'`
5. Admin console immediately shows the updated payment status ✅

## Prerequisites

- Stripe account with API keys
- Access to Stripe Dashboard
- Deployed API endpoint (e.g., on Vercel)

## Step 1: Run Database Migration

First, add the new payment tracking fields to your database:

```bash
# Connect to your Supabase project and run:
psql -h your-project.supabase.co -U postgres -d postgres -f supabase/migrations/add_payment_tracking_fields.sql
```

Or run the SQL directly in Supabase SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/add_payment_tracking_fields.sql`
3. Run the migration

## Step 2: Add Stripe Webhook Secret to Environment Variables

### Vercel (Production)
1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** (will get this in Step 3)
   - **Environment:** Production, Preview, Development

### Local Development
Add to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Configure Webhook in Stripe Dashboard

### 3.1 Go to Stripe Dashboard
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers → Webhooks**
3. Click **Add endpoint**

### 3.2 Configure Endpoint
- **Endpoint URL:** `https://yourdomain.com/api/stripe-webhook`
  - Production: `https://carlsnewton.com/api/stripe-webhook`
  - Development: Use ngrok or Stripe CLI for local testing

### 3.3 Select Events to Listen To
Select these events:
- ✅ `checkout.session.completed` - When customer completes checkout
- ✅ `payment_intent.succeeded` - When payment succeeds
- ✅ `payment_intent.payment_failed` - When payment fails

### 3.4 Get Webhook Signing Secret
1. After creating the webhook, Stripe will show you a **Signing secret**
2. It looks like: `whsec_xxxxxxxxxxxxxxxxxxxxxxx`
3. Copy this secret
4. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 4: Deploy Changes

### Vercel
```bash
git add .
git commit -m "Add Stripe webhook for automatic payment updates"
git push origin main
```

Vercel will automatically deploy your changes.

### Manual Deployment
Make sure these files are deployed:
- `api/stripe-webhook.js` - Webhook handler
- `api/generate-payment-link.js` - Payment link generator (already deployed)
- Environment variables are set correctly

## Step 5: Test the Webhook

### Test with Stripe CLI (Local Development)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhook events to your local server
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Trigger a test event
stripe trigger checkout.session.completed
```

### Test with Real Payment (Stripe Test Mode)
1. Create a test booking
2. Generate a payment link (will use Stripe test mode)
3. Open the payment link
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code
5. Complete payment
6. Check your admin console - booking should show as **PAID** ✅

### Test Card Numbers
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **Requires authentication:** `4000 0025 0000 3155`

## Step 6: Verify It's Working

### Check Webhook Delivery
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. View **Recent events** to see successful deliveries
4. Look for `200` status codes (success)

### Check Application Logs
Monitor your application logs for:
```
✅ Webhook signature verified
Event type: checkout.session.completed
Updating booking: <booking-id>
✅ Booking updated successfully
```

### Check Database
After payment, verify the booking record has:
- `payment_status = 'paid'`
- `status = 'confirmed'`
- `paid_at` timestamp is set
- `payment_intent_id` is populated

## Troubleshooting

### Webhook Returns 400 Error
**Cause:** Signature verification failed
**Fix:**
- Ensure `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe Dashboard
- Check that you're using the correct endpoint URL
- Verify webhook secret hasn't been regenerated

### Webhook Returns 500 Error
**Cause:** Server error processing webhook
**Fix:**
- Check application logs for specific error
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Ensure database migration was run successfully

### Booking Not Updating
**Cause:** Metadata missing or incorrect
**Fix:**
- Verify payment link includes `booking_id` in metadata (check `generate-payment-link.js` line 127)
- Check webhook logs to see if `booking_id` was found
- Ensure booking exists in database

### "No Stripe signature" Error
**Cause:** Body parser is consuming the raw body
**Fix:**
- Webhook endpoint has `bodyParser: false` config (already set in `stripe-webhook.js`)
- Don't modify the webhook endpoint code

## Security Best Practices

1. ✅ **Always verify webhook signatures** - Already implemented
2. ✅ **Use HTTPS in production** - Stripe requires this
3. ✅ **Never expose webhook secret** - Keep in environment variables
4. ✅ **Use service role key for database updates** - Already implemented
5. ⚠️ **Monitor webhook logs** - Check for suspicious activity

## Environment Variables Summary

Make sure these are set:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxx (or sk_live_xxxx for production)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application URL
APP_URL=https://carlsnewton.com

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

## Going Live (Production)

When ready to go live:

1. **Switch to Stripe Live Mode:**
   - Get live API keys from Stripe Dashboard
   - Update `STRIPE_SECRET_KEY` with live key (`sk_live_xxx`)

2. **Update Webhook Endpoint:**
   - In Stripe Dashboard, create a new webhook endpoint
   - Use production URL: `https://carlsnewton.com/api/stripe-webhook`
   - Select same events as test mode
   - Get new signing secret for live mode
   - Update `STRIPE_WEBHOOK_SECRET` with live secret

3. **Test Thoroughly:**
   - Create test booking in production
   - Complete payment with real card
   - Verify booking updates to paid

4. **Monitor:**
   - Check webhook delivery success rate
   - Monitor application logs
   - Set up alerts for webhook failures

## Support

If you encounter issues:
1. Check Stripe Dashboard → Developers → Webhooks → Recent events
2. Check application logs (Vercel → Functions → Logs)
3. Verify all environment variables are set correctly
4. Test with Stripe test cards first

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Payment Links](https://stripe.com/docs/payment-links)
- [Testing Stripe Webhooks](https://stripe.com/docs/webhooks/test)
