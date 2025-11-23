export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  date: Date;
  timeSlot: string;
  packageType: 'preschool' | 'classic' | 'halfday';
  name: string;
  organizationName: string;
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
  booking_number?: string; // CN-001000 format (optional if migration not applied yet)
  title?: string; // Mr/Ms/Dr/Mrs/Prof
  customer_name: string;
  job_position?: string;
  organization_name: string;
  email: string;
  phone: string;
  address: string; // Legacy field - use full_address
  full_address?: string; // Primary address field in database
  address_details?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  package_type: 'preschool' | 'classic' | 'halfday';
  date: string; // ISO date string
  time_slot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  price: number;
  message?: string;
  special_requests?: string;
  payment_link?: string;
  payment_link_sent_at?: string;
  payment_intent_id?: string;
  paid_at?: string;
  payment_failure_reason?: string;
  admin_notes?: string;
  internal_notes?: string;
  rejected_reason?: string;
  confirmed_at?: string;
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
