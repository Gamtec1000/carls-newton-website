import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const resend = new Resend(process.env.RESEND_API_KEY || '');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, PUT, OPTIONS');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST/PATCH/PUT
  if (req.method !== 'POST' && req.method !== 'PATCH' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const updateData = req.body;

    if (!updateData.booking_id && !updateData.id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const bookingId = updateData.booking_id || updateData.id;

    // Build update object
    const updates = {};
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
      .eq('id', bookingId)
      .select() // Select all columns to work before and after migration
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

    // Send confirmation email when status changes to 'confirmed'
    if (updateData.status === 'confirmed') {
      try {
        // Use booking_number for display, fallback to id if not generated yet
        const displayBookingId = booking.booking_number || booking.id;

        const packageNames = {
          preschool: 'Preschool Special (30-45 mins)',
          classic: 'Classic Show (45-60 mins)',
          halfday: 'Half-Day Experience (4 hours)',
        };

        const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        console.log('Sending confirmation email for booking:', displayBookingId);

        await resend.emails.send({
          from: 'Carls Newton Bookings <bookings@resend.dev>',
          to: booking.email,
          subject: '🎊 CONFIRMED! Your Science Adventure Awaits!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #10b981;">🎊 IT'S OFFICIAL! Your Science Show is CONFIRMED!</h1>

              <p style="font-size: 16px; line-height: 1.6;">
                Dear ${booking.customer_name},
              </p>

              <p style="font-size: 16px; line-height: 1.6;">
                <strong>Fantastic news!</strong> Your booking is now 100% confirmed! 🎉
                We're counting down the days until we can blow minds with amazing science experiments!
              </p>

              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="margin-top: 0; color: white;">✅ CONFIRMED DETAILS</h2>
                <p style="margin: 8px 0;"><strong>Booking Number:</strong> ${displayBookingId}</p>
                <p style="margin: 8px 0;"><strong>Organization:</strong> ${booking.organization_name}</p>
                <p style="margin: 8px 0;"><strong>Experience:</strong> ${packageNames[booking.package_type]}</p>
                <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="margin: 8px 0;"><strong>Time:</strong> ${booking.time_slot}</p>
                <p style="margin: 8px 0;"><strong>Location:</strong> ${booking.full_address || booking.address}</p>
                <p style="margin: 8px 0;"><strong>Price:</strong> AED ${booking.price?.toLocaleString()}</p>
              </div>

              <!-- WHATSAPP BUTTON -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/971543771243?text=Hi%20Carls%20Newton!%20My%20booking%20is%20confirmed!%20Booking%20%23${displayBookingId}.%20I%20have%20a%20question!"
                   style="display: inline-block; background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
                  💬 Chat with us on WhatsApp
                </a>
                <p style="margin-top: 10px; font-size: 14px; color: #666;">
                  Need to discuss details? Message us anytime!
                </p>
              </div>

              <h3 style="color: #10b981;">🎯 Next Steps</h3>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 5px 0;"><strong>✓ Payment:</strong> ${booking.payment_status === 'paid' ? 'All paid - you\'re all set! 💰✓' : 'Please complete payment as discussed with our team'}</p>
                <p style="margin: 5px 0;"><strong>✓ Preparation:</strong> We'll arrive 30 minutes early to set up the science lab!</p>
                <p style="margin: 5px 0;"><strong>✓ Space Requirements:</strong> Make sure there's room for experiments and power outlets nearby</p>
              </div>

              <h3 style="color: #10b981;">🔬 What to Expect - The Science Magic!</h3>
              <p style="font-size: 16px; line-height: 1.6;">
                Get ready for an unforgettable experience! Your students will experience:
              </p>
              <ul style="font-size: 16px; line-height: 1.8;">
                <li>🌟 <strong>Interactive demonstrations</strong> that make science come alive</li>
                <li>🧪 <strong>Hands-on experiments</strong> where students become scientists</li>
                <li>📚 <strong>Educational content</strong> aligned with curriculum standards</li>
                <li>🎭 <strong>Engaging activities</strong> that spark curiosity and wonder</li>
                <li>🤯 <strong>Mind-blowing moments</strong> that students will talk about for weeks!</li>
              </ul>

              <p style="font-size: 16px; line-height: 1.6; background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <strong>💡 Pro Tip:</strong> Have your camera ready! You'll want to capture those priceless "WOW!" faces when we do the big experiments! 📸
              </p>

              <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Questions? Last-minute changes? Just want to chat about science? We're here for you!
              </p>

              <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 10px;">
                <p style="font-size: 16px; margin: 5px 0;">📧 <strong>Email:</strong> carls.newton10@gmail.com</p>
                <p style="font-size: 16px; margin: 5px 0;">💬 <strong>WhatsApp:</strong> +971 54 377 1243</p>
                <p style="font-size: 16px; margin: 5px 0;">📞 <strong>Phone:</strong> ${booking.phone}</p>
              </div>

              <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;" />

              <p style="color: #10b981; font-weight: bold; font-size: 18px; text-align: center; margin-top: 20px;">
                We can't wait to meet you and your amazing students! 🎉🔬<br/>
                <span style="font-weight: normal; color: #1f2937; font-size: 16px;">The Carls Newton Team</span><br/>
                <span style="font-weight: normal; color: #6b7280; font-size: 14px;">Where Science Meets Imagination!</span><br/>
                <span style="font-weight: normal; color: #6b7280; font-size: 12px;">Booking #${displayBookingId}</span>
              </p>
            </div>
          `,
        });

        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the update if email fails
      }
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
