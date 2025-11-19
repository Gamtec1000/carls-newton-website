# Admin Console Setup Guide

## Overview

This guide explains how to set up and use the comprehensive admin console for Carls Newton booking management system. The admin console provides powerful features for managing bookings, payments, customer communications, and analytics.

## Table of Contents

1. [Database Setup](#database-setup)
2. [Stripe Payment Links](#stripe-payment-links)
3. [Component Integration](#component-integration)
4. [Admin User Management](#admin-user-management)
5. [Features Overview](#features-overview)
6. [Usage Guide](#usage-guide)
7. [Troubleshooting](#troubleshooting)

---

## Database Setup

### Step 1: Apply Database Migration

Run the migration file to add all necessary database tables and columns:

```bash
# Navigate to Supabase Dashboard → SQL Editor
# Paste and run the contents of:
supabase/migrations/add_admin_console_features.sql
```

This migration adds:
- 8 new columns to `bookings` table (payment_link, admin_notes, confirmed_by, etc.)
- `admin_users` table for role-based access control
- `booking_history` table for audit trail
- Automatic triggers for logging booking changes
- `admin_booking_stats` view for dashboard analytics

### Step 2: Verify Database Setup

Run these verification queries:

```sql
-- Check new columns on bookings table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name IN ('payment_link', 'admin_notes', 'confirmed_by', 'confirmed_at');

-- Check admin_users table
SELECT * FROM admin_users;

-- Check booking_history table
SELECT * FROM booking_history LIMIT 5;
```

### Step 3: Create Your First Admin User

```sql
-- Replace 'YOUR_USER_ID' with your actual Supabase auth user ID
INSERT INTO admin_users (id, role)
VALUES ('YOUR_USER_ID', 'super_admin');
```

To find your user ID:
1. Go to Supabase Dashboard → Authentication → Users
2. Find your email and copy the UUID

---

## Stripe Payment Links

### Step 1: Create Stripe Payment Links

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Products** → **Payment Links**
3. Create payment links for each package:

**Preschool Special - AED 1,200**
- Product name: "Carls Newton - Preschool Special"
- Price: AED 1,200
- Description: "30-45 minute interactive science show for preschool students"

**Classic Show - AED 1,800**
- Product name: "Carls Newton - Classic Show"
- Price: AED 1,800
- Description: "45-60 minute engaging science show with hands-on experiments"

**Half-Day Experience - AED 3,500**
- Product name: "Carls Newton - Half-Day Experience"
- Price: AED 3,500
- Description: "4-hour comprehensive science education experience"

### Step 2: Configure Payment Links in Code

Update `src/utils/adminHelpers.ts` with your actual Stripe payment links:

```typescript
export const STRIPE_PAYMENT_LINKS = {
  preschool: 'https://buy.stripe.com/YOUR_PRESCHOOL_LINK',
  classic: 'https://buy.stripe.com/YOUR_CLASSIC_LINK',
  halfday: 'https://buy.stripe.com/YOUR_HALFDAY_LINK',
};
```

### Step 3: Test Payment Links

1. Create a test booking
2. Confirm the booking with a payment link
3. Verify the email contains the correct payment link
4. Test the payment flow (use Stripe test mode)

---

## Component Integration

### Step 1: Update AdminBookings Component

Add the new components to your `src/pages/AdminBookings.tsx`:

```typescript
import BookingDetailModal from '../components/BookingDetailModal';
import CalendarView from '../components/CalendarView';
import { calculateBookingStats, exportBookingsToCSV, downloadCSV } from '../utils/adminHelpers';

// Inside your AdminBookings component:
const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

// Update booking function
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
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Export to CSV
const handleExportCSV = () => {
  const csvContent = exportBookingsToCSV(bookings);
  downloadCSV(csvContent, `carls-newton-bookings-${new Date().toISOString().split('T')[0]}.csv`);
};
```

### Step 2: Add View Toggle Buttons

```typescript
<div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
  <button
    onClick={() => setViewMode('list')}
    style={{
      padding: '10px 20px',
      background: viewMode === 'list' ? 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)' : '#4b5563',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    📋 List View
  </button>
  <button
    onClick={() => setViewMode('calendar')}
    style={{
      padding: '10px 20px',
      background: viewMode === 'calendar' ? 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)' : '#4b5563',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
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
    }}
  >
    📊 Export CSV
  </button>
</div>

{/* Conditional rendering */}
{viewMode === 'list' ? (
  <div>{/* Your existing booking list */}</div>
) : (
  <CalendarView
    bookings={bookings}
    onBookingClick={(booking) => setSelectedBooking(booking)}
  />
)}

{/* Booking Detail Modal */}
<BookingDetailModal
  booking={selectedBooking}
  onClose={() => setSelectedBooking(null)}
  onUpdate={handleUpdateBooking}
  userRole="super_admin" // Get this from admin_users table
/>
```

### Step 3: Update MyBookings Component

Add payment link display for customers in `src/pages/MyBookings.tsx`:

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

---

## Admin User Management

### Role Types

The admin console supports three role types:

1. **super_admin**
   - Full access to all features
   - Can confirm/reject bookings
   - Can edit all booking details
   - Can manage admin users
   - Can view audit logs

2. **admin**
   - Can confirm/reject bookings
   - Can edit booking details
   - Can view all bookings
   - Cannot manage admin users

3. **viewer**
   - Read-only access
   - Can view bookings
   - Cannot make changes

### Adding Admin Users

```sql
-- Add super admin
INSERT INTO admin_users (id, role)
VALUES ('user-uuid-here', 'super_admin');

-- Add regular admin
INSERT INTO admin_users (id, role)
VALUES ('user-uuid-here', 'admin');

-- Add viewer
INSERT INTO admin_users (id, role)
VALUES ('user-uuid-here', 'viewer');
```

### Checking Admin Permission in Code

```typescript
import { checkAdminPermission } from '../utils/adminHelpers';

const userRole = await checkAdminPermission(supabase, user.id);

if (!userRole) {
  // Not an admin - redirect to home
  navigate('/');
  return;
}

// Use userRole to control UI and features
```

---

## Features Overview

### 1. Booking Detail Modal

**Features:**
- View complete booking information
- Confirm bookings with payment links
- Reject bookings with reason
- Add admin notes (visible to customer)
- Add internal notes (private)
- Export to Google Calendar
- View booking history

**Usage:**
```typescript
<BookingDetailModal
  booking={selectedBooking}
  onClose={() => setSelectedBooking(null)}
  onUpdate={handleUpdateBooking}
  userRole={userRole}
/>
```

### 2. Calendar View

**Features:**
- Monthly calendar grid
- Visual booking indicators by status
- Click to view booking details
- Monthly statistics summary
- Navigation between months
- Today highlight

**Usage:**
```typescript
<CalendarView
  bookings={bookings}
  onBookingClick={(booking) => setSelectedBooking(booking)}
/>
```

### 3. Payment Link Management

**Features:**
- Add Stripe payment links to bookings
- Automatic email with payment link
- Customer payment tracking
- Admin notes with payment instructions

**Workflow:**
1. Admin receives new booking notification
2. Admin opens booking in detail modal
3. Admin enters Stripe payment link
4. Admin adds optional notes
5. Admin clicks "Confirm & Send Email"
6. Customer receives confirmation email with payment link
7. Customer completes payment via Stripe
8. Webhook updates payment status (if configured)

### 4. Audit Trail

All booking changes are automatically logged to `booking_history` table:

```sql
-- View booking history
SELECT
  bh.*,
  au.email as changed_by_email
FROM booking_history bh
LEFT JOIN auth.users au ON bh.changed_by = au.id
WHERE bh.booking_id = 'booking-uuid-here'
ORDER BY bh.created_at DESC;
```

### 5. Statistics Dashboard

Use the `admin_booking_stats` view:

```sql
-- Get comprehensive statistics
SELECT * FROM admin_booking_stats;
```

Or use the helper function:

```typescript
import { calculateBookingStats } from '../utils/adminHelpers';

const stats = calculateBookingStats(bookings);
// stats = { total, pending, confirmed, rejected, completed, totalRevenue, pendingRevenue }
```

---

## Usage Guide

### Daily Admin Workflow

**Morning Routine:**
1. Log in to admin dashboard
2. Check pending bookings (yellow indicators)
3. Review calendar for today's shows
4. Check overdue bookings (past date, not completed)

**Processing New Bookings:**
1. Click on pending booking to open detail modal
2. Review customer information and requirements
3. Check availability on calendar
4. Enter Stripe payment link for the package type
5. Add admin notes (e.g., "Payment due within 48 hours")
6. Click "Confirm & Send Email"
7. Customer receives confirmation email with payment link

**After Each Show:**
1. Find the booking in list or calendar view
2. Mark as "Completed"
3. Add internal notes about the show (optional)

**End of Month:**
1. Switch to calendar view
2. Review monthly statistics
3. Export bookings to CSV for accounting
4. Check pending payments

### Common Tasks

**Confirming a Booking:**
```
1. Open booking detail modal
2. Enter payment link from adminHelpers.ts (or custom link)
3. Add admin notes (optional)
4. Click "Confirm & Send Email"
5. Customer receives email with payment link
```

**Rejecting a Booking:**
```
1. Open booking detail modal
2. Click "Reject Booking" button
3. Enter rejection reason (sent to customer)
4. Click "Confirm Rejection"
5. Customer receives rejection email with reason
```

**Exporting Bookings:**
```
1. Filter bookings as needed (date range, status, etc.)
2. Click "Export CSV" button
3. CSV file downloads automatically
4. Open in Excel/Google Sheets for analysis
```

**Adding to Google Calendar:**
```
1. Open booking detail modal
2. Click "Add to Google Calendar" button
3. Google Calendar opens with pre-filled event
4. Adjust and save to your calendar
```

---

## Troubleshooting

### Issue: Admin dashboard shows "Access Denied"

**Solution:**
```sql
-- Check if your user is in admin_users table
SELECT * FROM admin_users WHERE id = 'your-user-id';

-- If not found, add yourself
INSERT INTO admin_users (id, role) VALUES ('your-user-id', 'super_admin');
```

### Issue: Payment link not appearing in confirmation email

**Checklist:**
1. Verify payment_link field is populated in database
2. Check email template has payment link section (lines 143-174 in update-booking.js)
3. Ensure payment_status is not 'paid'
4. Check RESEND_API_KEY environment variable

**Test:**
```sql
-- Check if payment_link is saved
SELECT id, booking_number, payment_link, payment_status
FROM bookings
WHERE id = 'booking-id-here';
```

### Issue: Booking history not logging changes

**Solution:**
```sql
-- Check if trigger exists
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_booking_change';

-- If missing, re-run the migration
-- supabase/migrations/add_admin_console_features.sql
```

### Issue: Calendar view not showing bookings

**Checklist:**
1. Verify bookings have valid date format (YYYY-MM-DD)
2. Check browser console for errors
3. Ensure bookings array is passed correctly to CalendarView component

**Debug:**
```typescript
console.log('Bookings for calendar:', bookings.map(b => ({
  id: b.id,
  date: b.date,
  status: b.status
})));
```

### Issue: Google Calendar link not working

**Solution:**
- Verify date and time_slot format in booking
- Check that full_address or address is populated
- Ensure URL encoding in `generateGoogleCalendarLink` function

### Issue: CSV export missing data

**Solution:**
```typescript
// Check which bookings are being exported
console.log('Exporting bookings:', bookings.length);

// Verify booking data structure
console.log('Sample booking:', bookings[0]);
```

---

## API Reference

### Update Booking Endpoint

**Endpoint:** `POST /api/update-booking`

**Request Body:**
```json
{
  "id": "booking-uuid",
  "status": "confirmed",
  "payment_link": "https://buy.stripe.com/...",
  "admin_notes": "Payment due within 48 hours",
  "internal_notes": "Customer requested morning slot",
  "payment_status": "pending"
}
```

**Response:**
```json
{
  "success": true,
  "booking": { /* updated booking object */ },
  "message": "Booking updated successfully"
}
```

### Get Bookings Endpoint

**Endpoint:** `GET /api/get-bookings`

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, rejected, completed)
- `payment_status` - Filter by payment status (paid, pending)
- `start_date` - Filter by start date (YYYY-MM-DD)
- `end_date` - Filter by end date (YYYY-MM-DD)

---

## Security Considerations

### Row Level Security (RLS)

All tables have RLS policies:

**bookings table:**
- Users can read their own bookings
- Admins can read/update all bookings

**admin_users table:**
- Only super_admins can modify
- All authenticated users can read (to check permissions)

**booking_history table:**
- Admins can read all history
- Regular users cannot access

### Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
```

### Best Practices

1. **Never commit Stripe payment links** to version control
2. **Rotate API keys** regularly
3. **Limit super_admin access** to 1-2 trusted users
4. **Review audit logs** regularly for suspicious activity
5. **Test payment links** in Stripe test mode before production
6. **Backup database** before running migrations

---

## Migration Checklist

Use this checklist when deploying to production:

- [ ] Database migration applied (`add_admin_console_features.sql`)
- [ ] Verified new columns exist on bookings table
- [ ] Created admin_users table
- [ ] Created booking_history table
- [ ] Added yourself as super_admin
- [ ] Created Stripe payment links for all packages
- [ ] Updated `STRIPE_PAYMENT_LINKS` in adminHelpers.ts
- [ ] Tested BookingDetailModal component
- [ ] Tested CalendarView component
- [ ] Tested payment link in confirmation email
- [ ] Tested CSV export
- [ ] Tested Google Calendar integration
- [ ] Verified RLS policies are active
- [ ] Tested admin permission checks
- [ ] Reviewed audit trail logging
- [ ] Tested complete booking workflow end-to-end
- [ ] Created backup of database
- [ ] Documented custom Stripe webhook (if applicable)

---

## Support

For issues or questions:

1. Check this documentation
2. Review `ADMIN_CONSOLE_IMPLEMENTATION_GUIDE.md` for detailed implementation
3. Check `BOOKING_EMAIL_WORKFLOW.md` for email-related issues
4. Review database migration file for schema details
5. Check component source code for implementation details

---

## Change Log

### Version 1.0.0 (Current)

**Added:**
- BookingDetailModal component for comprehensive booking management
- CalendarView component for visual booking management
- Payment link integration with Stripe
- Email template with payment link section
- Admin utilities and helper functions
- Audit trail with booking_history table
- Role-based access control (super_admin, admin, viewer)
- CSV export functionality
- Google Calendar integration
- Booking statistics and analytics
- Search and filter capabilities

**Database Changes:**
- Added 8 new columns to bookings table
- Created admin_users table
- Created booking_history table
- Added automatic logging triggers
- Created admin_booking_stats view
- Configured RLS policies

---

## Next Steps

1. Apply database migration
2. Create Stripe payment links
3. Update payment link configuration
4. Integrate components into AdminBookings page
5. Test complete workflow
6. Train team on new features
7. Monitor audit logs
8. Collect feedback and iterate

**Estimated Setup Time:** 2-3 hours

**Difficulty Level:** Intermediate

**Prerequisites:**
- Supabase project with bookings table
- Stripe account
- Resend account for emails
- Admin access to database
