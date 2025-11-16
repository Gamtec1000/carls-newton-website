import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, full_name, phone, school_organization, job_position } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({ error: 'Email and full name are required' });
    }

    // Send confirmation email
    const emailData = {
      from: 'Carls Newton <bookings@resend.dev>',
      to: email,
      subject: 'Profile Updated - Carls Newton',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #06B6D4, #A855F7);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: bold;
              color: #6366f1;
              min-width: 150px;
            }
            .info-value {
              color: #4b5563;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .alert-box {
              background: #fef3c7;
              border: 2px solid #fbbf24;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #92400e;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(135deg, #06B6D4, #A855F7);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Profile Updated</h1>
          </div>
          <div class="content">
            <p>Hi ${full_name.split(' ')[0]},</p>
            <p>Your profile information has been successfully updated on Carls Newton.</p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #6366f1;">Updated Information</h3>
              <div class="info-row">
                <div class="info-label">Full Name:</div>
                <div class="info-value">${full_name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${email}</div>
              </div>
              ${phone ? `
              <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${phone}</div>
              </div>
              ` : ''}
              ${school_organization ? `
              <div class="info-row">
                <div class="info-label">Organization:</div>
                <div class="info-value">${school_organization}</div>
              </div>
              ` : ''}
              ${job_position ? `
              <div class="info-row">
                <div class="info-label">Job Position:</div>
                <div class="info-value">${job_position}</div>
              </div>
              ` : ''}
              <div class="info-row">
                <div class="info-label">Updated:</div>
                <div class="info-value">${new Date().toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}</div>
              </div>
            </div>

            <div class="alert-box">
              <strong>🔒 Security Notice:</strong> If you did not make this change, please contact us immediately at hello@carlsnewton.com
            </div>

            <p>This updated information will be used for all future bookings and communications.</p>

            <center>
              <a href="https://carlsnewton.com/my-bookings" class="button">View My Bookings</a>
            </center>

            <div class="footer">
              <p><strong>Carls Newton - Science Shows</strong></p>
              <p>Bringing amazing science to schools across the UAE!</p>
              <p>Contact us: <a href="mailto:hello@carlsnewton.com">hello@carlsnewton.com</a></p>
              <p style="font-size: 12px; color: #9ca3af;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }

    console.log('Profile update email sent successfully:', data);
    return res.status(200).json({ success: true, emailId: data?.id });
  } catch (error) {
    console.error('Error sending profile update email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
