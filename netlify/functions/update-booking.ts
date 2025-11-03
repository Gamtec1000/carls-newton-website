import { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

interface UpdateBookingRequest {
  id: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'refunded';
}

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, PATCH, OPTIONS',
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow PUT/PATCH
  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const updateData: UpdateBookingRequest = JSON.parse(event.body || '{}');

    if (!updateData.id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Booking ID is required' }),
      };
    }

    // Build update object
    const updates: any = {};
    if (updateData.status) {
      updates.status = updateData.status;
    }
    if (updateData.payment_status) {
      updates.payment_status = updateData.payment_status;
    }

    if (Object.keys(updates).length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No valid fields to update' }),
      };
    }

    // Update booking in Supabase
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', updateData.id)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update booking', details: dbError.message }),
      };
    }

    if (!booking) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Booking not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        booking: booking,
        message: 'Booking updated successfully',
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
