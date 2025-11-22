import { Booking } from '../types/booking';

/**
 * Stripe Payment Link Configuration
 * Replace these with your actual Stripe payment links
 */
export const STRIPE_PAYMENT_LINKS = {
  preschool: 'https://buy.stripe.com/bJe8wObb06McgzD2HO3F603',
  classic: 'https://buy.stripe.com/4gM6oG3IygmM97bbek3F602',
  halfday: 'https://buy.stripe.com/4gM6oG3IygmM97bbek3F602',
};

/**
 * Package pricing configuration
 */
export const PACKAGE_PRICES = {
  preschool: 1200,
  classic: 1800,
  halfday: 3500,
};

/**
 * Package display names
 */
export const PACKAGE_NAMES: Record<string, string> = {
  preschool: 'Preschool Special (30-45 mins)',
  classic: 'Classic Show (45-60 mins)',
  halfday: 'Half-Day Experience (4 hours)',
};

/**
 * Booking status display configuration
 */
export const STATUS_CONFIG = {
  pending: {
    color: '#F59E0B',
    label: 'Pending',
    icon: '⏳',
  },
  confirmed: {
    color: '#22C55E',
    label: 'Confirmed',
    icon: '✅',
  },
  rejected: {
    color: '#EF4444',
    label: 'Rejected',
    icon: '❌',
  },
  completed: {
    color: '#06B6D4',
    label: 'Completed',
    icon: '✔️',
  },
};

/**
 * Payment status display configuration
 */
export const PAYMENT_STATUS_CONFIG = {
  paid: {
    color: '#22C55E',
    label: 'Paid',
    icon: '💰',
  },
  pending: {
    color: '#F59E0B',
    label: 'Pending',
    icon: '⏳',
  },
  refunded: {
    color: '#6B7280',
    label: 'Refunded',
    icon: '↩️',
  },
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get payment link for package type
 */
export const getPaymentLinkForPackage = (packageType: string): string => {
  return STRIPE_PAYMENT_LINKS[packageType as keyof typeof STRIPE_PAYMENT_LINKS] || '';
};

/**
 * Generate Google Calendar link for a booking
 */
export const generateGoogleCalendarLink = (booking: Booking): string => {
  const title = encodeURIComponent(`Carls Newton Show - ${booking.organization_name}`);
  const details = encodeURIComponent(
    `Package: ${PACKAGE_NAMES[booking.package_type] || booking.package_type}\n` +
    `Customer: ${booking.customer_name}\n` +
    `Email: ${booking.email}\n` +
    `Phone: ${booking.phone}\n` +
    `Students: ${booking.number_of_students}\n` +
    `Price: AED ${booking.price?.toLocaleString()}\n` +
    `Status: ${booking.status}\n` +
    `Booking ID: ${booking.booking_number || booking.id}\n\n` +
    (booking.special_requests ? `Special Requests: ${booking.special_requests}\n` : '') +
    (booking.admin_notes ? `Admin Notes: ${booking.admin_notes}` : '')
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

/**
 * Calculate booking statistics
 */
export const calculateBookingStats = (bookings: Booking[]) => {
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const rejected = bookings.filter(b => b.status === 'rejected').length;
  const completed = bookings.filter(b => b.status === 'completed').length;

  const totalRevenue = bookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const pendingRevenue = bookings
    .filter(b => b.status === 'confirmed' && b.payment_status === 'pending')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return {
    total,
    pending,
    confirmed,
    rejected,
    completed,
    totalRevenue,
    pendingRevenue,
  };
};

/**
 * Filter bookings by date range
 */
export const filterBookingsByDateRange = (
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): Booking[] => {
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= startDate && bookingDate <= endDate;
  });
};

/**
 * Get bookings for a specific month
 */
export const getBookingsForMonth = (
  bookings: Booking[],
  month: number,
  year: number
): Booking[] => {
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
  });
};

/**
 * Sort bookings by date (newest first or oldest first)
 */
export const sortBookingsByDate = (
  bookings: Booking[],
  order: 'asc' | 'desc' = 'desc'
): Booking[] => {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Search bookings by keyword (searches in customer name, email, organization)
 */
export const searchBookings = (bookings: Booking[], keyword: string): Booking[] => {
  const lowerKeyword = keyword.toLowerCase();
  return bookings.filter(booking =>
    booking.customer_name.toLowerCase().includes(lowerKeyword) ||
    booking.email.toLowerCase().includes(lowerKeyword) ||
    booking.organization_name.toLowerCase().includes(lowerKeyword) ||
    booking.phone.includes(keyword) ||
    (booking.booking_number && booking.booking_number.includes(keyword))
  );
};

/**
 * Export bookings to CSV
 */
export const exportBookingsToCSV = (bookings: Booking[]): string => {
  const headers = [
    'Booking Number',
    'Date',
    'Time',
    'Customer Name',
    'Email',
    'Phone',
    'Organization',
    'Package',
    'Students',
    'Price',
    'Status',
    'Payment Status',
    'Address',
    'Special Requests',
    'Created At',
  ];

  const rows = bookings.map(booking => [
    booking.booking_number || booking.id,
    booking.date,
    booking.time_slot,
    booking.customer_name,
    booking.email,
    booking.phone,
    booking.organization_name,
    PACKAGE_NAMES[booking.package_type] || booking.package_type,
    booking.number_of_students,
    booking.price,
    booking.status,
    booking.payment_status,
    booking.full_address || booking.address,
    booking.special_requests || '',
    booking.created_at ? new Date(booking.created_at).toISOString() : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Check if user has admin permissions
 */
export const checkAdminPermission = async (
  supabase: any,
  userId: string
): Promise<'super_admin' | 'admin' | 'viewer' | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.role;
  } catch (error) {
    console.error('Error checking admin permission:', error);
    return null;
  }
};

/**
 * Log booking action to history
 */
export const logBookingAction = async (
  supabase: any,
  bookingId: string,
  userId: string,
  action: string,
  oldStatus?: string,
  newStatus?: string,
  notes?: string
): Promise<void> => {
  try {
    await supabase.from('booking_history').insert({
      booking_id: bookingId,
      changed_by: userId,
      action,
      old_status: oldStatus,
      new_status: newStatus,
      notes,
    });
  } catch (error) {
    console.error('Error logging booking action:', error);
  }
};

/**
 * Get upcoming bookings (next 30 days)
 */
export const getUpcomingBookings = (bookings: Booking[]): Booking[] => {
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= today && bookingDate <= thirtyDaysLater;
  });
};

/**
 * Get overdue bookings (past date, not completed)
 */
export const getOverdueBookings = (bookings: Booking[]): Booking[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate < today && booking.status !== 'completed';
  });
};

/**
 * Validate payment link format
 */
export const isValidPaymentLink = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('stripe.com') || urlObj.hostname.includes('buy.stripe.com');
  } catch {
    return false;
  }
};

/**
 * Format currency (AED)
 */
export const formatCurrency = (amount: number): string => {
  return `AED ${amount.toLocaleString()}`;
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: string): string => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color || '#6B7280';
};

/**
 * Get payment status badge color
 */
export const getPaymentStatusColor = (status: string): string => {
  return PAYMENT_STATUS_CONFIG[status as keyof typeof PAYMENT_STATUS_CONFIG]?.color || '#6B7280';
};

/**
 * Generate WhatsApp link for customer
 */
export const generateWhatsAppLink = (phone: string, bookingNumber: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = encodeURIComponent(
    `Hi! This is regarding booking #${bookingNumber}. `
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
};

/**
 * Check if booking is editable
 */
export const isBookingEditable = (booking: Booking): boolean => {
  return booking.status === 'pending' || booking.status === 'confirmed';
};

/**
 * Check if booking can be confirmed
 */
export const canConfirmBooking = (booking: Booking): boolean => {
  return booking.status === 'pending';
};

/**
 * Check if booking can be rejected
 */
export const canRejectBooking = (booking: Booking): boolean => {
  return booking.status === 'pending';
};

/**
 * Check if booking can be completed
 */
export const canCompleteBooking = (booking: Booking): boolean => {
  return booking.status === 'confirmed';
};
