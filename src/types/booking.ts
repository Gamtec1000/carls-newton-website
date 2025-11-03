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
  message?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isAvailable: boolean;
}
