# Supabase Custom SMTP & Email Templates Configuration Guide

## 🎯 Overview

This guide will help you configure custom SMTP settings and branded email templates for Supabase authentication emails.

---

## 📧 STEP 1: Get SMTP Credentials from Resend

### Option A: Using Resend SMTP (Recommended)

1. **Log in to Resend Dashboard**: https://resend.com/
2. **Navigate to API Keys**: Click on "API Keys" in the sidebar
3. **Create SMTP credentials** or use existing API key

### Resend SMTP Settings:

```
SMTP Host: smtp.resend.com
SMTP Port: 587 (or 465 for SSL)
SMTP Username: resend
SMTP Password: YOUR_RESEND_API_KEY (same as RESEND_API_KEY)
Encryption: TLS (STARTTLS)
Sender Email: noreply@carlsnewton.com
Sender Name: Carls Newton
```

**Important**: Make sure `carlsnewton.com` domain is verified in Resend dashboard with proper DNS records.

---

## 🔧 STEP 2: Configure SMTP in Supabase Dashboard

### Access Supabase SMTP Settings:

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your **carls-newton** project
3. Navigate to: **Settings** → **Authentication** (left sidebar)
4. Scroll down to **SMTP Settings** section
5. Click **Enable Custom SMTP**

### Enter SMTP Configuration:

Fill in the following fields:

```yaml
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: <YOUR_RESEND_API_KEY>
SMTP Sender Email: noreply@carlsnewton.com
SMTP Sender Name: Carls Newton
Enable SSL: No (use TLS/STARTTLS instead)
Enable STARTTLS: Yes
```

### Test SMTP Connection:

After entering the details:
- Click **"Send Test Email"**
- Enter your email address
- Check inbox (and spam folder) for test email
- If successful, click **"Save"**

---

## 📝 STEP 3: Configure Email Templates

### Access Email Templates:

1. In Supabase Dashboard: **Settings** → **Authentication**
2. Scroll to **Email Templates** section
3. You'll see templates for:
   - Confirm signup
   - Invite user
   - Magic Link
   - Change Email Address
   - Reset Password

### Template Variables Available:

Supabase provides these variables for use in templates:

- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .Token }}` - Confirmation token
- `{{ .TokenHash }}` - Token hash
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address
- `{{ .RedirectTo }}` - Redirect URL after confirmation

---

## 🎨 STEP 4: Update Each Email Template

### 1. Confirm Signup Template

**Subject**: `Welcome to Carls Newton! Confirm Your Email 🚀`

**Template**: Copy the HTML from `email-confirm-signup.html`

### 2. Reset Password Template

**Subject**: `Reset Your Carls Newton Password 🔑`

**Template**: Copy the HTML from `email-reset-password.html`

### 3. Magic Link Template

**Subject**: `Your Carls Newton Sign In Link ✨`

**Template**: Copy the HTML from `email-magic-link.html`

### 4. Change Email Template

**Subject**: `Confirm Your New Email Address`

**Template**: Copy the HTML from `email-change-email.html`

---

## 🧪 STEP 5: Testing Auth Emails

### Test Email Confirmation:

1. Go to your Carls Newton website
2. Create a new account with a test email
3. Check the email inbox for confirmation email
4. Verify branding, styling, and confirmation link work

### Test Password Reset:

1. Click "Forgot Password" on your login page
2. Enter your email
3. Check inbox for reset password email
4. Click reset link and verify it works

### Test Magic Link (if enabled):

1. Use magic link sign-in option
2. Enter your email
3. Check inbox for magic link email
4. Click link to verify authentication

---

## ⚙️ Alternative: Google Workspace SMTP

If you prefer using Google Workspace SMTP instead of Resend:

```yaml
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@carlsnewton.com
SMTP Password: <APP PASSWORD - NOT your regular password>
SMTP Sender Email: noreply@carlsnewton.com
SMTP Sender Name: Carls Newton
Enable STARTTLS: Yes
```

**To create Google App Password**:
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate new app password
4. Copy the 16-character password

---

## 🚨 Troubleshooting

### Emails Not Sending:

1. **Check SMTP credentials** - Verify API key is correct
2. **Check domain verification** - Ensure carlsnewton.com is verified in Resend
3. **Check spam folder** - Auth emails might be flagged initially
4. **Check Supabase logs** - Settings → Logs → Auth logs
5. **Test SMTP connection** - Use "Send Test Email" button

### Emails Look Broken:

1. **Test in multiple email clients** - Gmail, Outlook, Apple Mail
2. **Check HTML syntax** - Ensure no broken tags
3. **Inline CSS** - Email clients require inline styles
4. **Test on mobile** - Use responsive design testing

### Variables Not Working:

1. **Use correct syntax** - `{{ .ConfirmationURL }}` not `{{ConfirmationURL}}`
2. **Check Supabase docs** - Verify variable names haven't changed
3. **Test with real signup** - Variables only populate with actual auth events

---

## 📚 Additional Resources

- **Resend Documentation**: https://resend.com/docs
- **Supabase Auth Email Templates**: https://supabase.com/docs/guides/auth/auth-email-templates
- **Email Testing Tool**: https://www.mail-tester.com/

---

## ✅ Checklist

Before going live, verify:

- [ ] SMTP credentials configured in Supabase
- [ ] Test email sent successfully
- [ ] Domain verified in Resend
- [ ] All 4 email templates updated with branded HTML
- [ ] Test signup email received and works
- [ ] Test password reset email received and works
- [ ] Emails display correctly on mobile
- [ ] Emails don't land in spam
- [ ] All links in emails work correctly
- [ ] Branding matches Carls Newton website

---

## 🎉 You're Done!

Your Supabase authentication emails will now use custom SMTP and branded templates matching Carls Newton's design!

**Support**: If you encounter issues, check Supabase logs or Resend logs for detailed error messages.
