import { createClient } from '@supabase/supabase-js';

// Support both VITE_ (local development) and NEXT_PUBLIC_ (Vercel deployment) prefixes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                     import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                         import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (for local) or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (for production) in your environment variables');
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
