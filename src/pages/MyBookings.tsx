import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Package, FileText, ChevronLeft, Filter, Search } from 'lucide-react';
import type { Booking } from '../types/booking';
import { PACKAGES } from '../types/booking';
import GooeyNav from '../components/GooeyNav';

export default function MyBookings() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'package'>('date');

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch bookings for the logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      if (!profile?.email) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch all bookings and filter by email on client side
        const response = await fetch('/api/get-bookings');

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();

        // Filter bookings by user's email
        const userBookings = data.filter((booking: Booking) =>
          booking.email.toLowerCase() === profile.email.toLowerCase()
        );

        setBookings(userBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.email) {
      fetchBookings();
    }
  }, [profile?.email]);

  // Get package name from package type
  const getPackageName = (packageType: string) => {
    const pkg = PACKAGES.find(p => p.id === packageType);
    return pkg?.name || packageType;
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const colors: { [key: string]: { bg: string; text: string; emoji: string } } = {
      confirmed: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22C55E', emoji: '✅' },
      pending: { bg: 'rgba(251, 146, 60, 0.2)', text: '#FB923C', emoji: '⏳' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', emoji: '❌' },
    };

    const style = colors[status] || colors.pending;

    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          background: style.bg,
          color: style.text,
          fontFamily: "'Aloe Vera Sans', sans-serif",
        }}
      >
        {style.emoji} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge component
  const PaymentBadge = ({ status }: { status: string }) => {
    const colors: { [key: string]: { bg: string; text: string; emoji: string } } = {
      paid: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22C55E', emoji: '💳' },
      pending: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6', emoji: '⏳' },
      refunded: { bg: 'rgba(168, 85, 247, 0.2)', text: '#A855F7', emoji: '↩️' },
    };

    const style = colors[status] || colors.pending;

    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          background: style.bg,
          color: style.text,
          fontFamily: "'Aloe Vera Sans', sans-serif",
        }}
      >
        {style.emoji} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      if (filterStatus !== 'all' && booking.status !== filterStatus) return false;
      if (searchQuery && !booking.booking_number?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      } else if (sortBy === 'package') {
        return a.package_type.localeCompare(b.package_type);
      }
      return 0;
    });

  if (authLoading || !profile) {
    return <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)' }} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)', color: 'white' }}>
      {/* Navigation */}
      <GooeyNav
        items={[
          { label: 'Home', href: '/', onClick: () => navigate('/') },
          { label: 'My Bookings', href: '/my-bookings' },
        ]}
        particleCount={20}
        particleDistances={[90, 10]}
        particleR={120}
        initialActiveIndex={1}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 20px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#06B6D4',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              marginBottom: '20px',
            }}
          >
            <ChevronLeft size={20} />
            Back to Home
          </button>

          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px',
            }}
          >
            My Bookings
          </h1>
          <p style={{ color: '#C4B5FD', fontSize: '16px', fontFamily: "'Aloe Vera Sans', sans-serif" }}>
            View and manage your science show bookings
          </p>
        </div>

        {/* Filters and Search */}
        <div style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#C4B5FD' }} />
            <input
              type="text"
              placeholder="Search by Booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                background: 'rgba(30, 27, 75, 0.6)',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontFamily: "'Aloe Vera Sans', sans-serif",
              }}
            />
          </div>

          {/* Filter by Status */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Filter size={18} style={{ color: '#C4B5FD' }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{
                padding: '10px 16px',
                background: 'rgba(30, 27, 75, 0.6)',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontFamily: "'Aloe Vera Sans', sans-serif",
                cursor: 'pointer',
              }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort by */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#C4B5FD', fontSize: '14px', fontFamily: "'Aloe Vera Sans', sans-serif" }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '10px 16px',
                background: 'rgba(30, 27, 75, 0.6)',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontFamily: "'Aloe Vera Sans', sans-serif",
                cursor: 'pointer',
              }}
            >
              <option value="date">Date (Newest)</option>
              <option value="status">Status</option>
              <option value="package">Package</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#C4B5FD' }}>
            <div style={{ fontSize: '18px', fontFamily: "'Aloe Vera Sans', sans-serif" }}>Loading your bookings...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              padding: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              color: '#EF4444',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'rgba(30, 27, 75, 0.4)',
              border: '2px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '20px',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
            <h3 style={{ fontSize: '24px', color: '#06B6D4', marginBottom: '12px', fontFamily: "'Aloe Vera Sans', sans-serif" }}>
              No bookings yet
            </h3>
            <p style={{ color: '#C4B5FD', fontSize: '16px', marginBottom: '30px', fontFamily: "'Aloe Vera Sans', sans-serif" }}>
              {searchQuery || filterStatus !== 'all'
                ? 'No bookings match your search criteria'
                : 'Book your first amazing science show!'}
            </p>
            {(!searchQuery && filterStatus === 'all') && (
              <button
                onClick={() => navigate('/#booking')}
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                  padding: '14px 32px',
                  borderRadius: '25px',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                }}
              >
                Book Now
              </button>
            )}
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.8), rgba(30, 58, 138, 0.8))',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.6)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(6, 182, 212, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                }}
              >
                {/* Booking Header */}
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#A855F7', fontFamily: "'Aloe Vera Sans', sans-serif", marginBottom: '4px' }}>
                      {booking.booking_number || booking.id.slice(0, 8)}
                    </div>
                    <h3 style={{ fontSize: '20px', color: '#06B6D4', fontWeight: 'bold', fontFamily: "'Aloe Vera Sans', sans-serif" }}>
                      {getPackageName(booking.package_type)}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <StatusBadge status={booking.status} />
                    <PaymentBadge status={booking.payment_status} />
                  </div>
                </div>

                {/* Booking Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#C4B5FD', fontFamily: "'Aloe Vera Sans', sans-serif" }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={16} style={{ color: '#06B6D4' }} />
                    <span>{new Date(booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={16} style={{ color: '#06B6D4' }} />
                    <span>{booking.time_slot}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Package size={16} style={{ color: '#06B6D4' }} />
                    <span>{booking.organization_name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} style={{ color: '#06B6D4' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {booking.full_address || booking.address}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DollarSign size={16} style={{ color: '#06B6D4' }} />
                    <span style={{ fontWeight: 'bold', color: '#A855F7' }}>AED {booking.price}</span>
                  </div>

                  {booking.special_requests && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '8px' }}>
                      <FileText size={16} style={{ color: '#06B6D4', marginTop: '2px' }} />
                      <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#A78BFA' }}>
                        {booking.special_requests}
                      </span>
                    </div>
                  )}
                </div>

                {/* Booking Footer */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(6, 182, 212, 0.2)', fontSize: '11px', color: '#9333EA' }}>
                  Booked on {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
