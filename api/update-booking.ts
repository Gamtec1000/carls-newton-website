import type { VercelRequest, VercelResponse } from '@vercel/node';
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, PATCH, OPTIONS');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow PUT/PATCH
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const updateData: UpdateBookingRequest = req.body;

    if (!updateData.id) {
      return res.status(400).json({ error: 'Booking ID is required' });
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
      return res.status(400).json({ error: 'No valid fields to update' });
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
      return res.status(500).json({
        error: 'Failed to update booking',
        details: dbError.message
      });
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json({
      success: true,
      booking: booking,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
