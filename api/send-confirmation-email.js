import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    const { email, confirmationUrl } = req.body;

    if (!email || !confirmationUrl) {
      return res.status(400).json({ error: 'Email and confirmation URL are required' });
    }

    console.log('Sending confirmation email to:', email);
    console.log('Confirmation URL:', confirmationUrl);

    // Read the HTML template
    let htmlTemplate;
    try {
      htmlTemplate = readFileSync(
        join(process.cwd(), 'supabase-email-templates', 'email-confirm-signup.html'),
        'utf-8'
      );
    } catch (fileError) {
      console.error('Error reading email template:', fileError);
      // Fallback to inline HTML if template file cannot be read
      htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Carls Newton!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 0;">
                <div style="background: linear-gradient(135deg, #d946ef 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    🚀 Welcome to Carls Newton!
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                    Where Science Meets Imagination
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                  Let's Confirm Your Email! ✨
                </h2>
                <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                  We're thrilled to have you join the Carls Newton community! To get started with booking amazing science experiences,
                  we just need to verify your email address.
                </p>
                <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Click the button below to confirm your email and activate your account:
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                  <tr>
                    <td style="border-radius: 50px; background: linear-gradient(135deg, #d946ef 0%, #a855f7 100%); box-shadow: 0 4px 15px rgba(217, 70, 239, 0.4);">
                      <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 18px; border-radius: 50px;">
                        ✅ Confirm Email Address
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                  Button not working? Copy and paste this link into your browser:
                </p>
                <p style="margin: 10px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px; word-break: break-all; font-size: 12px; color: #4b5563; text-align: center;">
                  {{ .ConfirmationURL }}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; background-color: #1a1a2e; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 16px; font-weight: 600;">
                  Questions? We're here to help!
                </p>
                <p style="margin: 0 0 10px 0;">
                  <a href="mailto:hello@carlsnewton.com" style="color: #06b6d4; text-decoration: none; font-size: 14px;">
                    📧 hello@carlsnewton.com
                  </a>
                </p>
                <p style="margin: 0 0 20px 0;">
                  <a href="https://wa.me/971543771243" style="color: #25D366; text-decoration: none; font-size: 14px;">
                    💬 WhatsApp: +971 54 377 1243
                  </a>
                </p>
                <div style="margin: 20px 0; height: 1px; background: rgba(255,255,255,0.1);"></div>
                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
                  Carls Newton - Science Education Services<br>
                  Making Science Fun and Accessible for Everyone 🧪🔬
                </p>
                <p style="margin: 15px 0 0 0; color: #4b5563; font-size: 11px;">
                  This email was sent to {{ .Email }}. If you didn't create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    }

    // Replace template variables
    const html = htmlTemplate
      .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, confirmationUrl)
      .replace(/\{\{\s*\.Email\s*\}\}/g, email);

    // Send confirmation email
    const emailData = {
      from: 'Carls Newton <bookings@resend.dev>',
      to: email,
      subject: 'Welcome to Carls Newton - Confirm Your Email',
      html: html,
    };

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }

    console.log('Confirmation email sent successfully:', data);
    return res.status(200).json({ success: true, emailId: data?.id });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
