import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Package,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { Booking } from '../types/booking';
import { PACKAGES } from '../types/booking';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/get-bookings${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled',
    paymentStatus?: 'pending' | 'paid' | 'refunded'
  ) => {
    setUpdating(bookingId);

    try {
      const response = await fetch('/api/update-booking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bookingId,
          status,
          ...(paymentStatus && { payment_status: paymentStatus }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      // Refresh bookings
      await fetchBookings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setUpdating(null);
    }
  };

  const getPackageName = (packageType: string): string => {
    const pkg = PACKAGES.find((p) => p.id === packageType);
    return pkg ? `${pkg.name} (${pkg.duration})` : packageType;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
      padding: '40px 20px',
    },
    header: {
      maxWidth: '1400px',
      margin: '0 auto 40px',
      color: 'white',
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '18px',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    filterBar: {
      maxWidth: '1400px',
      margin: '0 auto 24px',
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
    },
    filterButton: (active: boolean) => ({
      padding: '12px 24px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: active
        ? 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)'
        : 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '14px',
      fontWeight: '600',
    }),
    refreshButton: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginLeft: 'auto',
    } as React.CSSProperties,
    bookingsGrid: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '24px',
    },
    bookingCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      transition: 'all 0.3s',
    } as React.CSSProperties,
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '20px',
    },
    statusBadge: (status: string) => ({
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      background: `${getStatusColor(status)}33`,
      color: getStatusColor(status),
      textTransform: 'capitalize' as const,
    }),
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '14px',
    },
    iconWrapper: {
      color: '#A78BFA',
    },
    divider: {
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)',
      margin: '16px 0',
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    price: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    paymentBadge: (status: string) => ({
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      background: status === 'paid' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)',
      color: status === 'paid' ? '#86EFAC' : '#FCD34D',
      textTransform: 'capitalize' as const,
    }),
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginTop: '16px',
    },
    actionButton: (variant: 'confirm' | 'cancel' | 'paid') => {
      const colors = {
        confirm: 'rgba(34, 197, 94, 0.2)',
        cancel: 'rgba(239, 68, 68, 0.2)',
        paid: 'rgba(6, 182, 212, 0.2)',
      };

      return {
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: colors[variant],
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: '13px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      } as React.CSSProperties;
    },
    emptyState: {
      maxWidth: '600px',
      margin: '60px auto',
      textAlign: 'center' as const,
      color: 'rgba(255, 255, 255, 0.5)',
    },
    emptyIcon: {
      marginBottom: '16px',
    },
    message: {
      marginTop: '12px',
      padding: '12px',
      borderRadius: '8px',
      background: 'rgba(168, 139, 250, 0.1)',
      border: '1px solid rgba(168, 139, 250, 0.2)',
      color: '#C4B5FD',
      fontSize: '14px',
      fontStyle: 'italic' as const,
    },
    errorState: {
      maxWidth: '600px',
      margin: '60px auto',
      padding: '32px',
      textAlign: 'center' as const,
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '24px',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    errorIcon: {
      marginBottom: '16px',
      color: '#EF4444',
    },
    errorText: {
      color: '#FCA5A5',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Booking Management</h1>
        <p style={styles.subtitle}>
          Manage all bookings for Carls Newton's Science Shows
        </p>
      </div>

      <div style={styles.filterBar}>
        <button
          style={styles.filterButton(filter === 'all')}
          onClick={() => {
            setFilter('all');
            fetchBookings();
          }}
        >
          All Bookings
        </button>
        <button
          style={styles.filterButton(filter === 'pending')}
          onClick={() => {
            setFilter('pending');
            fetchBookings();
          }}
        >
          Pending
        </button>
        <button
          style={styles.filterButton(filter === 'confirmed')}
          onClick={() => {
            setFilter('confirmed');
            fetchBookings();
          }}
        >
          Confirmed
        </button>
        <button
          style={styles.filterButton(filter === 'cancelled')}
          onClick={() => {
            setFilter('cancelled');
            fetchBookings();
          }}
        >
          Cancelled
        </button>
        <button style={styles.refreshButton} onClick={fetchBookings}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading && (
        <div style={styles.emptyState}>
          <RefreshCw size={48} style={{ ...styles.emptyIcon, animation: 'spin 1s linear infinite' }} />
          <p>Loading bookings...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorState}>
          <AlertCircle size={48} style={styles.errorIcon} />
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div style={styles.emptyState}>
          <Calendar size={48} style={styles.emptyIcon} />
          <p>No bookings found</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div style={styles.bookingsGrid}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={styles.bookingCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {booking.customer_name}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.statusBadge(booking.status)}>{booking.status}</div>
              </div>

              <div style={styles.infoRow}>
                <div style={styles.iconWrapper}>
                  <Calendar size={16} />
                </div>
                <span>{formatDate(booking.date)}</span>
              </div>

              <div style={styles.infoRow}>
                <div style={styles.iconWrapper}>
                  <Clock size={16} />
                </div>
                <span>{booking.time_slot}</span>
              </div>

              <div style={styles.infoRow}>
                <div style={styles.iconWrapper}>
                  <Package size={16} />
                </div>
                <span>{getPackageName(booking.package_type)}</span>
              </div>

              <div style={styles.divider} />

              <div style={styles.infoRow}>
                <div style={styles.iconWrapper}>
                  <Mail size={16} />
                </div>
                <span>{booking.email}</span>
              </div>

              <div style={styles.infoRow}>
                <div style={styles.iconWrapper}>
                  <Phone size={16} />
                </div>
                <span>{booking.phone}</span>
              </div>

              <div style={styles.infoRow}>
                <div style={styles.iconWrapper}>
                  <MapPin size={16} />
                </div>
                <span style={{ flex: 1, wordBreak: 'break-word' }}>{booking.address}</span>
              </div>

              {booking.message && (
                <div style={styles.message}>
                  <strong>Message:</strong> {booking.message}
                </div>
              )}

              <div style={styles.divider} />

              <div style={styles.priceRow}>
                <span style={styles.price}>AED {booking.price.toLocaleString()}</span>
                <div style={styles.paymentBadge(booking.payment_status)}>
                  {booking.payment_status}
                </div>
              </div>

              {booking.status === 'pending' && (
                <div style={styles.actionsGrid}>
                  <button
                    style={styles.actionButton('confirm')}
                    onClick={() => updateBookingStatus(booking.id, 'confirmed', 'pending')}
                    disabled={updating === booking.id}
                  >
                    <CheckCircle size={16} />
                    {updating === booking.id ? 'Updating...' : 'Confirm'}
                  </button>
                  <button
                    style={styles.actionButton('cancel')}
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    disabled={updating === booking.id}
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                </div>
              )}

              {booking.status === 'confirmed' && booking.payment_status === 'pending' && (
                <button
                  style={{
                    ...styles.actionButton('paid'),
                    gridColumn: '1 / -1',
                  }}
                  onClick={() => updateBookingStatus(booking.id, 'confirmed', 'paid')}
                  disabled={updating === booking.id}
                >
                  <DollarSign size={16} />
                  {updating === booking.id ? 'Updating...' : 'Mark as Paid'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
