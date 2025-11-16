# Resend SMTP Configuration for Supabase

## Problem

Users are being registered in Supabase but not receiving confirmation emails. This happens because Supabase's email confirmation is enabled but no SMTP provider is configured.

## Solution

Configure Supabase to use Resend as the SMTP email provider.

---

## Step 1: Get Your Resend SMTP Credentials

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key or use your existing one
3. Note down these SMTP settings for Resend:
   - **SMTP Host:** `smtp.resend.com`
   - **SMTP Port:** `465` (SSL) or `587` (TLS)
   - **SMTP Username:** `resend`
   - **SMTP Password:** Your Resend API key (starts with `re_`)

---

## Step 2: Configure Supabase SMTP Settings

### Option A: Via Supabase Dashboard (Recommended)

1. **Navigate to Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Open Auth Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **Settings** tab
   - Scroll down to **SMTP Settings** section

3. **Enable Custom SMTP**
   - Toggle **Enable Custom SMTP** to ON

4. **Enter SMTP Configuration**
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 465
   SMTP Username: resend
   SMTP Password: [Your Resend API Key - starts with re_]
   Sender Email: bookings@resend.dev
   Sender Name: Carls Newton
   ```

5. **Save Settings**
   - Click **Save** at the bottom of the page

6. **Test Email Configuration**
   - Scroll to **Email Templates** section
   - Click on **Confirm Signup** template
   - You can customize the template if needed
   - Use the **Send test email** button to verify SMTP works

### Option B: Via Supabase CLI (For Advanced Users)

If you're using Supabase CLI, update your `config.toml`:

```toml
[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = true

[auth.email.smtp]
enabled = true
host = "smtp.resend.com"
port = 465
user = "resend"
pass = "env(RESEND_API_KEY)"
admin_email = "bookings@resend.dev"
sender_name = "Carls Newton"
```

---

## Step 3: Update Email Templates (Optional)

You have beautiful email templates in the `supabase-email-templates/` folder. To use them:

1. **Go to Email Templates in Supabase**
   - Authentication → Email Templates

2. **Update "Confirm Signup" Template**
   - Click on **Confirm signup**
   - Copy the content from `supabase-email-templates/email-confirm-signup.html`
   - Paste it into the email template editor
   - Click **Save**

3. **Available Template Variables**
   - `{{ .ConfirmationURL }}` - The confirmation link
   - `{{ .Email }}` - User's email address
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .Token }}` - Confirmation token
   - `{{ .TokenHash }}` - Hashed token

---

## Step 4: Configure Sender Email in Resend

1. **Verify Your Domain (Production)**
   - Go to [Resend Domains](https://resend.com/domains)
   - Add and verify your domain (e.g., `carlsnewton.com`)
   - Update DNS records as instructed
   - Once verified, update sender email to `noreply@carlsnewton.com`

2. **For Testing (Development)**
   - You can use `bookings@resend.dev` (Resend's test domain)
   - Emails will be sent but may have limitations
   - Always verify domain for production use

---

## Step 5: Update Environment Variables

Make sure these are set in your `.env`:

```bash
# Resend API Key (for custom API endpoints)
RESEND_API_KEY=re_your_resend_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Step 6: Test the Email Flow

1. **Clear Any Test Users**
   - Go to Authentication → Users in Supabase
   - Delete any test users you created earlier

2. **Test User Registration**
   - Go to your app and register a new user
   - Check the email inbox for the confirmation email
   - Click the confirmation link
   - Verify that you can sign in

3. **Check Logs**
   - Supabase Dashboard → Logs → Auth Logs
   - Look for email send events
   - Verify there are no errors

---

## Troubleshooting

### "No email received"

1. **Check SMTP Configuration**
   - Verify all SMTP settings are correct
   - Make sure the Resend API key is valid
   - Test with Supabase's "Send test email" button

2. **Check Spam/Junk Folder**
   - Confirmation emails might be marked as spam initially
   - Once domain is verified, this should improve

3. **Verify Resend API Key**
   - Make sure the API key has permissions to send emails
   - Check Resend dashboard for any sending errors

4. **Check Supabase Auth Logs**
   - Dashboard → Logs → Auth Logs
   - Look for email send errors

### "Email sent but confirmation doesn't work"

1. **Check Email Confirmation Settings**
   - Authentication → Settings
   - Make sure **Enable email confirmations** is ON

2. **Verify Redirect URL**
   - The `emailRedirectTo` should match your site URL
   - Check Site URL in Authentication → URL Configuration

### "SMTP Connection Error"

1. **Verify SMTP Port**
   - Use `465` for SSL
   - Use `587` for TLS (recommended)

2. **Check Firewall**
   - Ensure port 465 or 587 is not blocked
   - Supabase should have access to external SMTP

---

## Alternative: Disable Email Confirmation (Not Recommended)

If you want to test without email confirmation temporarily:

1. Go to **Authentication → Settings**
2. Scroll to **Email Auth**
3. Turn OFF **Enable email confirmations**
4. Click **Save**

⚠️ **Warning:** This is not recommended for production as it allows anyone to create accounts without verifying their email address.

---

## Additional Notes

- **Production Setup:** Always verify your domain in Resend before going to production
- **Email Deliverability:** Verified domains have better deliverability rates
- **Rate Limits:** Resend has rate limits on the free plan - check your plan limits
- **Custom Templates:** The templates in `supabase-email-templates/` are ready to use
- **Multiple Environments:** Use different Resend API keys for dev/staging/production

---

## Summary Checklist

- [ ] Get Resend SMTP credentials
- [ ] Configure Supabase SMTP settings
- [ ] Update email templates (optional)
- [ ] Verify domain in Resend (production)
- [ ] Test user registration flow
- [ ] Verify confirmation emails are received
- [ ] Check confirmation links work
- [ ] Monitor auth logs for errors

---

## Support

If you encounter issues:
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Resend Support: [resend.com/docs](https://resend.com/docs)
- Check Supabase Auth Logs for detailed error messages
