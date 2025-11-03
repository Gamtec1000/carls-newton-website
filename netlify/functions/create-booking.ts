import { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const resend = new Resend(process.env.RESEND_API_KEY || '');

interface BookingRequest {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  package_type: 'preschool' | 'classic' | 'halfday';
  date: string;
  time_slot: string;
  message?: string;
}

const PACKAGE_PRICES: Record<string, number> = {
  preschool: 1200,
  classic: 1800,
  halfday: 2500,
};

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const bookingData: BookingRequest = JSON.parse(event.body || '{}');

    // Validate required fields
    if (
      !bookingData.customer_name ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.address ||
      !bookingData.package_type ||
      !bookingData.date ||
      !bookingData.time_slot
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Get price for package
    const price = PACKAGE_PRICES[bookingData.package_type];

    // Create booking in Supabase
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert([
        {
          customer_name: bookingData.customer_name,
          email: bookingData.email,
          phone: bookingData.phone,
          address: bookingData.address,
          package_type: bookingData.package_type,
          date: bookingData.date,
          time_slot: bookingData.time_slot,
          status: 'pending',
          payment_status: 'pending',
          price: price,
          message: bookingData.message || null,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create booking', details: dbError.message }),
      };
    }

    // Send email notification via Resend
    try {
      const packageNames: Record<string, string> = {
        preschool: 'Preschool Special (30-45 mins)',
        classic: 'Classic Show (45-60 mins)',
        halfday: 'Half-Day Experience (4 hours)',
      };

      await resend.emails.send({
        from: 'Carls Newton Bookings <bookings@resend.dev>',
        to: 'carls.newton10@gmail.com',
        subject: `New Booking Request - ${bookingData.customer_name}`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <hr />
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${bookingData.customer_name}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Phone:</strong> ${bookingData.phone}</p>
          <p><strong>Address:</strong> ${bookingData.address}</p>
          <hr />
          <h3>Booking Details</h3>
          <p><strong>Package:</strong> ${packageNames[bookingData.package_type]}</p>
          <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</p>
          <p><strong>Time:</strong> ${bookingData.time_slot}</p>
          <p><strong>Price:</strong> AED ${price.toLocaleString()}</p>
          ${bookingData.message ? `<p><strong>Message:</strong> ${bookingData.message}</p>` : ''}
          <hr />
          <p><strong>Status:</strong> Pending Confirmation</p>
          <p><strong>Payment Status:</strong> Pending</p>
          <p style="margin-top: 20px; color: #666;">
            Please confirm this booking and update the payment status in the admin panel.
          </p>
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the booking if email fails
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        booking: booking,
        message: 'Booking created successfully',
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
