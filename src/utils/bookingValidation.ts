import type { Booking } from '../types/booking';

export interface BookingRules {
  maxBookingsPerDay: number;
  bufferHours: number;
  operatingHours: {
    start: number; // 8 AM
    end: number; // 4 PM (last booking)
  };
}

export const BOOKING_RULES: BookingRules = {
  maxBookingsPerDay: 3,
  bufferHours: 2,
  operatingHours: {
    start: 8,
    end: 16, // 4 PM
  },
};

/**
 * Check if a date has a half-day booking (which blocks the entire day)
 */
export function hasHalfDayBooking(bookings: Booking[], date: string): boolean {
  return bookings.some(
    (booking) =>
      booking.date === date &&
      booking.package_type === 'halfday' &&
      booking.status !== 'cancelled'
  );
}

/**
 * Get all confirmed bookings for a specific date
 */
export function getBookingsForDate(bookings: Booking[], date: string): Booking[] {
  return bookings.filter(
    (booking) =>
      booking.date === date && booking.status !== 'cancelled'
  );
}

/**
 * Check if a time slot is available based on booking rules
 */
export function isTimeSlotAvailable(
  bookings: Booking[],
  date: string,
  timeSlot: string,
  packageType: 'preschool' | 'classic' | 'halfday',
  customerEmail?: string,
  customerAddress?: string
): { available: boolean; reason?: string } {
  const dateBookings = getBookingsForDate(bookings, date);

  // Rule 1: Check if there's already a half-day booking
  if (hasHalfDayBooking(bookings, date)) {
    return { available: false, reason: 'Date blocked by half-day booking' };
  }

  // Rule 2: If this is a half-day booking, the day must be completely free
  if (packageType === 'halfday' && dateBookings.length > 0) {
    return { available: false, reason: 'Half-day bookings require the entire day to be free' };
  }

  // Rule 3: Check max bookings per day for regular shows
  if (packageType !== 'halfday' && dateBookings.length >= BOOKING_RULES.maxBookingsPerDay) {
    return { available: false, reason: 'Maximum bookings per day reached' };
  }

  // Rule 4: Check 2-hour buffer between shows
  // SMART LOGIC: Skip buffer if same customer email AND same address
  const requestedTime = parseTimeSlot(timeSlot);
  for (const booking of dateBookings) {
    const bookedTime = parseTimeSlot(booking.time_slot);
    const timeDiff = Math.abs(requestedTime - bookedTime);

    // Check if this booking is by the same customer at the same location
    const sameCustomer = customerEmail && booking.email.toLowerCase() === customerEmail.toLowerCase();
    const sameLocation = customerAddress && booking.address.toLowerCase() === customerAddress.toLowerCase();
    const skipBuffer = sameCustomer && sameLocation;

    // Apply 2-hour buffer UNLESS it's the same customer at the same location
    if (!skipBuffer && timeDiff < BOOKING_RULES.bufferHours) {
      return {
        available: false,
        reason: `Requires ${BOOKING_RULES.bufferHours}-hour buffer between shows`,
      };
    }
  }

  // Rule 5: Check operating hours
  if (
    requestedTime < BOOKING_RULES.operatingHours.start ||
    requestedTime > BOOKING_RULES.operatingHours.end
  ) {
    return {
      available: false,
      reason: `Operating hours: ${BOOKING_RULES.operatingHours.start}:00 AM - ${BOOKING_RULES.operatingHours.end}:00 PM`,
    };
  }

  return { available: true };
}

/**
 * Parse time slot string to hour number (e.g., "09:00 AM" -> 9)
 */
export function parseTimeSlot(timeSlot: string): number {
  const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;

  let hour = parseInt(match[1], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  return hour;
}

/**
 * Generate available time slots for a given date
 */
export function generateTimeSlots(
  bookings: Booking[],
  date: string,
  packageType: 'preschool' | 'classic' | 'halfday',
  customerEmail?: string,
  customerAddress?: string
): string[] {
  const slots: string[] = [];

  // If there's a half-day booking or we're trying to book a half-day on a busy day, return empty
  if (hasHalfDayBooking(bookings, date)) {
    return slots;
  }

  const dateBookings = getBookingsForDate(bookings, date);
  if (packageType === 'halfday' && dateBookings.length > 0) {
    return slots;
  }

  // Generate time slots from 8 AM to 4 PM
  for (let hour = BOOKING_RULES.operatingHours.start; hour <= BOOKING_RULES.operatingHours.end; hour++) {
    const timeSlot = formatTimeSlot(hour);
    const { available } = isTimeSlotAvailable(bookings, date, timeSlot, packageType, customerEmail, customerAddress);

    if (available) {
      slots.push(timeSlot);
    }
  }

  return slots;
}

/**
 * Format hour to time slot string (e.g., 9 -> "09:00 AM")
 */
export function formatTimeSlot(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
}

/**
 * Validate booking form data
 */
export function validateBookingForm(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  timeSlot: string;
  packageType: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.phone || !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
    errors.push('Valid phone number is required');
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push('Address must be at least 5 characters');
  }

  if (!data.date) {
    errors.push('Date is required');
  }

  if (!data.timeSlot) {
    errors.push('Time slot is required');
  }

  if (!['preschool', 'classic', 'halfday'].includes(data.packageType)) {
    errors.push('Invalid package type');
  }

  return { valid: errors.length === 0, errors };
}
