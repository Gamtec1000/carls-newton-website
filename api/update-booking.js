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

    // Send confirmation email when status changes to 'confirmed'
    if (updateData.status === 'confirmed') {
      try {
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

        await resend.emails.send({
          from: 'Carls Newton Bookings <bookings@resend.dev>',
          to: booking.email,
          subject: 'Booking Confirmed - Carls Newton Science Shows',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981;">Booking Confirmed!</h2>
              <p>Dear ${booking.customer_name},</p>
              <p>Great news! Your booking has been confirmed. We're excited to bring science to life for your students!</p>

              <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="margin-top: 0; color: #065f46;">Confirmed Booking Details</h3>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Organization/School:</strong> ${booking.organization_name}</p>
                <p><strong>Package:</strong> ${packageNames[booking.package_type]}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${booking.time_slot}</p>
                <p><strong>Location:</strong> ${booking.full_address || booking.address}</p>
                <p><strong>Price:</strong> AED ${booking.price?.toLocaleString()}</p>
              </div>

              <h3 style="color: #1f2937;">Next Steps</h3>
              <ol>
                <li><strong>Payment:</strong> ${booking.payment_status === 'paid' ? 'Payment received - Thank you!' : 'Please arrange payment as discussed'}</li>
                <li><strong>Preparation:</strong> We'll arrive 30 minutes before the show to set up</li>
                <li><strong>Requirements:</strong> Please ensure there's adequate space and power outlets</li>
              </ol>

              <h3 style="color: #1f2937;">What to Expect</h3>
              <p>Our science show will include:</p>
              <ul>
                <li>Interactive demonstrations</li>
                <li>Hands-on experiments</li>
                <li>Educational content aligned with curriculum</li>
                <li>Engaging activities for all students</li>
              </ul>

              <p style="margin-top: 30px;">If you have any questions or need to make changes, please contact us:</p>
              <p>
                <strong>Email:</strong> carls.newton10@gmail.com<br/>
                <strong>Phone:</strong> ${booking.phone}
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

              <p style="color: #10b981; font-weight: bold; margin-top: 20px;">
                We look forward to seeing you soon!<br/>
                <span style="font-weight: normal; color: #1f2937;">Carls Newton Science Shows</span>
              </p>
            </div>
          `,
        });
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
