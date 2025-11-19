import React, { useState, useMemo } from 'react';
import { Booking } from '../types/booking';

interface CalendarViewProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, onBookingClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, bookings: [] });
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayBookings = bookings.filter(booking => booking.date === dateStr);
      days.push({ day, bookings: dayBookings });
    }

    return days;
  }, [currentMonth, currentYear, bookings]);

  // Get booking count by status
  const getBookingsByStatus = (dayBookings: Booking[]) => {
    const confirmed = dayBookings.filter(b => b.status === 'confirmed').length;
    const pending = dayBookings.filter(b => b.status === 'pending').length;
    const rejected = dayBookings.filter(b => b.status === 'rejected').length;
    const completed = dayBookings.filter(b => b.status === 'completed').length;

    return { confirmed, pending, rejected, completed };
  };

  const isToday = (day: number | null) => {
    if (day === null) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
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
    <div style={{ width: '100%' }}>
      {/* Calendar Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
          borderRadius: '12px',
        }}
      >
        <button
          onClick={goToPreviousMonth}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ← Previous
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '28px' }}>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#06b6d4',
              border: '2px solid #06b6d4',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Next →
        </button>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#22C55E', borderRadius: '4px' }} />
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>Confirmed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#F59E0B', borderRadius: '4px' }} />
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>Pending</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#06B6D4', borderRadius: '4px' }} />
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#EF4444', borderRadius: '4px' }} />
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>Rejected</span>
        </div>
      </div>

      {/* Day of week headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
          marginBottom: '10px',
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#d946ef',
              padding: '10px',
              fontSize: '14px',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
        }}
      >
        {calendarDays.map((dayData, index) => {
          const { day, bookings: dayBookings } = dayData;
          const stats = getBookingsByStatus(dayBookings);
          const hasBookings = dayBookings.length > 0;

          return (
            <div
              key={index}
              style={{
                minHeight: '120px',
                backgroundColor: day ? '#1a1a2e' : 'transparent',
                borderRadius: '12px',
                padding: '10px',
                position: 'relative',
                border: isToday(day) ? '3px solid #06b6d4' : '1px solid #2d2d44',
                cursor: hasBookings ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (hasBookings) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(217, 70, 239, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {day && (
                <>
                  {/* Day number */}
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: isToday(day) ? '#06b6d4' : 'white',
                      fontSize: '16px',
                      marginBottom: '8px',
                    }}
                  >
                    {day}
                  </div>

                  {/* Booking indicators */}
                  {hasBookings && (
                    <div style={{ marginTop: '8px' }}>
                      {stats.confirmed > 0 && (
                        <div
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            border: '1px solid #22C55E',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            marginBottom: '4px',
                            fontSize: '12px',
                            color: '#22C55E',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}
                        >
                          ✓ {stats.confirmed}
                        </div>
                      )}
                      {stats.pending > 0 && (
                        <div
                          style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid #F59E0B',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            marginBottom: '4px',
                            fontSize: '12px',
                            color: '#F59E0B',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}
                        >
                          ⏳ {stats.pending}
                        </div>
                      )}
                      {stats.completed > 0 && (
                        <div
                          style={{
                            backgroundColor: 'rgba(6, 182, 212, 0.2)',
                            border: '1px solid #06B6D4',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            marginBottom: '4px',
                            fontSize: '12px',
                            color: '#06B6D4',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}
                        >
                          ✔ {stats.completed}
                        </div>
                      )}
                      {stats.rejected > 0 && (
                        <div
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid #EF4444',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            color: '#EF4444',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}
                        >
                          ✗ {stats.rejected}
                        </div>
                      )}

                      {/* Booking list (shown on hover) */}
                      <div
                        style={{
                          marginTop: '8px',
                          maxHeight: '60px',
                          overflowY: 'auto',
                        }}
                      >
                        {dayBookings.slice(0, 2).map((booking, idx) => (
                          <div
                            key={booking.id}
                            onClick={() => onBookingClick(booking)}
                            style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              marginBottom: '4px',
                              padding: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '4px',
                              borderLeft: `3px solid ${getStatusColor(booking.status)}`,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {booking.time_slot} - {booking.organization_name}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#06b6d4',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              marginTop: '4px',
                            }}
                          >
                            +{dayBookings.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Month Summary */}
      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
          borderRadius: '12px',
        }}
      >
        <h3 style={{ color: '#d946ef', marginBottom: '15px' }}>Monthly Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22C55E' }}>
              {bookings.filter(b => {
                const bookingDate = new Date(b.date);
                return b.status === 'confirmed' &&
                       bookingDate.getMonth() === currentMonth &&
                       bookingDate.getFullYear() === currentYear;
              }).length}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '5px' }}>Confirmed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B' }}>
              {bookings.filter(b => {
                const bookingDate = new Date(b.date);
                return b.status === 'pending' &&
                       bookingDate.getMonth() === currentMonth &&
                       bookingDate.getFullYear() === currentYear;
              }).length}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '5px' }}>Pending</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#06B6D4' }}>
              {bookings.filter(b => {
                const bookingDate = new Date(b.date);
                return b.status === 'completed' &&
                       bookingDate.getMonth() === currentMonth &&
                       bookingDate.getFullYear() === currentYear;
              }).length}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '5px' }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(217, 70, 239, 0.1)', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d946ef' }}>
              {bookings.filter(b => {
                const bookingDate = new Date(b.date);
                return bookingDate.getMonth() === currentMonth &&
                       bookingDate.getFullYear() === currentYear;
              }).length}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '5px' }}>Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
