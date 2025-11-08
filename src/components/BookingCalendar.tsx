import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X } from 'lucide-react';
import type { CalendarDay, TimeSlot } from '../types/booking';

const BookingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'preschool' | 'classic' | 'halfday'>('classic');

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
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPastDate = date < today;
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        isSelected: selectedDate?.getTime() === date.getTime(),
        isAvailable: !isPastDate, // Simple logic: all future dates are available
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
      });
    }

    return days;
  };

  // Generate time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const times = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '01:00 PM', '02:00 PM',
      '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    times.forEach(time => {
      // Mock availability - in real app, this would come from backend
      const available = Math.random() > 0.3;
      slots.push({ time, available });
    });

    return slots;
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
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    alert(`Booking confirmed for ${selectedDate?.toLocaleDateString()} at ${selectedTimeSlot}`);
    setShowBookingModal(false);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const calendarDays = generateCalendarDays();
  const timeSlots = generateTimeSlots();

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
    dayCell: (day: CalendarDay) => ({
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: day.isAvailable && day.isCurrentMonth ? 'pointer' : 'default',
      transition: 'all 0.3s',
      background: day.isSelected
        ? 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)'
        : day.isToday
        ? 'rgba(6, 182, 212, 0.2)'
        : 'rgba(255, 255, 255, 0.03)',
      border: day.isToday
        ? '2px solid #06B6D4'
        : '1px solid rgba(255, 255, 255, 0.1)',
      color: !day.isCurrentMonth
        ? 'rgba(255, 255, 255, 0.3)'
        : !day.isAvailable
        ? 'rgba(255, 255, 255, 0.4)'
        : 'white',
      opacity: !day.isAvailable && day.isCurrentMonth ? 0.5 : 1,
    }),
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
    timeSlot: (available: boolean, selected: boolean) => ({
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: selected
        ? 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)'
        : available
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.02)',
      color: available ? 'white' : 'rgba(255, 255, 255, 0.3)',
      textAlign: 'center' as const,
      cursor: available ? 'pointer' : 'not-allowed',
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
                  if (!day.isSelected) {
                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (day.isAvailable && day.isCurrentMonth) {
                  e.currentTarget.style.transform = 'scale(1)';
                  if (!day.isSelected) {
                    e.currentTarget.style.background = day.isToday
                      ? 'rgba(6, 182, 212, 0.2)'
                      : 'rgba(255, 255, 255, 0.03)';
                  }
                }
              }}
            >
              {day.date.getDate()}
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

            <form onSubmit={handleBooking}>
              {/* Package Selection */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  Select Package
                </div>
                <div style={styles.packageGrid}>
                  <div
                    style={styles.packageCard(selectedPackage === 'preschool')}
                    onClick={() => setSelectedPackage('preschool')}
                  >
                    <div style={styles.packageName}>Preschool</div>
                    <div style={styles.packagePrice}>د.إ 1,200</div>
                  </div>
                  <div
                    style={styles.packageCard(selectedPackage === 'classic')}
                    onClick={() => setSelectedPackage('classic')}
                  >
                    <div style={styles.packageName}>Classic Show</div>
                    <div style={styles.packagePrice}>د.إ 1,800</div>
                  </div>
                  <div
                    style={styles.packageCard(selectedPackage === 'halfday')}
                    onClick={() => setSelectedPackage('halfday')}
                  >
                    <div style={styles.packageName}>Half-Day</div>
                    <div style={styles.packagePrice}>د.إ 2,500</div>
                  </div>
                </div>
              </div>

              {/* Time Slot Selection */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <Clock size={20} />
                  Select Time Slot
                </div>
                <div style={styles.timeSlotsGrid}>
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      style={styles.timeSlot(slot.available, selectedTimeSlot === slot.time)}
                      onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
                    >
                      {slot.time}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>Contact Information</div>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  style={styles.input}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  style={styles.input}
                />
                <textarea
                  placeholder="Special requests or questions (optional)"
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTimeSlot}
                style={{
                  ...styles.submitButton,
                  opacity: selectedTimeSlot ? 1 : 0.5,
                  cursor: selectedTimeSlot ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={(e) => {
                  if (selectedTimeSlot) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
