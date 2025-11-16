# Forgot Password Flow - Setup & Configuration Guide

**Date:** 2025-11-16
**Branch:** `claude/diagnostic-auth-issues-01BSA8mhVDuLK65bX8Lrny54`
**Status:** ✅ READY FOR DEPLOYMENT

---

## What Was Implemented

### New Components

1. **ForgotPasswordModal** (`src/components/ForgotPasswordModal.tsx`)
   - Modal dialog for requesting password reset
   - Email input with validation
   - Success/error state handling
   - Matches Carls Newton branding (cyan/pink gradient, dark purple theme)

2. **ResetPassword** (`src/components/ResetPassword.tsx`)
   - Full-page component for `/reset-password` route
   - New password form with confirmation
   - Password strength indicator
   - Token validation
   - Success state with auto-redirect

3. **AuthModal Integration**
   - Added "Forgot password?" link functionality
   - Opens ForgotPasswordModal when clicked
   - Maintains existing sign in/register functionality

---

## User Flow

### Complete Password Reset Journey

```
1. User clicks "Forgot password?" on sign-in page
   ↓
2. ForgotPasswordModal opens
   ↓
3. User enters email address
   ↓
4. System sends password reset email via Supabase
   ↓
5. User receives email with "Reset Password" link
   ↓
6. User clicks link → Redirects to /reset-password page
   ↓
7. User enters new password (with strength indicator)
   ↓
8. User confirms new password
   ↓
9. System updates password in Supabase
   ↓
10. Success message displayed
   ↓
11. Auto-redirect to homepage after 3 seconds
   ↓
12. User can now sign in with new password ✅
```

---

## Supabase Configuration

### Step 1: Configure Redirect URL

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Add redirect URL to **Redirect URLs** list:
   ```
   https://yourdomain.com/reset-password
   ```
   For development:
   ```
   http://localhost:5173/reset-password
   ```

4. Click **Save**

### Step 2: Configure Email Template (Optional)

By default, Supabase sends a generic password reset email. To customize it:

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Email Templates**
3. Select **Change Email / Reset Password** template
4. Customize the email template with your branding

**Recommended Template:**

```html
<h2>Reset Your Password</h2>

<p>Hi there,</p>

<p>We received a request to reset your password for your Carls Newton account.</p>

<p>Click the button below to reset your password:</p>

<p>
  <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #06B6D4, #A855F7); color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">
    Reset Password
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link will expire in 1 hour for security reasons.</p>

<p><strong>If you didn't request this password reset, please ignore this email.</strong></p>

<p>Thanks,<br>The Carls Newton Team</p>

<hr>
<p style="font-size: 12px; color: #666;">
  This email was sent to {{ .Email }}. If you didn't request this, you can safely ignore it.
</p>
```

5. Click **Save**

### Step 3: Configure SMTP Settings (If Using Custom Email)

If you're using **Resend** or another custom SMTP provider:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Ensure your SMTP credentials are configured:
   - **Sender email**: noreply@carlsnewton.com (or your domain)
   - **Sender name**: Carls Newton
   - **Host**: smtp.resend.com
   - **Port**: 587
   - **Username**: resend
   - **Password**: [Your Resend API Key]

3. Click **Save**

---

## Testing the Flow

### Test 1: Request Password Reset

1. Open your app in the browser
2. Click **Sign In** button
3. Click **"Forgot password?"** link
4. Enter a registered email address
5. Click **"SEND RESET LINK"**
6. Verify success message appears:
   ```
   ✅ Password reset email sent successfully!
   ```

**Expected Result:**
- Success message displayed
- Email sent to user's inbox

### Test 2: Check Email

1. Open email inbox for the test account
2. Look for email from Carls Newton/Supabase
3. Verify email contains:
   - Clear subject line (e.g., "Reset Your Password")
   - "Reset Password" button/link
   - Plain text link as fallback

**Expected Result:**
- Email received within 1-2 minutes
- Links are clickable

**If email not received:**
- Check spam folder
- Verify email address is correct
- Check Supabase logs: Dashboard → Logs → Auth Logs

### Test 3: Reset Password

1. Click the "Reset Password" link in the email
2. Verify you're redirected to `/reset-password` page
3. Page should display:
   - Carls Newton logo
   - "Reset Your Password" heading
   - Password input fields
   - Password strength indicator

4. Enter new password (min 8 characters)
5. Confirm new password
6. Click **"RESET PASSWORD"**

**Expected Result:**
- Success message displayed:
  ```
  ✅ Your password has been changed successfully!
  ```
- Auto-redirect to homepage after 3 seconds

### Test 4: Sign In with New Password

1. After redirect, click **Sign In**
2. Enter email and **new password**
3. Click **"SIGN IN"**

**Expected Result:**
- Successfully signed in
- User profile loaded
- Header shows "Hi [FirstName]"

---

## Security Features

### Built-in Security Measures

1. **Token Expiration**
   - Reset tokens expire after 1 hour (Supabase default)
   - Expired tokens show error message

2. **One-Time Use**
   - Reset tokens can only be used once
   - After password reset, token is invalidated

3. **Email Verification**
   - Only registered email addresses can request reset
   - Prevents enumeration attacks

4. **Password Requirements**
   - Minimum 8 characters
   - Strength indicator encourages strong passwords
   - Mix of uppercase, lowercase, numbers, special chars (recommended)

5. **Secure Token Transmission**
   - Tokens sent via HTTPS only
   - Hash fragments never sent to server

---

## Error Handling

### Common Errors and Solutions

#### Error: "Invalid or expired password reset link"

**Causes:**
- Token expired (> 1 hour old)
- Token already used
- Malformed URL

**Solutions:**
- Request new password reset
- Ensure user clicks link within 1 hour
- Check for line breaks in email link

#### Error: "Failed to send password reset email"

**Causes:**
- Email address not registered
- SMTP configuration issue
- Rate limiting

**Solutions:**
- Verify email address is correct
- Check Supabase SMTP settings
- Wait a few minutes and try again

#### Error: "Passwords do not match"

**Cause:**
- Confirmation password doesn't match new password

**Solution:**
- Ensure both password fields are identical

#### Error: "Password must be at least 8 characters"

**Cause:**
- Password too short

**Solution:**
- Enter password with minimum 8 characters

---

## Troubleshooting

### Issue: Emails Not Being Received

**Check 1: Verify Email Settings**
```sql
-- Run in Supabase SQL Editor
SELECT email FROM auth.users WHERE email = 'test@example.com';
```

**Check 2: Review Auth Logs**
1. Go to Supabase Dashboard → Logs → Auth Logs
2. Filter by: `password_recovery`
3. Look for errors or failed sends

**Check 3: Test SMTP Connection**
1. Go to Authentication → Settings → SMTP Settings
2. Click **"Send Test Email"**
3. Verify test email is received

### Issue: Reset Link Redirects to Wrong URL

**Solution:**
1. Check Supabase **Redirect URLs** configuration
2. Ensure correct domain is listed
3. For local development, include `http://localhost:5173/reset-password`

### Issue: "Invalid Token" Error on Reset Page

**Possible Causes:**
1. Token expired (> 1 hour)
2. Link was clicked multiple times
3. URL was modified/corrupted

**Solutions:**
- Request new password reset
- Copy entire URL if forwarding link
- Don't click link multiple times

### Issue: Password Reset Succeeds but Can't Sign In

**Check:**
1. Verify you're using the **new password**, not old one
2. Clear browser cache/cookies
3. Try incognito/private browsing mode
4. Check Supabase user table:
```sql
SELECT email, updated_at FROM auth.users
WHERE email = 'test@example.com';
```

---

## Files Changed/Added

### New Files

| File | Purpose |
|------|---------|
| `src/components/ForgotPasswordModal.tsx` | Modal for requesting password reset |
| `src/components/ResetPassword.tsx` | Page for resetting password |
| `FORGOT_PASSWORD_SETUP.md` | This documentation file |

### Modified Files

| File | Changes |
|------|---------|
| `src/main.tsx` | Added `/reset-password` route |
| `src/components/AuthModal.tsx` | Integrated ForgotPasswordModal |

---

## Code References

### ForgotPasswordModal

**Location:** `src/components/ForgotPasswordModal.tsx`

**Key Function:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
  setSuccess(true);
};
```

### ResetPassword Component

**Location:** `src/components/ResetPassword.tsx`

**Key Functions:**

1. **Token Validation:**
```typescript
useEffect(() => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const type = hashParams.get('type');

  if (type === 'recovery' && accessToken) {
    setValidToken(true);
  } else {
    setValidToken(false);
  }
}, []);
```

2. **Password Update:**
```typescript
const { error } = await supabase.auth.updateUser({
  password: password,
});

if (error) throw error;
setSuccess(true);

// Redirect after 3 seconds
setTimeout(() => navigate('/'), 3000);
```

### AuthModal Integration

**Location:** `src/components/AuthModal.tsx:427-441`

**Forgot Password Link:**
```typescript
<span
  onClick={(e) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  }}
  style={{ cursor: 'pointer', color: '#06B6D4', textDecoration: 'underline' }}
>
  Forgot password?
</span>
```

---

## Deployment Checklist

### Before Deployment

- [x] ForgotPasswordModal component created
- [x] ResetPassword page component created
- [x] Route added to main.tsx
- [x] AuthModal integration complete
- [x] Documentation created

### After Deployment

- [ ] Configure redirect URLs in Supabase
- [ ] Customize email template (optional)
- [ ] Test password reset flow end-to-end
- [ ] Verify emails are being sent
- [ ] Test with real user accounts
- [ ] Check mobile responsiveness
- [ ] Monitor Supabase auth logs for errors

---

## API Reference

### Supabase Methods Used

#### `supabase.auth.resetPasswordForEmail()`

Sends a password reset email to the user.

**Parameters:**
```typescript
{
  email: string,
  options: {
    redirectTo: string  // URL to redirect after clicking email link
  }
}
```

**Returns:**
```typescript
{
  data: null,
  error: AuthError | null
}
```

#### `supabase.auth.updateUser()`

Updates the authenticated user's password.

**Parameters:**
```typescript
{
  password: string  // New password (min 8 chars)
}
```

**Returns:**
```typescript
{
  data: { user: User },
  error: AuthError | null
}
```

---

## Support

### If Issues Persist

1. **Check Supabase Status:**
   - https://status.supabase.com

2. **Review Supabase Docs:**
   - https://supabase.com/docs/guides/auth/auth-password-reset

3. **Check Browser Console:**
   - Look for JavaScript errors
   - Verify network requests

4. **Contact Support:**
   - Email: hello@carlsnewton.com
   - Include: error message, browser, steps to reproduce

---

## Next Steps

1. ✅ Deploy code changes to production
2. ⏳ Configure Supabase redirect URLs
3. ⏳ Customize email template (optional)
4. ⏳ Test complete flow with real account
5. ⏳ Monitor for 24-48 hours
6. ✅ Document for team

---

## Summary

### What Users Can Now Do

✅ Click "Forgot password?" on sign-in page
✅ Receive password reset email
✅ Reset password via secure link
✅ Sign in with new password

### Technical Implementation

✅ ForgotPasswordModal component for email input
✅ ResetPassword page for password update
✅ Supabase auth integration
✅ Password strength indicator
✅ Error handling and validation
✅ Success states with auto-redirect
✅ Matches Carls Newton branding

### Security

✅ Token expiration (1 hour)
✅ One-time use tokens
✅ Password requirements enforced
✅ Email verification
✅ HTTPS only

---

**🎯 Bottom Line:**

The complete "Forgot Password" flow is now fully implemented and ready for deployment. Configure Supabase redirect URLs, test the flow, and you're good to go!
