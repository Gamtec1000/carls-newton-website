# Carls Newton Booking System - Complete Quick Start Guide

**Last Updated:** 2025-11-19
**Estimated Setup Time:** 2-3 hours
**Prerequisites:** Supabase access, Stripe account, Resend API key

---

## 📋 Table of Contents

1. [What's Been Implemented](#whats-been-implemented)
2. [Quick Setup (Step-by-Step)](#quick-setup-step-by-step)
3. [Feature Overview & Usage](#feature-overview--usage)
4. [Testing Your Implementation](#testing-your-implementation)
5. [Troubleshooting](#troubleshooting)
6. [Daily Workflow Guide](#daily-workflow-guide)

---

## 🎯 What's Been Implemented

### ✅ Already Working (No Setup Needed)

These features are **already fully implemented** and working:

1. **Booking Creation Workflow**
   - User submits booking → saved as "pending"
   - User receives "Booking Request Received" email
   - Admin receives "New Booking Request" email
   - Code location: `api/create-booking.js` (lines 166-438)

2. **Booking Confirmation Workflow**
   - Admin can confirm bookings
   - User receives "Booking Confirmed" email
   - Code location: `api/update-booking.js` (lines 76-186)

3. **My Bookings Page**
   - Users can view their bookings
   - Filter by status, search, sort
   - Fixed "filter is not a function" error
   - Code location: `src/pages/MyBookings.tsx`

4. **Admin Bookings Dashboard**
   - View all bookings
   - Confirm/reject buttons
   - Basic filtering
   - Code location: `src/pages/AdminBookings.tsx`

### 🆕 New Features (Requires Setup)

These features have been **created and require setup**:

1. **Payment Link Integration**
   - Add Stripe payment links to confirmed bookings
   - Send payment links in confirmation emails
   - Track payment status

2. **Booking Detail Modal**
   - View complete booking information
   - Add admin/internal notes
   - Export to Google Calendar
   - WhatsApp customer contact

3. **Calendar View**
   - Monthly calendar visualization
   - Visual booking indicators
   - Statistics summary

4. **Admin Console Features**
   - Role-based access (super_admin, admin, viewer)
   - Audit trail (booking_history table)
   - CSV export
   - Advanced search and filtering

---

## 🚀 Quick Setup (Step-by-Step)

### Step 1: Database Migration (15 minutes)

**1.1 Open Supabase SQL Editor**
- Go to your Supabase Dashboard
- Navigate to SQL Editor
- Click "New Query"

**1.2 Run the Migration**
```bash
# Copy the entire contents of this file:
supabase/migrations/add_admin_console_features.sql

# Paste into Supabase SQL Editor and click "Run"
```

**1.3 Verify the Migration**
```sql
-- Run this to verify new columns exist:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name IN ('payment_link', 'admin_notes', 'confirmed_by');

-- Should return 3 rows
```

**1.4 Create Your Admin User**
```sql
-- First, get your user ID:
-- Go to Authentication → Users → Find your email → Copy UUID

-- Then run this (replace with your UUID):
INSERT INTO admin_users (id, role)
VALUES ('your-user-id-here', 'super_admin');

-- Verify:
SELECT * FROM admin_users;
```

### Step 2: Stripe Payment Links (20 minutes)

**2.1 Log in to Stripe Dashboard**
- Go to https://dashboard.stripe.com/
- Navigate to **Products** → **Payment Links**

**2.2 Create Payment Links for Each Package**

**Package 1: Preschool Special**
- Click "Create payment link"
- Product name: `Carls Newton - Preschool Special`
- Price: `AED 1,200`
- Description: `30-45 minute interactive science show for preschool students`
- Click "Create link"
- **Copy the payment link** (starts with https://buy.stripe.com/...)

**Package 2: Classic Show**
- Product name: `Carls Newton - Classic Show`
- Price: `AED 1,800`
- Description: `45-60 minute engaging science show with hands-on experiments`
- **Copy the payment link**

**Package 3: Half-Day Experience**
- Product name: `Carls Newton - Half-Day Experience`
- Price: `AED 3,500`
- Description: `4-hour comprehensive science education experience`
- **Copy the payment link**

**2.3 Update Payment Links in Code**

Open `src/utils/adminHelpers.ts` and update lines 7-11:

```typescript
export const STRIPE_PAYMENT_LINKS = {
  preschool: 'https://buy.stripe.com/YOUR_PRESCHOOL_LINK',    // Paste link here
  classic: 'https://buy.stripe.com/YOUR_CLASSIC_LINK',        // Paste link here
  halfday: 'https://buy.stripe.com/YOUR_HALFDAY_LINK',        // Paste link here
};
```

### Step 3: Integrate Admin Console Components (45 minutes)

**3.1 Update AdminBookings.tsx - Add Imports**

Open `src/pages/AdminBookings.tsx` and add these imports at the top:

```typescript
import BookingDetailModal from '../components/BookingDetailModal';
import CalendarView from '../components/CalendarView';
import {
  calculateBookingStats,
  exportBookingsToCSV,
  downloadCSV,
  checkAdminPermission
} from '../utils/adminHelpers';
```

**3.2 Add State Variables**

Inside your AdminBookings component, add:

```typescript
const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
const [userRole, setUserRole] = useState<'super_admin' | 'admin' | 'viewer' | null>(null);
```

**3.3 Add Permission Check**

Add this useEffect to check admin permissions:

```typescript
useEffect(() => {
  const checkPermissions = async () => {
    if (!user) return;
    const role = await checkAdminPermission(supabase, user.id);
    setUserRole(role);

    if (!role) {
      alert('You do not have admin access');
      navigate('/');
    }
  };

  checkPermissions();
}, [user]);
```

**3.4 Add Update Booking Function**

```typescript
const handleUpdateBooking = async (bookingId: string, updates: any) => {
  try {
    const response = await fetch('/api/update-booking', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bookingId, ...updates }),
    });

    if (!response.ok) throw new Error('Failed to update booking');

    // Refresh bookings
    await fetchBookings();

    return response.json();
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};
```

**3.5 Add CSV Export Function**

```typescript
const handleExportCSV = () => {
  const csvContent = exportBookingsToCSV(bookings);
  const filename = `carls-newton-bookings-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};
```

**3.6 Add View Toggle Buttons**

Add this before your booking list rendering:

```typescript
<div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
  <button
    onClick={() => setViewMode('list')}
    style={{
      padding: '10px 20px',
      background: viewMode === 'list'
        ? 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)'
        : '#4b5563',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    }}
  >
    📋 List View
  </button>

  <button
    onClick={() => setViewMode('calendar')}
    style={{
      padding: '10px 20px',
      background: viewMode === 'calendar'
        ? 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)'
        : '#4b5563',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    }}
  >
    📅 Calendar View
  </button>

  <button
    onClick={handleExportCSV}
    style={{
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    }}
  >
    📊 Export CSV
  </button>
</div>
```

**3.7 Update Booking List Rendering**

Replace your existing booking list with:

```typescript
{viewMode === 'list' ? (
  <div>
    {/* Your existing booking list code */}
    {bookings.map((booking) => (
      <div
        key={booking.id}
        onClick={() => setSelectedBooking(booking)}
        style={{ cursor: 'pointer' }}
      >
        {/* Your existing booking card content */}
      </div>
    ))}
  </div>
) : (
  <CalendarView
    bookings={bookings}
    onBookingClick={(booking) => setSelectedBooking(booking)}
  />
)}
```

**3.8 Add Booking Detail Modal**

Add this at the end of your component (before the closing tag):

```typescript
{selectedBooking && (
  <BookingDetailModal
    booking={selectedBooking}
    onClose={() => setSelectedBooking(null)}
    onUpdate={handleUpdateBooking}
    userRole={userRole || 'viewer'}
  />
)}
```

### Step 4: Update MyBookings.tsx for Payment Links (15 minutes)

**4.1 Open MyBookings.tsx**

Find where you display booking details and add this section inside each booking card:

```typescript
{booking.status === 'confirmed' && booking.payment_link && booking.payment_status !== 'paid' && (
  <div
    style={{
      background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.1), rgba(6, 182, 212, 0.1))',
      border: '2px solid rgba(217, 70, 239, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '15px',
    }}
  >
    <h4 style={{ color: '#d946ef', margin: '0 0 10px 0' }}>
      ✅ Booking Confirmed - Complete Payment
    </h4>
    <p style={{ color: '#9ca3af', margin: '0 0 15px 0' }}>
      Please complete payment to secure your slot.
    </p>
    <a
      href={booking.payment_link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: '12px 30px',
        background: 'linear-gradient(135deg, #d946ef 0%, #06b6d4 100%)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '50px',
        fontWeight: 'bold',
      }}
    >
      💳 Pay AED {booking.price?.toLocaleString()} Now
    </a>
    {booking.admin_notes && (
      <div
        style={{
          marginTop: '15px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
        }}
      >
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
          <strong>Note from our team:</strong> {booking.admin_notes}
        </p>
      </div>
    )}
  </div>
)}
```

### Step 5: Environment Variables Check (5 minutes)

**5.1 Verify Required Environment Variables**

Make sure these are set in your `.env` or Vercel/hosting environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
```

**5.2 Verify Email Configuration**

Confirm these settings in Resend dashboard:
- From email: `bookings@carlsnewton.com` (or your verified domain)
- Admin email: `hello@carlsnewton.com`

---

## 🎨 Feature Overview & Usage

### 1. Booking Detail Modal

**What it does:**
- Shows complete booking information
- Allows confirming bookings with payment links
- Allows rejecting bookings with reasons
- Add notes (admin and internal)
- Export to Google Calendar

**How to use:**
1. In Admin Bookings, click any booking card
2. Modal opens with full details
3. For pending bookings:
   - Enter Stripe payment link
   - Add optional admin notes
   - Click "Confirm & Send Email"
   - Customer receives email with payment link
4. To reject:
   - Click "Reject Booking"
   - Enter reason (sent to customer)
   - Click "Confirm Rejection"

### 2. Calendar View

**What it does:**
- Visual monthly calendar of all bookings
- Color-coded status indicators
- Click any day to see bookings
- Monthly statistics

**How to use:**
1. Click "Calendar View" button
2. Navigate months with Previous/Next buttons
3. Click "Today" to jump to current date
4. Click any booking to open detail modal
5. View monthly stats at bottom

**Status Colors:**
- 🟢 Green = Confirmed
- 🟡 Yellow = Pending
- 🔵 Blue = Completed
- 🔴 Red = Rejected

### 3. Payment Link Workflow

**Complete workflow:**

1. **Customer submits booking**
   - Booking saved as "pending"
   - Customer receives "Request Received" email
   - Admin receives "New Booking" notification

2. **Admin confirms booking**
   - Open booking detail modal
   - Enter Stripe payment link for package type
   - Add notes (e.g., "Payment due within 48 hours")
   - Click "Confirm & Send Email"

3. **Customer receives confirmation**
   - Email with booking confirmation
   - Payment link button (gradient purple/cyan)
   - Admin notes displayed
   - WhatsApp contact button

4. **Customer completes payment**
   - Clicks payment link in email
   - Completes Stripe checkout
   - Payment status updates (manual or via webhook)

5. **Show day arrives**
   - Admin marks booking as "completed"
   - Internal notes about the show

### 4. Admin Roles

**super_admin:**
- Full access to all features
- Can confirm/reject bookings
- Can edit all fields
- Can manage admin users

**admin:**
- Can confirm/reject bookings
- Can edit booking details
- Can view all bookings
- Cannot manage admin users

**viewer:**
- Read-only access
- Can view bookings
- Cannot make changes

### 5. CSV Export

**What it includes:**
- Booking number
- Date, time, customer info
- Organization, package, students
- Price, status, payment status
- Address, special requests
- Created date

**How to use:**
1. Filter bookings as needed
2. Click "Export CSV" button
3. File downloads automatically
4. Open in Excel/Google Sheets

### 6. Google Calendar Integration

**How to use:**
1. Open booking detail modal
2. Click "Add to Google Calendar"
3. Google Calendar opens with pre-filled event:
   - Title: "Carls Newton Show - [Organization]"
   - Details: All booking info
   - Location: Customer address
   - Duration: 1 hour from booking time
4. Adjust if needed and save

### 7. Search & Filter

**Available filters:**
- Status (pending, confirmed, rejected, completed)
- Payment status (paid, pending)
- Date range
- Package type
- Search by name, email, organization, phone

**How to use:**
```typescript
import { searchBookings, filterBookingsByDateRange } from '../utils/adminHelpers';

// Search
const results = searchBookings(bookings, 'john');

// Date range
const startDate = new Date('2025-01-01');
const endDate = new Date('2025-01-31');
const filtered = filterBookingsByDateRange(bookings, startDate, endDate);
```

---

## 🧪 Testing Your Implementation

### Test 1: Database Migration (5 minutes)

```sql
-- 1. Check new columns exist
SELECT column_name FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name IN ('payment_link', 'admin_notes', 'internal_notes');
-- Should return 3 rows

-- 2. Check admin_users table
SELECT * FROM admin_users;
-- Should show your admin user

-- 3. Check booking_history table
SELECT * FROM booking_history LIMIT 5;
-- Should be empty initially

-- 4. Check admin_booking_stats view
SELECT * FROM admin_booking_stats;
-- Should return statistics
```

### Test 2: Admin Access (5 minutes)

1. Log in with your admin email
2. Navigate to Admin Bookings page
3. Should see bookings without error
4. Click a booking card
5. Booking detail modal should open
6. Verify all fields display correctly

### Test 3: Payment Link Email (10 minutes)

**Prerequisites:** Have at least one pending booking

1. Open booking in detail modal
2. Enter a test Stripe payment link
3. Add admin note: "Test - Payment due within 48 hours"
4. Click "Confirm & Send Email"
5. Check customer email inbox
6. Verify email contains:
   - ✅ Green confirmation header
   - 💳 Payment link button
   - Admin note displayed
   - Booking details correct
   - WhatsApp button works

### Test 4: Customer Payment Flow (10 minutes)

1. As customer, log in and go to My Bookings
2. Should see confirmed booking with payment section
3. Verify payment link button displays
4. Click payment link
5. Should redirect to Stripe checkout
6. (Don't complete payment in test)
7. Return to My Bookings
8. Admin note should display

### Test 5: Calendar View (5 minutes)

1. Go to Admin Bookings
2. Click "Calendar View"
3. Verify bookings appear on correct dates
4. Check color coding matches status
5. Click a booking on calendar
6. Detail modal should open
7. Click "Today" button - should navigate to current date
8. Navigate to next/previous months

### Test 6: CSV Export (5 minutes)

1. Go to Admin Bookings
2. Click "Export CSV"
3. File should download
4. Open in Excel/Google Sheets
5. Verify all columns present
6. Check data matches bookings
7. Verify date formatting correct

### Test 7: Google Calendar (5 minutes)

1. Open any booking detail modal
2. Click "Add to Google Calendar"
3. New tab opens with Google Calendar
4. Verify event details:
   - Title includes organization name
   - Date and time correct
   - Location shows address
   - Details include all booking info
5. (Don't save, just verify)

### Test 8: Booking Rejection (5 minutes)

1. Find a pending booking
2. Open detail modal
3. Click "Reject Booking"
4. Enter reason: "Test - Unavailable on this date"
5. Click "Confirm Rejection"
6. Check customer email
7. Verify rejection email received with reason

### Test 9: Audit Trail (5 minutes)

```sql
-- After confirming or rejecting bookings, run:
SELECT
  bh.*,
  b.booking_number,
  au.email as changed_by_email
FROM booking_history bh
JOIN bookings b ON bh.booking_id = b.id
LEFT JOIN auth.users au ON bh.changed_by = au.id
ORDER BY bh.created_at DESC
LIMIT 10;

-- Should show all changes with user who made them
```

### Test 10: Role Permissions (10 minutes)

**Create test users:**

```sql
-- Create viewer
INSERT INTO admin_users (id, role)
VALUES ('viewer-user-id', 'viewer');

-- Create admin
INSERT INTO admin_users (id, role)
VALUES ('admin-user-id', 'admin');
```

**Test viewer:**
1. Log in as viewer
2. Can view bookings ✓
3. Cannot see confirm/reject buttons ✓
4. Cannot edit notes ✓

**Test admin:**
1. Log in as admin
2. Can confirm bookings ✓
3. Can add notes ✓
4. Cannot manage admin users ✓

---

## 🔧 Troubleshooting

### Issue: "Access Denied" on Admin Dashboard

**Cause:** User not in admin_users table

**Solution:**
```sql
-- Check if you're an admin
SELECT * FROM admin_users WHERE id = 'your-user-id';

-- If not found, add yourself
INSERT INTO admin_users (id, role)
VALUES ('your-user-id', 'super_admin');
```

**How to get your user ID:**
1. Supabase Dashboard → Authentication → Users
2. Find your email
3. Copy the UUID

### Issue: Payment link not in confirmation email

**Checklist:**
- [ ] payment_link field populated in database
- [ ] payment_status is NOT 'paid'
- [ ] Email template updated (api/update-booking.js lines 143-174)
- [ ] RESEND_API_KEY environment variable set

**Test query:**
```sql
SELECT id, booking_number, payment_link, payment_status, status
FROM bookings
WHERE id = 'booking-id-here';
```

**Expected:** payment_link should have a value, payment_status should be 'pending'

### Issue: Booking history not logging

**Cause:** Trigger not created

**Solution:**
```sql
-- Check if trigger exists
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_booking_change';

-- If missing, re-run migration:
-- supabase/migrations/add_admin_console_features.sql
```

### Issue: Calendar not showing bookings

**Checklist:**
- [ ] Bookings have valid date format (YYYY-MM-DD)
- [ ] Check browser console for errors
- [ ] Verify bookings array passed to CalendarView

**Debug:**
```typescript
console.log('Bookings:', bookings.map(b => ({
  id: b.id,
  date: b.date,
  status: b.status
})));
```

### Issue: CSV export missing data

**Solution:**
```typescript
// Add debug logging
console.log('Exporting bookings:', bookings.length);
console.log('Sample booking:', bookings[0]);

// Check if exportBookingsToCSV is imported
import { exportBookingsToCSV, downloadCSV } from '../utils/adminHelpers';
```

### Issue: Google Calendar link not working

**Cause:** Invalid date/time format

**Solution:**
- Check booking.date format is YYYY-MM-DD
- Check booking.time_slot format is HH:MM
- Verify full_address is populated

**Debug:**
```typescript
console.log('Booking for calendar:', {
  date: booking.date,
  time: booking.time_slot,
  address: booking.full_address
});
```

### Issue: Modal not opening when clicking booking

**Solution:**
```typescript
// Verify state is set up
const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

// Verify onClick handler
onClick={() => setSelectedBooking(booking)}

// Verify modal component
{selectedBooking && (
  <BookingDetailModal
    booking={selectedBooking}
    onClose={() => setSelectedBooking(null)}
    onUpdate={handleUpdateBooking}
    userRole={userRole || 'viewer'}
  />
)}

// Check console for errors
```

### Issue: Stripe payment link validation fails

**Cause:** Link doesn't contain stripe.com domain

**Valid formats:**
- `https://buy.stripe.com/...`
- `https://checkout.stripe.com/...`

**Solution:**
Copy link directly from Stripe Dashboard → Products → Payment Links

### Issue: Email not sending

**Checklist:**
- [ ] RESEND_API_KEY set correctly
- [ ] From email verified in Resend
- [ ] Check Resend dashboard for delivery status
- [ ] Check spam folder

**Debug:**
```javascript
// In api/update-booking.js, add logging:
console.log('Sending email to:', booking.email);
console.log('Payment link:', booking.payment_link);
```

### Issue: RLS policy blocking access

**Symptoms:** Can't read/write bookings even as admin

**Solution:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'bookings';

-- View current policies
SELECT * FROM pg_policies
WHERE tablename = 'bookings';

-- If policies missing, re-run migration
```

---

## 📅 Daily Workflow Guide

### Morning Routine (10 minutes)

1. **Log in to Admin Dashboard**
   ```
   → Navigate to Admin Bookings
   → Check pending bookings count
   ```

2. **Review Pending Bookings**
   ```
   → Click each pending booking
   → Check availability on calendar
   → Note any special requests
   ```

3. **Check Today's Schedule**
   ```
   → Switch to Calendar View
   → Click "Today" button
   → Review confirmed bookings for today
   → Export to Google Calendar if needed
   ```

4. **Check Overdue Actions**
   ```sql
   -- Run in Supabase:
   SELECT * FROM bookings
   WHERE status = 'confirmed'
   AND date < CURRENT_DATE
   AND status != 'completed'
   ORDER BY date DESC;
   ```

### Processing New Bookings (5 min per booking)

**For each pending booking:**

1. **Open booking detail modal**
   - Review customer info
   - Check special requests
   - Verify date/time availability

2. **Decide: Confirm or Reject**

   **If confirming:**
   ```
   ✓ Select appropriate Stripe payment link from adminHelpers.ts
   ✓ Copy and paste into payment link field
   ✓ Add admin notes (e.g., "Payment due within 48 hours")
   ✓ Add internal notes if needed (e.g., "First-time customer")
   ✓ Click "Confirm & Send Email"
   ✓ Verify customer receives email
   ```

   **If rejecting:**
   ```
   ✗ Click "Reject Booking"
   ✗ Enter clear reason (sent to customer)
   ✗ Click "Confirm Rejection"
   ✗ Verify customer receives rejection email
   ```

3. **Add to your calendar**
   - Click "Add to Google Calendar"
   - Adjust event if needed
   - Save to calendar

### After Each Show (5 minutes)

1. **Mark as Completed**
   ```
   → Find booking in list/calendar
   → Open detail modal
   → Add internal notes (e.g., "Show went great, kids loved it")
   → Change status to "Completed"
   ```

2. **Update Payment Status (if paid on-site)**
   ```sql
   -- In Supabase:
   UPDATE bookings
   SET payment_status = 'paid'
   WHERE id = 'booking-id-here';
   ```

### End of Week (15 minutes)

1. **Review Statistics**
   ```
   → Check calendar monthly summary
   → Note confirmed vs pending bookings
   → Check payment collection rate
   ```

2. **Follow up on Pending Payments**
   ```sql
   -- Bookings confirmed but not paid:
   SELECT * FROM bookings
   WHERE status = 'confirmed'
   AND payment_status = 'pending'
   AND date > CURRENT_DATE
   ORDER BY date ASC;
   ```

3. **Export for Accounting**
   ```
   → Filter by date range (last week)
   → Click "Export CSV"
   → Send to accounting team
   ```

### End of Month (30 minutes)

1. **Generate Monthly Report**
   ```sql
   -- Monthly stats:
   SELECT * FROM admin_booking_stats;

   -- Revenue breakdown:
   SELECT
     package_type,
     COUNT(*) as bookings,
     SUM(price) as revenue
   FROM bookings
   WHERE date >= DATE_TRUNC('month', CURRENT_DATE)
   AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
   AND payment_status = 'paid'
   GROUP BY package_type;
   ```

2. **Export Full Month Data**
   ```
   → Filter by current month
   → Export CSV
   → Archive for records
   ```

3. **Review Audit Trail**
   ```sql
   SELECT
     DATE(bh.created_at) as date,
     COUNT(*) as changes,
     au.email as changed_by
   FROM booking_history bh
   LEFT JOIN auth.users au ON bh.changed_by = au.id
   WHERE bh.created_at >= DATE_TRUNC('month', CURRENT_DATE)
   GROUP BY DATE(bh.created_at), au.email
   ORDER BY date DESC;
   ```

---

## 🎯 Quick Reference: Common Tasks

### Task: Confirm a Booking with Payment

```
1. Click booking card → Modal opens
2. Paste Stripe payment link
3. Add note: "Payment due within 48 hours"
4. Click "Confirm & Send Email"
5. Customer receives email with payment link
```

### Task: Reject a Booking

```
1. Click booking card → Modal opens
2. Click "Reject Booking"
3. Enter reason: "Unfortunately unavailable on this date"
4. Click "Confirm Rejection"
5. Customer receives rejection email
```

### Task: Export Bookings to CSV

```
1. Apply any filters needed
2. Click "Export CSV" button
3. File downloads automatically
4. Open in Excel/Google Sheets
```

### Task: Add Booking to Google Calendar

```
1. Open booking detail modal
2. Click "Add to Google Calendar"
3. Google Calendar opens with event
4. Save event
```

### Task: Contact Customer via WhatsApp

```
1. Open booking detail modal
2. Customer phone number is clickable
3. Or use WhatsApp button
4. Opens WhatsApp chat
```

### Task: View Booking History

```sql
SELECT * FROM booking_history
WHERE booking_id = 'booking-uuid'
ORDER BY created_at DESC;
```

### Task: Check Today's Bookings

```
1. Click "Calendar View"
2. Click "Today" button
3. View all bookings for today
4. Click any to see details
```

### Task: Find Unpaid Bookings

```sql
SELECT * FROM bookings
WHERE status = 'confirmed'
AND payment_status = 'pending'
ORDER BY date ASC;
```

---

## 📊 Database Schema Reference

### bookings table (new columns)

| Column | Type | Description |
|--------|------|-------------|
| `payment_link` | TEXT | Stripe payment link |
| `admin_notes` | TEXT | Notes visible to customer |
| `internal_notes` | TEXT | Private admin notes |
| `confirmed_by` | UUID | Admin who confirmed |
| `confirmed_at` | TIMESTAMP | When confirmed |
| `rejected_reason` | TEXT | Why rejected |
| `customer_notified` | BOOLEAN | Email sent flag |
| `gcal_event_id` | TEXT | Google Calendar ID |

### admin_users table

| Column | Type | Values |
|--------|------|--------|
| `id` | UUID | User ID (references auth.users) |
| `role` | TEXT | 'super_admin', 'admin', 'viewer' |
| `created_at` | TIMESTAMP | When added |

### booking_history table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | History record ID |
| `booking_id` | UUID | Which booking |
| `changed_by` | UUID | Who made change |
| `action` | TEXT | What happened |
| `old_status` | TEXT | Previous status |
| `new_status` | TEXT | New status |
| `notes` | TEXT | Change notes |
| `created_at` | TIMESTAMP | When changed |

---

## 🔒 Security Checklist

- [ ] Never commit Stripe payment links to version control
- [ ] Rotate API keys every 90 days
- [ ] Limit super_admin access to 1-2 users
- [ ] Review audit logs weekly
- [ ] Test payment links in Stripe test mode first
- [ ] Backup database before migrations
- [ ] Use HTTPS only for all pages
- [ ] Verify RLS policies are active
- [ ] Don't share admin credentials
- [ ] Enable 2FA on admin accounts

---

## 📞 Support & Resources

### Documentation Files

1. **ADMIN_CONSOLE_SETUP.md** - Detailed setup guide
2. **ADMIN_CONSOLE_IMPLEMENTATION_GUIDE.md** - Complete implementation reference
3. **BOOKING_EMAIL_WORKFLOW.md** - Email system documentation
4. **MY_BOOKINGS_FIX.md** - My Bookings page fixes
5. **EMAIL_WORKFLOW_TESTING_GUIDE.md** - Email testing procedures

### Code Locations

| Feature | File | Lines |
|---------|------|-------|
| Booking creation emails | `api/create-booking.js` | 166-438 |
| Confirmation emails | `api/update-booking.js` | 76-186 |
| Payment link email | `api/update-booking.js` | 143-174 |
| Booking detail modal | `src/components/BookingDetailModal.tsx` | All |
| Calendar view | `src/components/CalendarView.tsx` | All |
| Admin helpers | `src/utils/adminHelpers.ts` | All |
| My Bookings page | `src/pages/MyBookings.tsx` | All |
| Admin dashboard | `src/pages/AdminBookings.tsx` | All |

### External Resources

- **Stripe Dashboard:** https://dashboard.stripe.com/
- **Supabase Dashboard:** Your project URL
- **Resend Dashboard:** https://resend.com/
- **Stripe Payment Links Docs:** https://stripe.com/docs/payments/payment-links

---

## ✅ Final Checklist

Before going live, verify:

### Database
- [ ] Migration applied successfully
- [ ] All new columns exist on bookings table
- [ ] admin_users table created
- [ ] booking_history table created
- [ ] Your user added as super_admin
- [ ] RLS policies active

### Stripe
- [ ] All 3 payment links created
- [ ] Payment links tested in test mode
- [ ] Payment links updated in adminHelpers.ts
- [ ] Webhook configured (optional)

### Code Integration
- [ ] BookingDetailModal imported in AdminBookings
- [ ] CalendarView imported in AdminBookings
- [ ] adminHelpers imported where needed
- [ ] State variables added
- [ ] Update function implemented
- [ ] CSV export working
- [ ] Payment link section added to MyBookings

### Testing
- [ ] Admin access works
- [ ] Can open booking detail modal
- [ ] Can confirm booking with payment link
- [ ] Confirmation email received with payment link
- [ ] Customer sees payment link in My Bookings
- [ ] Can reject booking
- [ ] Rejection email received
- [ ] Calendar view displays bookings
- [ ] Can export to CSV
- [ ] Google Calendar integration works
- [ ] Audit trail logging changes

### Documentation
- [ ] Team trained on new features
- [ ] Workflow documented
- [ ] Troubleshooting guide accessible
- [ ] Admin credentials secured

---

## 🎉 You're Ready!

Your comprehensive admin console is now set up and ready to use. The system will:

✅ Automatically send 2 emails when booking is created (customer + admin)
✅ Send confirmation email with payment link when booking is confirmed
✅ Send rejection email with reason when booking is rejected
✅ Track all changes in audit log
✅ Provide visual calendar management
✅ Export data for accounting
✅ Integrate with Google Calendar
✅ Support role-based access control

**Estimated total setup time:** 2-3 hours
**Recommended testing time:** 1 hour
**Team training time:** 30 minutes

---

**Questions or Issues?**

1. Check the Troubleshooting section above
2. Review detailed documentation files
3. Check browser console for errors
4. Verify database migration ran successfully
5. Test with a sample booking end-to-end

**Happy booking management! 🚀🔬**
