import nodemailer, { Transporter } from 'nodemailer';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Validates contact form data.
 * @returns An object with error messages, or an empty object if valid.
 */
export function validateContactData(data: Partial<ContactData>) {
  const errors: Record<string, string> = {};
  const { name, email, subject, message } = data;

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.message = 'Message is required';
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  return errors;
}

/**
 * Creates a Nodemailer transporter based on environment variables.
 */
export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Coding With God <hello@demomailtrap.co>';
export const EMAIL_TO = process.env.EMAIL_TO || 'cwgtechnologies@gmail.com';

/**
 * Generates the HTML content for the contact email.
 */
export function getEmailHtml(data: ContactData & { createdAt: string }) {
  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FCFAF7; color: #241416; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(90, 6, 22, 0.05); border: 1px solid rgba(90, 6, 22, 0.08);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #5A0616 0%, #7E1025 100%); padding: 32px; text-align: center;">
          <h1 style="color: #F8F2E6; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">New Contact Submission</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px;">
          <div style="margin-bottom: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4EFEB; width: 100px; vertical-align: top;">
                  <span style="font-weight: 600; color: #5A0616; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Name</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4EFEB; color: #241416; font-size: 15px;">
                  ${data.name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4EFEB; width: 100px; vertical-align: top;">
                  <span style="font-weight: 600; color: #5A0616; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Email</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4EFEB; color: #241416; font-size: 15px;">
                  <a href="mailto:${data.email}" style="color: #5A0616; text-decoration: none; font-weight: 500;">${data.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4EFEB; width: 100px; vertical-align: top;">
                  <span style="font-weight: 600; color: #5A0616; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Subject</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4EFEB; color: #241416; font-size: 15px;">
                  ${data.subject}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; width: 100px; vertical-align: top;">
                  <span style="font-weight: 600; color: #5A0616; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Date</span>
                </td>
                <td style="padding: 12px 0; color: #241416; font-size: 15px;">
                  ${new Date(data.createdAt).toLocaleString()}
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Message -->
          <div style="background-color: #FCFAF7; border-left: 4px solid #5A0616; padding: 24px; border-radius: 4px;">
            <div style="font-weight: 600; color: #5A0616; margin-bottom: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</div>
            <p style="color: #5C4B4E; line-height: 1.6; white-space: pre-wrap; margin: 0; font-size: 15px;">${data.message}</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 32px; text-align: center; border-top: 1px solid #F4EFEB; background-color: #FAF5EB;">
          <p style="margin: 0; color: #8F7E81; font-size: 12px; line-height: 1.5;">
            This message was sent via the <strong>Coding With God</strong> contact form.
          </p>
          <p style="margin: 8px 0 0; color: #8F7E81; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Coding With God. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Sends a contact email using the provided transporter and data.
 */
export async function sendContactEmail(transporter: Transporter, data: ContactData & { createdAt: string }) {
  if (!EMAIL_TO) {
    throw new Error('EMAIL_TO not configured on the server');
  }

  const html = getEmailHtml(data);

  return await transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `[Contact Form] ${data.subject}`,
    html,
    replyTo: `"${data.name}" <${data.email}>`,
  });
}
