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

export const config = {
  api: {
    bodyParser: false, // Disable body parsing so we can verify webhook signature
  },
};

// Helper to read raw body
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  console.log('=== STRIPE WEBHOOK RECEIVED ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the raw body for signature verification
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('❌ No Stripe signature found in headers');
    return res.status(400).json({ error: 'No Stripe signature' });
  }

  let event;

  try {
    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not set!');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log('✅ Webhook signature verified');
    console.log('Event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Processing checkout.session.completed event');
        const session = event.data.object;

        // Get booking ID from metadata
        const bookingId = session.metadata?.booking_id;

        if (!bookingId) {
          console.warn('⚠️ No booking_id in session metadata');
          return res.status(200).json({ received: true, warning: 'No booking_id in metadata' });
        }

        console.log('Updating booking:', bookingId);
        console.log('Payment status: paid');
        console.log('Payment intent:', session.payment_intent);

        // Update booking payment status
        const { data: booking, error: updateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            payment_intent_id: session.payment_intent,
            paid_at: new Date().toISOString(),
            status: 'confirmed', // Auto-confirm booking when paid
          })
          .eq('id', bookingId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating booking:', updateError);
          return res.status(500).json({ error: 'Failed to update booking', details: updateError.message });
        }

        console.log('✅ Booking updated successfully:', booking.booking_number || booking.id);
        console.log('Payment status:', booking.payment_status);
        console.log('Booking status:', booking.status);

        break;
      }

      case 'payment_intent.succeeded': {
        console.log('Processing payment_intent.succeeded event');
        const paymentIntent = event.data.object;

        // Get booking ID from metadata
        const bookingId = paymentIntent.metadata?.booking_id;

        if (!bookingId) {
          console.warn('⚠️ No booking_id in payment intent metadata');
          return res.status(200).json({ received: true, warning: 'No booking_id in metadata' });
        }

        console.log('Updating booking:', bookingId);
        console.log('Payment amount:', paymentIntent.amount / 100, paymentIntent.currency.toUpperCase());

        // Update booking payment status
        const { data: booking, error: updateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            payment_intent_id: paymentIntent.id,
            paid_at: new Date().toISOString(),
            status: 'confirmed', // Auto-confirm booking when paid
          })
          .eq('id', bookingId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating booking:', updateError);
          return res.status(500).json({ error: 'Failed to update booking', details: updateError.message });
        }

        console.log('✅ Booking updated successfully:', booking.booking_number || booking.id);

        break;
      }

      case 'payment_intent.payment_failed': {
        console.log('Processing payment_intent.payment_failed event');
        const paymentIntent = event.data.object;

        const bookingId = paymentIntent.metadata?.booking_id;

        if (bookingId) {
          console.log('Payment failed for booking:', bookingId);

          // Optionally update booking with payment failure
          await supabase
            .from('bookings')
            .update({
              payment_status: 'failed',
              payment_failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
            })
            .eq('id', bookingId);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true, event_type: event.type });
  } catch (error) {
    console.error('=== ERROR PROCESSING WEBHOOK ===');
    console.error('Error:', error);
    return res.status(500).json({ error: 'Webhook handler failed', details: error.message });
  }
}
