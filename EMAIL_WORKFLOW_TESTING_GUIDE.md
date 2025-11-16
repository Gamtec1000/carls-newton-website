# 📧 Email Workflow Testing Guide

**Quick Reference for Testing Booking Confirmation Emails**

---

## 🎯 Quick Test Scenarios

### Test 1: Complete Booking Flow (5 minutes)

**Objective:** Test the entire workflow from booking to confirmation

**Steps:**

1. **Create a Booking**
   ```
   - Go to http://localhost:5173 (or your dev URL)
   - Click "Book Now" or go to booking section
   - Select a future date
   - Fill in booking form:
     * Name: Test User
     * Email: your-test-email@gmail.com
     * Phone: +971 50 123 4567
     * Organization: Test School
     * Package: Classic Show
     * Date: Any future date
     * Time: Morning slot
   - Submit booking
   ```

2. **Check User Email**
   ```
   - Open inbox for your-test-email@gmail.com
   - Look for email with subject: "🎉 Get Ready for an Amazing Science Adventure!"
   - Verify:
     ✓ Booking number is displayed (e.g., CN-001000)
     ✓ Package details are correct
     ✓ Date and time are correct
     ✓ WhatsApp button is present
     ✓ Email design looks good (purple gradient header)
   ```

3. **Check Admin Email**
   ```
   - Open inbox for hello@carlsnewton.com
   - Look for email with subject: "New Booking Received - Test User - [Date]"
   - Verify:
     ✓ Customer details are complete
     ✓ Booking details are accurate
     ✓ WhatsApp quick action button works
     ✓ Email design looks professional (dark theme with neon colors)
   ```

4. **Confirm the Booking**
   ```
   - Go to http://localhost:5173/admin
   - Find the new booking (should have yellow "Pending" badge)
   - Click "Confirm" button
   - Wait for status to update
   ```

5. **Check Confirmation Email**
   ```
   - Refresh inbox for your-test-email@gmail.com
   - Look for email with subject: "🎊 CONFIRMED! Your Science Adventure Awaits!"
   - Verify:
     ✓ Confirmation message is clear
     ✓ Booking details are accurate
     ✓ "What to Expect" section is present
     ✓ WhatsApp button is present
     ✓ Email design looks good (green gradient theme)
   ```

**Expected Total Emails:** 3 emails
- 1 to user (booking request)
- 1 to admin (new booking notification)
- 1 to user (booking confirmed)

**Time to Complete:** ~5 minutes

---

## 🔍 Detailed Email Verification Checklist

### Email #1: Booking Request Received (User)

**Subject:** "🎉 Get Ready for an Amazing Science Adventure!"
**To:** User's email address
**From:** Carls Newton Bookings <bookings@carlsnewton.com>

**Check:**
- [ ] Email received within 30 seconds of booking
- [ ] Subject line is exciting and clear
- [ ] Header has purple/pink gradient
- [ ] Booking number is displayed prominently
- [ ] Package type is correct
- [ ] Date is formatted nicely (e.g., "Friday, December 15, 2025")
- [ ] Time slot is correct
- [ ] Location/address is shown
- [ ] Price is displayed (AED)
- [ ] Special requests are included (if any were entered)
- [ ] WhatsApp button is present and clickable
- [ ] WhatsApp link pre-fills correct message
- [ ] "What Happens Next" section explains next steps
- [ ] Footer has contact information
- [ ] Email is mobile-responsive
- [ ] No broken images or links

**Example:**
```
Subject: 🎉 Get Ready for an Amazing Science Adventure!
From: Carls Newton Bookings <bookings@carlsnewton.com>
To: test@example.com

[Purple gradient header with white text]

🚀 Woohoo! Your Science Show is Booked!

Dear Mr. Test User,

We're absolutely thrilled that you've chosen Carls Newton...

📅 Your Adventure Details
Booking Number: CN-001000
Experience: Classic Show (45-60 mins)
Date: Friday, December 15, 2025
Time: 10:00 AM - 11:00 AM
Location: Test School, Dubai

[WhatsApp Button]
💬 Chat with us on WhatsApp

⏳ Status: Pending Confirmation
We'll send you a confirmation email within 24-48 hours...
```

---

### Email #2: New Booking Notification (Admin)

**Subject:** "New Booking Received - {Customer Name} - {Date}"
**To:** hello@carlsnewton.com
**From:** Carls Newton <bookings@carlsnewton.com>

**Check:**
- [ ] Email received within 30 seconds of booking
- [ ] Subject includes customer name and date
- [ ] Header has pink/cyan gradient on dark background
- [ ] Booking ID is in header
- [ ] Customer details section is complete:
  - Full name with title (Mr./Ms./etc.)
  - Job position
  - School/Organization
  - Email (clickable mailto link)
  - Phone (clickable tel link)
- [ ] WhatsApp quick action button is present
- [ ] WhatsApp link pre-fills admin message
- [ ] Booking details section shows:
  - Date and time
  - Package type and duration
  - Price in AED
  - Full address
  - Address details (if provided)
  - City (if provided)
- [ ] Payment status shows "Pending" in yellow badge
- [ ] Booking status shows "Pending Confirmation" in yellow badge
- [ ] Amount to collect is highlighted
- [ ] Special requests section appears if user added notes
- [ ] "Next Steps" reminder is present
- [ ] Footer has timestamp
- [ ] Email design matches brand (dark theme, neon accents)

**Example:**
```
Subject: New Booking Received - Mr. Test User - Friday, December 15, 2025
From: Carls Newton <bookings@carlsnewton.com>
To: hello@carlsnewton.com

[Dark theme with neon pink/cyan gradient header]

🎯 New Booking Received
Booking ID: CN-001000

👤 Customer Details
Full Name: Mr. Test User
Position: Science Coordinator
School/Organization: Test School
Email: test@example.com
Phone: +971 50 123 4567

[WhatsApp Button]
💬 Contact via WhatsApp

📅 Booking Details
Date & Time: Friday, December 15, 2025 at 10:00 AM - 11:00 AM
Package: Classic Show (45-60 mins)
Price: AED 1,800
Location: Test School, Dubai

💳 Payment Status
Payment Status: [Pending]
Booking Status: [Pending Confirmation]
Amount to Collect: AED 1,800

✅ Next Steps
Contact the customer within 24 hours...
```

---

### Email #3: Booking Confirmed (User)

**Subject:** "🎊 CONFIRMED! Your Science Adventure Awaits!"
**To:** User's email address
**From:** Carls Newton Bookings <bookings@resend.dev>

**Check:**
- [ ] Email received within 10 seconds of clicking "Confirm"
- [ ] Subject line is celebratory
- [ ] Header has green gradient (confirmation colors)
- [ ] Big confirmation announcement
- [ ] Booking number is displayed
- [ ] All booking details are shown:
  - Organization name
  - Package type
  - Date (formatted nicely)
  - Time
  - Location
  - Price
- [ ] Payment status is mentioned
- [ ] "Next Steps" section explains:
  - Payment instructions
  - Preparation requirements
  - Space requirements
- [ ] "What to Expect" section lists:
  - Interactive demonstrations
  - Hands-on experiments
  - Educational content
  - Engaging activities
  - Mind-blowing moments
- [ ] Pro tip about taking photos
- [ ] WhatsApp button is present
- [ ] Contact information is complete
- [ ] Email is professional yet exciting
- [ ] No spelling/grammar errors

**Example:**
```
Subject: 🎊 CONFIRMED! Your Science Adventure Awaits!
From: Carls Newton Bookings <bookings@resend.dev>
To: test@example.com

[Green gradient header]

🎊 IT'S OFFICIAL! Your Science Show is CONFIRMED!

Dear Mr. Test User,

Fantastic news! Your booking is now 100% confirmed! 🎉

✅ CONFIRMED DETAILS
Booking Number: CN-001000
Organization: Test School
Experience: Classic Show (45-60 mins)
Date: Friday, December 15, 2025
Time: 10:00 AM - 11:00 AM
Location: Test School, Dubai
Price: AED 1,800

🎯 Next Steps
✓ Payment: Please complete payment as discussed
✓ Preparation: We'll arrive 30 minutes early
✓ Space Requirements: Make sure there's room for experiments

🔬 What to Expect - The Science Magic!
🌟 Interactive demonstrations
🧪 Hands-on experiments
📚 Educational content
🎭 Engaging activities
🤯 Mind-blowing moments

💡 Pro Tip: Have your camera ready! 📸

[WhatsApp Button]
💬 Chat with us on WhatsApp
```

---

## 🐛 Common Issues & Solutions

### Issue: No Emails Received

**Check:**
1. Browser console for errors
2. Server logs for API errors
3. Spam/junk folder
4. Email address is correct
5. Resend API key is set

**Debug:**
```javascript
// Check browser console for:
"✅ Customer email sent successfully"
"✅ Admin notification email sent successfully"

// If you see errors:
"❌ CUSTOMER EMAIL FAILED"
"❌ ADMIN NOTIFICATION EMAIL FAILED"

// Then check:
- RESEND_API_KEY in .env
- Email addresses are valid
- Resend dashboard for errors
```

---

### Issue: Email in Spam Folder

**Why It Happens:**
- New sender domain
- First-time sending to recipient
- Email content triggers spam filters

**Solutions:**
1. Add sender to contacts/safe senders
2. Verify domain in Resend
3. Check spam score: https://www.mail-tester.com
4. Warm up domain (send gradually increasing volumes)

---

### Issue: Broken WhatsApp Links

**Check:**
1. Phone number format (should be: +971501234567)
2. URL encoding in WhatsApp link
3. Message text is properly encoded

**Test:**
```
Correct format:
https://wa.me/971501234567?text=Hi%20Carls%20Newton!...

Incorrect:
https://wa.me/+971 50 123 4567?text=Hi Carls Newton!
```

---

### Issue: Confirmation Email Not Sent When Confirming

**Debug Steps:**
1. Open browser DevTools → Network tab
2. Click "Confirm" button
3. Look for `/api/update-booking` request
4. Check response:
   ```json
   {
     "success": true,
     "booking": {...},
     "message": "Booking updated successfully"
   }
   ```
5. Check server logs for:
   ```
   "Sending confirmation email for booking: CN-001000"
   "Confirmation email sent successfully"
   ```

**If Email Not Sent:**
- Check `api/update-booking.js` line 77
- Verify condition: `if (updateData.status === 'confirmed')`
- Check Resend API key
- Check email content formatting

---

## 📊 Testing Matrix

| Scenario | User Email 1 | Admin Email | User Email 2 | Status |
|----------|--------------|-------------|--------------|--------|
| New booking (pending) | ✅ Received | ✅ Received | ⏸️ Not yet | Pending |
| Confirm booking | ✅ Already sent | ✅ Already sent | ✅ Received | Confirmed |
| Cancel booking | ✅ Already sent | ✅ Already sent | ❌ No email | Cancelled |
| Mark as paid | ✅ Already sent | ✅ Already sent | ✅ Already sent | Paid |

**Legend:**
- ✅ Should receive email
- ❌ No email sent
- ⏸️ Waiting for action
- ✅ Already sent = Email sent in previous step

---

## 🧪 Quick Test Commands

### Test 1: Check Resend API Key
```bash
# In terminal
echo $RESEND_API_KEY

# Should output: re_xxxxxxxxxxxxx
# If empty, add to .env file
```

### Test 2: Test Email Send (Manual)
```javascript
// In browser console on your site
fetch('/api/update-booking', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'YOUR_BOOKING_ID_HERE',
    status: 'confirmed'
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
```

### Test 3: Check Email Template Rendering
```javascript
// Create test booking with all fields
const testBooking = {
  title: 'Dr',
  customer_name: 'Test User',
  job_position: 'Science Coordinator',
  organization_name: 'Test School',
  email: 'test@example.com',
  phone: '+971501234567',
  address: '123 Test Street, Dubai',
  package_type: 'classic',
  date: '2025-12-15',
  time_slot: '10:00 AM - 11:00 AM',
  special_requests: 'Please bring chemistry experiments'
};

// Submit via form and check emails
```

---

## ✅ Final Checklist

Before considering testing complete:

**Email Delivery:**
- [ ] User receives booking request email
- [ ] Admin receives new booking notification
- [ ] User receives confirmation email after admin confirms
- [ ] All emails arrive within 30 seconds
- [ ] No emails in spam folder

**Email Content:**
- [ ] All booking details are accurate
- [ ] No placeholder text ({{ .Variable }})
- [ ] WhatsApp buttons work
- [ ] Phone numbers are clickable
- [ ] Email addresses are clickable
- [ ] Images load (if any)
- [ ] Formatting looks good on desktop
- [ ] Formatting looks good on mobile

**Workflow:**
- [ ] Admin can see pending bookings
- [ ] "Confirm" button works
- [ ] Status updates immediately
- [ ] Email sends automatically
- [ ] User sees updated status in "My Bookings"
- [ ] "Mark as Paid" button appears after confirmation

**Error Handling:**
- [ ] No JavaScript errors in console
- [ ] No API errors in Network tab
- [ ] Graceful error messages if email fails
- [ ] Booking still created even if email fails

---

## 📞 Need Help?

**Email Issues:**
1. Check Resend Dashboard: https://resend.com/emails
2. Review API logs in Vercel/Netlify
3. Test with different email addresses
4. Verify sender domain is verified

**Workflow Issues:**
1. Check database for booking record
2. Verify booking status in Supabase
3. Test admin dashboard permissions
4. Check browser console for errors

**Design Issues:**
1. Test in multiple email clients (Gmail, Outlook, Apple Mail)
2. Use email testing tools: https://www.mail-tester.com
3. Check mobile responsiveness
4. Verify dark mode rendering

---

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ User books → Receives email within 30 seconds
2. ✅ Admin receives notification email
3. ✅ Admin confirms → User receives confirmation
4. ✅ All emails look professional and on-brand
5. ✅ WhatsApp buttons work perfectly
6. ✅ No errors in console or logs
7. ✅ Workflow is smooth from start to finish

**If all checks pass → Your email system is production-ready!** 🚀

---

**Testing Guide Version:** 1.0
**Last Updated:** 2025-11-16
**Status:** Ready to Use ✅
