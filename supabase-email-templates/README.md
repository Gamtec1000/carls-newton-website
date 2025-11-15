# Supabase Email Templates - Carls Newton

This folder contains custom branded email templates for Supabase authentication emails.

## 📁 Files

| File | Purpose | Subject Line |
|------|---------|--------------|
| `email-confirm-signup.html` | New user email confirmation | Welcome to Carls Newton! Confirm Your Email 🚀 |
| `email-reset-password.html` | Password reset requests | Reset Your Carls Newton Password 🔑 |
| `email-magic-link.html` | Passwordless sign-in | Your Carls Newton Sign In Link ✨ |
| `email-change-email.html` | Email address change confirmation | Confirm Your New Email Address 📧 |

## 🚀 Quick Start

1. **Read the setup guide**: Open `SMTP_CONFIGURATION_GUIDE.md`
2. **Configure SMTP** in Supabase dashboard with Resend credentials
3. **Copy each HTML template** into corresponding Supabase email template
4. **Test emails** by creating an account or resetting password
5. **Verify branding** matches Carls Newton design

## 🎨 Design Features

All templates include:
- ✅ Carls Newton brand colors (magenta, cyan, purple)
- ✅ Responsive mobile-friendly design
- ✅ Inline CSS for email client compatibility
- ✅ Clear call-to-action buttons with gradients
- ✅ WhatsApp and email contact info in footer
- ✅ Security notices and expiration warnings
- ✅ Professional yet fun/exciting tone

## 📧 SMTP Settings (Resend)

```
Host: smtp.resend.com
Port: 587
User: resend
Password: YOUR_RESEND_API_KEY
Sender: noreply@carlsnewton.com
```

## ✅ Before Going Live

- [ ] Domain verified in Resend dashboard
- [ ] SMTP configured in Supabase
- [ ] Test email successfully sent
- [ ] All 4 templates updated in Supabase
- [ ] Signup email tested
- [ ] Password reset email tested
- [ ] Links work correctly
- [ ] Mobile display verified

## 📚 Resources

- **Resend Dashboard**: https://resend.com/
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Supabase Email Docs**: https://supabase.com/docs/guides/auth/auth-email-templates

## 💡 Tips

1. **Test with real email first** before going live
2. **Check spam folder** initially as new sender may be flagged
3. **Use email testing tools** like mail-tester.com to verify deliverability
4. **Monitor Supabase logs** for email sending errors
5. **Keep templates updated** if you change branding

## 🆘 Support

If you need help:
- Check `SMTP_CONFIGURATION_GUIDE.md` for detailed instructions
- Review Supabase auth logs for errors
- Contact Resend support for SMTP issues
- Contact Supabase support for template issues

---

**Created for**: Carls Newton Science Education Services
**Last Updated**: 2025
**Maintained By**: Development Team
