import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, status, from_date, to_date } = req.query;

    console.log('=== GET BOOKINGS API CALLED ===');
    console.log('Query params:', { date, status, from_date, to_date });

    let query = supabase.from('bookings').select('*');

    // Filter by specific date
    if (date) {
      console.log('Filtering by date:', date);
      query = query.eq('date', date);
    }

    // Filter by date range
    if (from_date) {
      console.log('Filtering from_date:', from_date);
      query = query.gte('date', from_date);
    }
    if (to_date) {
      console.log('Filtering to_date:', to_date);
      query = query.lte('date', to_date);
    }

    // Filter by status
    if (status) {
      console.log('Filtering by status:', status);
      query = query.eq('status', status);
    }

    // Order by date and time
    query = query.order('date', { ascending: true }).order('time_slot', { ascending: true });

    console.log('Executing Supabase query...');
    const { data: bookings, error } = await query;

    if (error) {
      console.error('=== SUPABASE QUERY FAILED ===');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Full error:', JSON.stringify(error, null, 2));

      return res.status(500).json({
        error: 'Failed to fetch bookings',
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    console.log('Query successful. Found', bookings?.length || 0, 'bookings');

    return res.status(200).json({
      success: true,
      bookings: bookings || [],
      count: bookings?.length || 0,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
