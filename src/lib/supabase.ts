import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  school_organization?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  interest_type: 'science_topic' | 'resource_type' | 'methodology';
  interest_value: string;
  created_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_date: string;
  booking_time: string;
  package_type: string;
  number_of_students?: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}
