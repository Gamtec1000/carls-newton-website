export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  date: Date;
  timeSlot: string;
  packageType: 'preschool' | 'classic' | 'halfday';
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  message?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isAvailable: boolean;
  bookingCount?: number;
}

// Database booking interface
export interface Booking {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  package_type: 'preschool' | 'classic' | 'halfday';
  date: string; // ISO date string
  time_slot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  price: number;
  message?: string;
  created_at: string;
}

export interface PackageInfo {
  id: 'preschool' | 'classic' | 'halfday';
  name: string;
  duration: string;
  price: number;
  description: string;
}

export const PACKAGES: PackageInfo[] = [
  {
    id: 'preschool',
    name: 'Preschool Special',
    duration: '30-45 mins',
    price: 1200,
    description: 'Perfect for young learners with interactive science demonstrations'
  },
  {
    id: 'classic',
    name: 'Classic Show',
    duration: '45-60 mins',
    price: 1800,
    description: 'Engaging science show with hands-on experiments'
  },
  {
    id: 'halfday',
    name: 'Half-Day Experience',
    duration: '4 hours',
    price: 2500,
    description: 'Comprehensive science adventure with multiple activities'
  }
];
