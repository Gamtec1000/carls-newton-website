import React, { useState } from 'react';
import { Booking } from '../types/booking';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onUpdate: (bookingId: string, updates: any) => Promise<void>;
  userRole?: 'super_admin' | 'admin' | 'viewer';
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onUpdate,
  userRole = 'admin',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [paymentLink, setPaymentLink] = useState(booking?.payment_link || '');
  const [adminNotes, setAdminNotes] = useState(booking?.admin_notes || '');
  const [internalNotes, setInternalNotes] = useState(booking?.internal_notes || '');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!booking) return null;

  const packageNames: Record<string, string> = {
    preschool: 'Preschool Special (30-45 mins)',
    classic: 'Classic Show (45-60 mins)',
    halfday: 'Half-Day Experience (4 hours)',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleConfirm = async () => {
    if (userRole === 'viewer') {
      alert('You do not have permission to confirm bookings');
      return;
    }

    if (!paymentLink) {
      alert('Please enter a Stripe payment link before confirming');
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(booking.id, {
        status: 'confirmed',
        payment_link: paymentLink,
        admin_notes: adminNotes,
        internal_notes: internalNotes,
      });
      alert('Booking confirmed! Confirmation email sent to customer.');
      onClose();
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (userRole === 'viewer') {
      alert('You do not have permission to reject bookings');
      return;
    }

    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(booking.id, {
        status: 'rejected',
        rejected_reason: rejectionReason,
        internal_notes: internalNotes,
      });
      alert('Booking rejected. Customer will be notified.');
      onClose();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (userRole === 'viewer') {
      alert('You do not have permission to edit notes');
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(booking.id, {
        admin_notes: adminNotes,
        internal_notes: internalNotes,
        payment_link: paymentLink,
      });
      alert('Notes saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const generateGoogleCalendarLink = () => {
    const title = encodeURIComponent(`Carls Newton Show - ${booking.organization_name}`);
    const details = encodeURIComponent(
      `Package: ${packageNames[booking.package_type] || booking.package_type}\n` +
      `Customer: ${booking.customer_name}\n` +
      `Email: ${booking.email}\n` +
      `Phone: ${booking.phone}\n` +
      `Students: ${booking.number_of_students}\n` +
      `Price: AED ${booking.price?.toLocaleString()}\n` +
      `Status: ${booking.status}\n` +
      `Booking ID: ${booking.booking_number || booking.id}`
    );
    const location = encodeURIComponent(booking.full_address || booking.address);

    // Parse date and time
    const startDate = new Date(`${booking.date}T${booking.time_slot}`);
    const endDate = new Date(startDate.getTime() + 3600000); // Add 1 hour

    const formatGCalDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      case 'completed':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #d946ef 0%, #06b6d4 100%)',
            padding: '30px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>

          <h2 style={{ color: 'white', margin: '0 0 10px 0' }}>Booking Details</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#1a1a2e',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              #{booking.booking_number || booking.id}
            </span>
            <span
              style={{
                background: getStatusColor(booking.status),
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {booking.status.toUpperCase()}
            </span>
            <span
              style={{
                background: booking.payment_status === 'paid' ? '#22C55E' : '#F59E0B',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {booking.payment_status === 'paid' ? '💰 PAID' : '⏳ PAYMENT PENDING'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Customer Information */}
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#d946ef', marginBottom: '15px' }}>Customer Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Customer Name</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>
                  {booking.title ? `${booking.title} ` : ''}{booking.customer_name}
                </p>
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Email</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>
                  <a href={`mailto:${booking.email}`} style={{ color: '#06b6d4' }}>
                    {booking.email}
                  </a>
                </p>
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Phone</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>
                  <a href={`tel:${booking.phone}`} style={{ color: '#06b6d4' }}>
                    {booking.phone}
                  </a>
                </p>
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Organization</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>{booking.organization_name}</p>
              </div>
            </div>
          </section>

          {/* Booking Details */}
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#d946ef', marginBottom: '15px' }}>Booking Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Package</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>
                  {packageNames[booking.package_type] || booking.package_type}
                </p>
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Date</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>{formatDate(booking.date)}</p>
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Time</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>{booking.time_slot}</p>
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Number of Students</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>{booking.number_of_students}</p>
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Price</label>
                <p style={{ color: 'white', margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '18px' }}>
                  AED {booking.price?.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ color: '#9ca3af', fontSize: '14px' }}>Address</label>
              <p style={{ color: 'white', margin: '5px 0 0 0' }}>
                {booking.full_address || booking.address}
              </p>
            </div>
            {booking.special_requests && (
              <div style={{ marginTop: '15px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Special Requests</label>
                <p style={{ color: 'white', margin: '5px 0 0 0' }}>{booking.special_requests}</p>
              </div>
            )}
          </section>

          {/* Payment Link Section */}
          {booking.status === 'pending' && (
            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#d946ef', marginBottom: '15px' }}>Payment Link</h3>
              <input
                type="url"
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder="https://buy.stripe.com/..."
                disabled={userRole === 'viewer'}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2d2d44',
                  border: '2px solid #3d3d5c',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
              <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>
                Enter the Stripe payment link for this booking. Customer will receive this in confirmation email.
              </p>
            </section>
          )}

          {booking.payment_link && (
            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#d946ef', marginBottom: '15px' }}>Payment Link</h3>
              <a
                href={booking.payment_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#06b6d4',
                  wordBreak: 'break-all',
                }}
              >
                {booking.payment_link}
              </a>
            </section>
          )}

          {/* Admin Notes */}
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#d946ef', marginBottom: '15px' }}>Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Notes visible to customer (included in confirmation email)..."
              disabled={userRole === 'viewer' && !isEditing}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                backgroundColor: '#2d2d44',
                border: '2px solid #3d3d5c',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </section>

          {/* Internal Notes */}
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#d946ef', marginBottom: '15px' }}>Internal Notes (Private)</h3>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Private notes for admin team only (not visible to customer)..."
              disabled={userRole === 'viewer' && !isEditing}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                backgroundColor: '#2d2d44',
                border: '2px solid #3d3d5c',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </section>

          {/* Google Calendar Export */}
          <section style={{ marginBottom: '30px' }}>
            <a
              href={generateGoogleCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
              }}
            >
              📅 Add to Google Calendar
            </a>
          </section>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '30px' }}>
            {booking.status === 'pending' && userRole !== 'viewer' && (
              <>
                <button
                  onClick={handleConfirm}
                  disabled={isUpdating || !paymentLink}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '15px 30px',
                    background: paymentLink
                      ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                      : '#4b5563',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: paymentLink && !isUpdating ? 'pointer' : 'not-allowed',
                    opacity: isUpdating ? 0.7 : 1,
                  }}
                >
                  {isUpdating ? 'Processing...' : '✅ Confirm & Send Email'}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isUpdating}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '15px 30px',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    opacity: isUpdating ? 0.7 : 1,
                  }}
                >
                  ❌ Reject Booking
                </button>
              </>
            )}
            {userRole !== 'viewer' && (
              <button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  opacity: isUpdating ? 0.7 : 1,
                }}
              >
                💾 Save Notes
              </button>
            )}
          </div>

          {/* Metadata */}
          {booking.created_at && (
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #3d3d5c' }}>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '5px 0' }}>
                Created: {new Date(booking.created_at).toLocaleString()}
              </p>
              {booking.confirmed_at && (
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '5px 0' }}>
                  Confirmed: {new Date(booking.confirmed_at).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
          }}
          onClick={() => setShowRejectModal(false)}
        >
          <div
            style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
              padding: '30px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#EF4444', marginBottom: '20px' }}>Reject Booking</h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
              Please provide a reason for rejecting this booking. This will be sent to the customer.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              autoFocus
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                backgroundColor: '#2d2d44',
                border: '2px solid #3d3d5c',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '20px',
              }}
            />
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={handleReject}
                disabled={isUpdating || !rejectionReason.trim()}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: rejectionReason.trim()
                    ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                    : '#4b5563',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: rejectionReason.trim() && !isUpdating ? 'pointer' : 'not-allowed',
                }}
              >
                {isUpdating ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#4b5563',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailModal;
