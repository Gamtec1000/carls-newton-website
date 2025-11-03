import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X, AlertCircle, CheckCircle } from 'lucide-react';
import type { CalendarDay, Booking } from '../types/booking';
import {
  generateTimeSlots,
  hasHalfDayBooking,
  getBookingsForDate,
  validateBookingForm,
} from '../utils/bookingValidation';

const EnhancedBookingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'preschool' | 'classic' | 'halfday'>('classic');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
  });

  // Fetch bookings on component mount and when month changes
  useEffect(() => {
    fetchBookings();
  }, [currentDate]);

  const fetchBookings = async () => {
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      const response = await fetch(
        `/api/get-bookings?from_date=${startDate}&to_date=${endDate}`
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0);

    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isSelected: selectedDate?.getTime() === date.getTime(),
        isAvailable: false,
        bookingCount: 0,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isPastDate = date < today;
      const dateBookings = getBookingsForDate(bookings, dateStr);
      const hasHalfDay = hasHalfDayBooking(bookings, dateStr);

      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        isSelected: selectedDate?.getTime() === date.getTime(),
        isAvailable: !isPastDate && !hasHalfDay,
        bookingCount: dateBookings.length,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: selectedDate?.getTime() === date.getTime(),
        isAvailable: true,
        bookingCount: 0,
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isAvailable && day.isCurrentMonth) {
      setSelectedDate(day.date);
      setShowBookingModal(true);
      setSelectedTimeSlot(null);
      setError(null);
      setSuccess(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select a date and time slot');
      return;
    }

    // Validate form
    const validation = validateBookingForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedTimeSlot,
      packageType: selectedPackage,
    });

    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        package_type: selectedPackage,
        date: selectedDate.toISOString().split('T')[0],
        time_slot: selectedTimeSlot,
        message: formData.message,
      };

      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', address: '', message: '' });

      // Refresh bookings
      await fetchBookings();

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowBookingModal(false);
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = generateCalendarDays();
  const availableTimeSlots = selectedDate
    ? generateTimeSlots(
        bookings,
        selectedDate.toISOString().split('T')[0],
        selectedPackage
      )
    : [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    monthTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    navButtons: {
      display: 'flex',
      gap: '12px',
    },
    navButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    legend: {
      display: 'flex',
      gap: '24px',
      marginBottom: '24px',
      flexWrap: 'wrap' as const,
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    legendBox: (color: string) => ({
      width: '16px',
      height: '16px',
      borderRadius: '4px',
      background: color,
      border: '1px solid rgba(255, 255, 255, 0.3)',
    }),
    weekDaysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      marginBottom: '8px',
    },
    weekDay: {
      color: '#A78BFA',
      fontSize: '14px',
      fontWeight: '600',
      textAlign: 'center' as const,
      padding: '12px',
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
    },
    dayCell: (day: CalendarDay) => {
      let backgroundColor = 'rgba(255, 255, 255, 0.03)';

      if (day.isSelected) {
        backgroundColor = 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)';
      } else if (day.bookingCount && day.bookingCount > 0) {
        backgroundColor = 'rgba(239, 68, 68, 0.3)'; // Red for booked dates
      } else if (day.isToday) {
        backgroundColor = 'rgba(6, 182, 212, 0.2)';
      } else if (day.isAvailable && day.isCurrentMonth) {
        backgroundColor = 'rgba(34, 197, 94, 0.2)'; // Green for available
      }

      return {
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: day.isAvailable && day.isCurrentMonth ? 'pointer' : 'default',
        transition: 'all 0.3s',
        background: backgroundColor,
        border: day.isToday
          ? '2px solid #06B6D4'
          : '1px solid rgba(255, 255, 255, 0.1)',
        color: !day.isCurrentMonth
          ? 'rgba(255, 255, 255, 0.3)'
          : !day.isAvailable
          ? 'rgba(255, 255, 255, 0.4)'
          : 'white',
        opacity: !day.isAvailable && day.isCurrentMonth ? 0.5 : 1,
      };
    },
    bookingDot: {
      fontSize: '10px',
      color: '#EF4444',
      marginTop: '2px',
    },
    modal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '32px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      position: 'relative' as const,
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
    } as React.CSSProperties,
    section: {
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#C4B5FD',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    timeSlotsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '12px',
    },
    timeSlot: (selected: boolean) => ({
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: selected
        ? 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)'
        : 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '14px',
      fontWeight: '500',
    }),
    packageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
    },
    packageCard: (selected: boolean) => ({
      padding: '16px',
      borderRadius: '12px',
      border: selected
        ? '2px solid #06B6D4'
        : '1px solid rgba(255, 255, 255, 0.2)',
      background: selected
        ? 'rgba(6, 182, 212, 0.1)'
        : 'rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s',
    }),
    packageName: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '4px',
    },
    packageDuration: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: '8px',
    },
    packagePrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      fontSize: '16px',
      marginBottom: '16px',
      outline: 'none',
    } as React.CSSProperties,
    textarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      fontSize: '16px',
      marginBottom: '16px',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
    } as React.CSSProperties,
    submitButton: {
      width: '100%',
      padding: '14px 32px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
    } as React.CSSProperties,
    alert: (type: 'error' | 'success') => ({
      padding: '12px 16px',
      borderRadius: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
      border: `1px solid ${type === 'error' ? '#EF4444' : '#22C55E'}`,
      color: type === 'error' ? '#FCA5A5' : '#86EFAC',
    }),
    emptyMessage: {
      textAlign: 'center' as const,
      padding: '20px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.monthTitle}>
            <Calendar size={32} />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <div style={styles.navButtons}>
            <button
              onClick={handlePrevMonth}
              style={styles.navButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={20} color="white" />
            </button>
            <button
              onClick={handleNextMonth}
              style={styles.navButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={20} color="white" />
            </button>
          </div>
        </div>

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={styles.legendBox('rgba(34, 197, 94, 0.2)')} />
            <span>Available</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendBox('rgba(239, 68, 68, 0.3)')} />
            <span>Booked</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendBox('rgba(6, 182, 212, 0.2)')} />
            <span>Today</span>
          </div>
        </div>

        <div style={styles.weekDaysGrid}>
          {weekDays.map(day => (
            <div key={day} style={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        <div style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              style={styles.dayCell(day)}
              onClick={() => handleDateClick(day)}
              onMouseEnter={(e) => {
                if (day.isAvailable && day.isCurrentMonth) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (day.isAvailable && day.isCurrentMonth) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <div>{day.date.getDate()}</div>
              {day.bookingCount && day.bookingCount > 0 && (
                <div style={styles.bookingDot}>●</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showBookingModal && selectedDate && (
        <div style={styles.modal} onClick={() => setShowBookingModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>
                Book Your Show - {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                style={styles.closeButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <X size={20} color="white" />
              </button>
            </div>

            {error && (
              <div style={styles.alert('error')}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={styles.alert('success')}>
                <CheckCircle size={20} />
                <span>Booking created successfully! We'll contact you soon.</span>
              </div>
            )}

            <form onSubmit={handleBooking}>
              {/* Package Selection */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  Select Package
                </div>
                <div style={styles.packageGrid}>
                  <div
                    style={styles.packageCard(selectedPackage === 'preschool')}
                    onClick={() => {
                      setSelectedPackage('preschool');
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <div style={styles.packageName}>Preschool Special</div>
                    <div style={styles.packageDuration}>30-45 mins</div>
                    <div style={styles.packagePrice}>AED 1,200</div>
                  </div>
                  <div
                    style={styles.packageCard(selectedPackage === 'classic')}
                    onClick={() => {
                      setSelectedPackage('classic');
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <div style={styles.packageName}>Classic Show</div>
                    <div style={styles.packageDuration}>45-60 mins</div>
                    <div style={styles.packagePrice}>AED 1,800</div>
                  </div>
                  <div
                    style={styles.packageCard(selectedPackage === 'halfday')}
                    onClick={() => {
                      setSelectedPackage('halfday');
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <div style={styles.packageName}>Half-Day Experience</div>
                    <div style={styles.packageDuration}>4 hours</div>
                    <div style={styles.packagePrice}>AED 2,500</div>
                  </div>
                </div>
              </div>

              {/* Time Slot Selection */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <Clock size={20} />
                  Select Time Slot
                </div>
                {availableTimeSlots.length > 0 ? (
                  <div style={styles.timeSlotsGrid}>
                    {availableTimeSlots.map((slot, index) => (
                      <div
                        key={index}
                        style={styles.timeSlot(selectedTimeSlot === slot)}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyMessage}>
                    {selectedPackage === 'halfday'
                      ? 'Half-day bookings require the entire day to be free. This date has other bookings.'
                      : 'No available time slots for this date.'}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>Contact Information</div>
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={styles.input}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={styles.input}
                />
                <textarea
                  placeholder="Full Address *"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={styles.textarea}
                />
                <textarea
                  placeholder="Special requests or questions (optional)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTimeSlot || loading || success}
                style={{
                  ...styles.submitButton,
                  opacity: selectedTimeSlot && !loading && !success ? 1 : 0.5,
                  cursor: selectedTimeSlot && !loading && !success ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={(e) => {
                  if (selectedTimeSlot && !loading && !success) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? 'Processing...' : success ? 'Booking Confirmed!' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBookingCalendar;
