import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Use service role key for server-side operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

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
    console.log('=== GENERATE PAYMENT LINK API CALLED ===');

    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    console.log('Fetching booking:', booking_id);

    // Fetch booking details from database
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (fetchError) {
      console.error('Error fetching booking:', fetchError);
      return res.status(500).json({
        error: 'Failed to fetch booking',
        details: fetchError.message
      });
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Booking found:', booking.booking_number || booking.id);
    console.log('Price:', booking.price);
    console.log('Package:', booking.package_type);

    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not set!');
      return res.status(500).json({
        error: 'Stripe is not configured',
        details: 'Please contact support to enable payment processing'
      });
    }

    // Package names for product description
    const packageNames = {
      preschool: 'Preschool Special (30-45 mins)',
      classic: 'Classic Show (45-60 mins)',
      halfday: 'Half-Day Experience (4 hours)',
    };

    const packageName = packageNames[booking.package_type] || booking.package_type;
    const displayBookingId = booking.booking_number || booking.id;

    console.log('Creating Stripe payment link...');

    // Create Stripe Payment Link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: `Carls Newton - ${packageName}`,
              description: `Science Show for ${booking.organization_name}\nDate: ${booking.date} at ${booking.time_slot}\nBooking: ${displayBookingId}`,
              images: ['https://carlsnewton.com/logo.png'], // Add your logo URL
            },
            unit_amount: Math.round(booking.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://carlsnewton.com'}/booking-success?booking_id=${displayBookingId}`,
        },
      },
      automatic_tax: { enabled: false },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['AE', 'SA', 'KW', 'QA', 'OM', 'BH'],
      },
      phone_number_collection: { enabled: true },
      custom_text: {
        submit: {
          message: `Booking ${displayBookingId} - ${booking.organization_name}`,
        },
      },
      metadata: {
        booking_id: booking.id,
        booking_number: displayBookingId,
        customer_email: booking.email,
        customer_name: booking.customer_name,
        organization: booking.organization_name,
      },
    });

    console.log('✅ Payment link created:', paymentLink.url);

    // Update booking with payment link
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_link: paymentLink.url,
        payment_link_sent_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking with payment link:', updateError);
      // Don't fail the request - we still have the payment link
    } else {
      console.log('✅ Booking updated with payment link');
    }

    return res.status(200).json({
      success: true,
      payment_link: paymentLink.url,
      message: 'Payment link generated successfully',
    });
  } catch (error) {
    console.error('=== FATAL ERROR IN GENERATE-PAYMENT-LINK ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Handle Stripe-specific errors
    if (error.type === 'StripeError') {
      return res.status(400).json({
        error: 'Stripe error',
        details: error.message,
        type: error.type,
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
