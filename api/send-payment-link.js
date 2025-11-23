import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Use service role key for server-side operations
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== SEND PAYMENT LINK API CALLED ===');

    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Fetch booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Booking:', booking.booking_number || booking.id);

    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const packageNames = {
      preschool: 'Preschool Special (30-45 mins)',
      classic: 'Classic Show (45-60 mins)',
      halfday: 'Half-Day Experience (4 hours)',
    };

    const packageName = packageNames[booking.package_type] || booking.package_type;
    const displayBookingId = booking.booking_number || booking.id;

    // Generate Stripe Payment Link if not exists
    let paymentLink = booking.payment_link;

    if (!paymentLink) {
      console.log('Generating new Stripe payment link...');

      const stripeLink = await stripe.paymentLinks.create({
        line_items: [{
          price_data: {
            currency: 'aed',
            product_data: {
              name: `Carls Newton - ${packageName}`,
              description: `Science Show for ${booking.organization_name}\nDate: ${booking.date} at ${booking.time_slot}\nBooking: ${displayBookingId}`,
            },
            unit_amount: Math.round(booking.price * 100),
          },
          quantity: 1,
        }],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${process.env.APP_URL || 'https://carlsnewton.com'}/booking-success?booking_id=${displayBookingId}`,
          },
        },
        automatic_tax: { enabled: false },
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['AE', 'SA', 'KW', 'QA', 'OM', 'BH'],
        },
        phone_number_collection: { enabled: true },
        metadata: {
          booking_id: booking.id,
          booking_number: displayBookingId,
          customer_email: booking.email,
        },
      });

      paymentLink = stripeLink.url;

      // Update booking with payment link
      await supabase
        .from('bookings')
        .update({
          payment_link: paymentLink,
          payment_link_sent_at: new Date().toISOString(),
        })
        .eq('id', booking.id);

      console.log('✅ Payment link generated and saved');
    } else {
      console.log('Using existing payment link');
    }

    // Format date
    const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send payment link email
    console.log('Sending payment link email to:', booking.email);

    await resend.emails.send({
      from: 'Carls Newton Bookings <bookings@carlsnewton.com>',
      to: booking.email,
      subject: '💳 Complete Your Payment - Carls Newton Booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 20px;">
          <h1 style="background: linear-gradient(135deg, #d946ef 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; margin-bottom: 20px;">
            💳 Complete Your Payment
          </h1>

          <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">
            Dear ${booking.title || ''} ${booking.customer_name},
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">
            Your booking is confirmed! To secure your slot, please complete the payment using the secure link below.
          </p>

          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #d946ef;">
            <h2 style="color: #06b6d4; margin-top: 0;">📅 Booking Details</h2>
            <p style="margin: 8px 0; color: #e0e0e0;"><strong>Booking #:</strong> ${displayBookingId}</p>
            <p style="margin: 8px 0; color: #e0e0e0;"><strong>Organization:</strong> ${booking.organization_name}</p>
            <p style="margin: 8px 0; color: #e0e0e0;"><strong>Package:</strong> ${packageName}</p>
            <p style="margin: 8px 0; color: #e0e0e0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0; color: #e0e0e0;"><strong>Time:</strong> ${booking.time_slot}</p>
            <p style="margin: 8px 0; color: #22c55e; font-size: 20px; font-weight: bold;">
              <strong>Amount:</strong> AED ${booking.price?.toLocaleString()}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentLink}"
               style="display: inline-block;
                      background: linear-gradient(135deg, #d946ef 0%, #06b6d4 100%);
                      color: white;
                      padding: 18px 40px;
                      text-decoration: none;
                      border-radius: 50px;
                      font-weight: bold;
                      font-size: 18px;
                      box-shadow: 0 4px 15px rgba(217, 70, 239, 0.4);">
              💳 Pay AED ${booking.price?.toLocaleString()} Now
            </a>
          </div>

          <p style="text-align: center; font-size: 14px; color: #9ca3af; margin-top: 15px;">
            🔒 Secure payment powered by Stripe
          </p>

          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <p style="font-size: 14px; color: #9ca3af; margin: 5px 0;">
              Questions? Contact us anytime:
            </p>
            <p style="font-size: 14px; color: #06b6d4; margin: 5px 0;">
              📧 carls.newton10@gmail.com<br>
              💬 WhatsApp: +971 54 377 1243
            </p>
          </div>
        </div>
      `,
    });

    console.log('✅ Payment link email sent successfully');

    return res.status(200).json({
      success: true,
      payment_link: paymentLink,
      message: 'Payment link email sent successfully',
    });
  } catch (error) {
    console.error('=== ERROR IN SEND-PAYMENT-LINK ===');
    console.error('Error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
