import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const resend = new Resend(process.env.RESEND_API_KEY || '');

const PACKAGE_PRICES = {
  preschool: 1200,
  classic: 1800,
  halfday: 2500,
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== CREATE BOOKING API CALLED ===');
    console.log('Received booking data:', JSON.stringify(req.body, null, 2));

    const bookingData = req.body;

    // Validate required fields
    const address = bookingData.full_address || bookingData.address;

    const required = {
      customer_name: bookingData.customer_name,
      organization_name: bookingData.organization_name,
      email: bookingData.email,
      phone: bookingData.phone,
      address: address,
      package_type: bookingData.package_type,
      date: bookingData.date,
      time_slot: bookingData.time_slot,
    };

    const missing = Object.keys(required).filter(key => !required[key]);

    if (missing.length > 0) {
      console.error('Missing required fields:', missing);
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missing
      });
    }

    // Get price for package
    const price = PACKAGE_PRICES[bookingData.package_type] || bookingData.price;

    if (!price) {
      console.error('Invalid package type or missing price:', bookingData.package_type);
      return res.status(400).json({ error: 'Invalid package type or missing price' });
    }

    // Check environment variables
    console.log('Checking environment variables...');
    console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('Supabase URL length:', process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0);
    console.log('Supabase Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0);

    // Prepare insert data
    const insertData = {
      customer_name: bookingData.customer_name,
      organization_name: bookingData.organization_name,
      email: bookingData.email,
      phone: bookingData.phone,
      address: address,
      address_details: bookingData.address_details || null,
      city: bookingData.city || null,
      latitude: bookingData.latitude || null,
      longitude: bookingData.longitude || null,
      package_type: bookingData.package_type,
      date: bookingData.date,
      time_slot: bookingData.time_slot,
      status: 'pending',
      payment_status: 'pending',
      price: price,
      message: bookingData.message || bookingData.special_requests || null,
      special_requests: bookingData.special_requests || bookingData.message || null,
    };

    console.log('Creating booking in Supabase...');
    console.log('Attempting to insert data:', JSON.stringify(insertData, null, 2));

    // Create booking in Supabase
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert([insertData])
      .select()
      .single();

    if (dbError) {
      console.error('=== SUPABASE INSERT FAILED ===');
      console.error('Error object:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);
      console.error('Error details:', dbError.details);
      console.error('Error hint:', dbError.hint);
      console.error('Full error JSON:', JSON.stringify(dbError, null, 2));

      return res.status(500).json({
        error: 'Failed to create booking in database',
        supabaseError: dbError.message,
        code: dbError.code,
        details: dbError.details,
        hint: dbError.hint,
        insertData: insertData // Include what we tried to insert for debugging
      });
    }

    console.log('Booking created successfully:', booking.id);

    // Send email notifications via Resend
    try {
      const packageNames = {
        preschool: 'Preschool Special (30-45 mins)',
        classic: 'Classic Show (45-60 mins)',
        halfday: 'Half-Day Experience (4 hours)',
      };

      const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Send admin notification email
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
          <p><strong>Organization/School:</strong> ${bookingData.organization_name}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Phone:</strong> ${bookingData.phone}</p>
          <p><strong>Address:</strong> ${address}</p>
          ${bookingData.address_details ? `<p><strong>Address Details:</strong> ${bookingData.address_details}</p>` : ''}
          ${bookingData.city ? `<p><strong>City:</strong> ${bookingData.city}</p>` : ''}
          ${bookingData.latitude && bookingData.longitude ? `<p><strong>Location:</strong> <a href="https://www.google.com/maps?q=${bookingData.latitude},${bookingData.longitude}" target="_blank">View on Map</a></p>` : ''}
          <hr />
          <h3>Booking Details</h3>
          <p><strong>Package:</strong> ${packageNames[bookingData.package_type]}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${bookingData.time_slot}</p>
          <p><strong>Price:</strong> AED ${price.toLocaleString()}</p>
          ${(bookingData.special_requests || bookingData.message) ? `<p><strong>Special Requests:</strong> ${bookingData.special_requests || bookingData.message}</p>` : ''}
          <hr />
          <p><strong>Status:</strong> Pending Confirmation</p>
          <p><strong>Payment Status:</strong> Pending</p>
          <p style="margin-top: 20px; color: #666;">
            Please confirm this booking and update the payment status in the admin panel.
          </p>
        `,
      });

      // Send customer confirmation email
      await resend.emails.send({
        from: 'Carls Newton Bookings <bookings@resend.dev>',
        to: bookingData.email,
        subject: 'Booking Request Received - Carls Newton Science Shows',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Booking Request Received</h2>
            <p>Dear ${bookingData.customer_name},</p>
            <p>Thank you for your interest in Carls Newton Science Shows! We have received your booking request and will review it shortly.</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.id}</p>
              <p><strong>Organization/School:</strong> ${bookingData.organization_name}</p>
              <p><strong>Package:</strong> ${packageNames[bookingData.package_type]}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${bookingData.time_slot}</p>
              <p><strong>Location:</strong> ${address}</p>
              <p><strong>Price:</strong> AED ${price.toLocaleString()}</p>
            </div>

            <h3 style="color: #1f2937;">What's Next?</h3>
            <ol>
              <li>We will review your booking request within 24 hours</li>
              <li>You'll receive a confirmation email once your booking is approved</li>
              <li>Payment instructions will be provided in the confirmation email</li>
            </ol>

            <p style="margin-top: 30px;">If you have any questions, please contact us at:</p>
            <p>
              <strong>Email:</strong> carls.newton10@gmail.com<br/>
              <strong>Phone:</strong> ${bookingData.phone}
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

            <p style="color: #6b7280; font-size: 14px;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>

            <p style="color: #2563eb; font-weight: bold; margin-top: 20px;">
              Carls Newton Science Shows<br/>
              <span style="font-weight: normal; font-size: 14px;">Making Science Fun for Young Minds!</span>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending error (non-fatal):', emailError);
      console.error('Email error details:', emailError.message);
      // Don't fail the booking if email fails
    }

    console.log('Booking process completed successfully');

    return res.status(201).json({
      success: true,
      bookingId: booking.id,
      booking: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('=== FATAL ERROR IN CREATE-BOOKING ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, null, 2));

    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
