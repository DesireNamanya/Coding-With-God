import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';

console.log('[SMTP] Host:', process.env.SMTP_HOST || 'live.smtp.mailtrap.io');
console.log('[SMTP] Port:', process.env.SMTP_PORT || '587');
console.log('[SMTP] Secure:', process.env.SMTP_SECURE || 'false');
console.log('[SMTP] User:', process.env.SMTP_USER || '(not set)');
console.log('[SMTP] Pass set:', process.env.SMTP_PASS ? 'yes' : 'no');
console.log('[SMTP] EMAIL_TO:', process.env.EMAIL_TO || '(not set)');
console.log('[SMTP] EMAIL_FROM:', process.env.EMAIL_FROM || '(not set)');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

transporter.verify().then(() => {
  console.log('[SMTP] Connection verified successfully');
}).catch((err) => {
  console.error('[SMTP] Connection verification failed:', err);
});

const EMAIL_FROM = process.env.EMAIL_FROM || 'Coding With God <hello@demomailtrap.co>';
const EMAIL_TO = process.env.EMAIL_TO || 'cwgtechnologies@gmail.com';

function sendJSON(
  res: ServerResponse,
  status: number,
  data: Record<string, unknown>
) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  console.log('[Handler] Request received, method:', req.method, 'url:', req.url);
  try {
    if (req.method !== 'POST') {
      console.log('[Handler] Method not allowed:', req.method);
      sendJSON(res, 405, { success: false, message: 'Method not allowed' });
      return;
    }

    const rawBody = await readBody(req);
    console.log('[Handler] Raw body received, length:', rawBody.length);

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
      console.log('[Handler] Body parsed successfully, fields:', Object.keys(body));
    } catch (parseErr) {
      console.error('[Handler] Failed to parse JSON body:', parseErr);
      sendJSON(res, 400, { success: false, message: 'Invalid JSON body' });
      return;
    }

    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const errors: Record<string, string> = {};

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

    if (Object.keys(errors).length > 0) {
      console.log('[Handler] Validation errors:', errors);
      sendJSON(res, 400, { success: false, errors });
      return;
    }

    const newMessage = {
      id: Math.random().toString(36).substring(2, 11),
      name: name!.trim(),
      email: email!.trim(),
      subject: subject!.trim(),
      message: message!.trim(),
      createdAt: new Date().toISOString(),
    };

    console.log(
      `[Handler] Sending email to ${EMAIL_TO} from ${newMessage.name} <${newMessage.email}>`
    );

    const emailResult = await sendContactEmail(newMessage);
    console.log('[Handler] Email sent successfully, result:', emailResult);

    console.log('[Handler] Sending 200 success response');
    sendJSON(res, 200, {
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('[Handler] Unhandled error:', error);
    if (error instanceof Error) {
      console.error('[Handler] Error name:', error.name);
      console.error('[Handler] Error message:', error.message);
      console.error('[Handler] Error stack:', error.stack);
    }
    const message = error instanceof Error ? error.message : 'An internal server error occurred';
    sendJSON(res, 500, {
      success: false,
      message,
    });
  }
}

async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}) {
  console.log('[sendContactEmail] Starting...');
  console.log('[sendContactEmail] EMAIL_TO:', EMAIL_TO);
  console.log('[sendContactEmail] SMTP_USER set:', !!process.env.SMTP_USER);
  console.log('[sendContactEmail] SMTP_PASS set:', !!process.env.SMTP_PASS);

  if (!EMAIL_TO) {
    console.error('[sendContactEmail] EMAIL_TO is empty');
    throw new Error('EMAIL_TO not configured on the server');
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('[sendContactEmail] SMTP credentials missing');
    throw new Error('SMTP credentials not configured on the server');
  }

  console.log('[sendContactEmail] Building email HTML...');
  const html = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FCFAF7; color: #241416; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(90, 6, 22, 0.05); border: 1px solid rgba(90, 6, 22, 0.08);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #5A0616 0%, #7E1025 100%); padding: 32px; text-align: center;">
          <img src="https://codingwithgod.com/logo.svg" alt="Coding With God" style="height: 60px; width: auto; margin-bottom: 16px; display: inline-block;">
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

  console.log('[sendContactEmail] Calling transporter.sendMail...');
  console.log('[sendContactEmail] Mail options:', JSON.stringify({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `[Contact Form] ${data.subject}`,
    htmlLength: html.length,
  }));

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `[Contact Form] ${data.subject}`,
      html,
      replyTo: `"${data.name}" <${data.email}>`,
    });
    console.log('[sendContactEmail] sendMail succeeded');
    console.log('[sendContactEmail] Message ID:', info.messageId);
    console.log('[sendContactEmail] Accepted:', info.accepted);
    console.log('[sendContactEmail] Rejected:', info.rejected);
    console.log('[sendContactEmail] Response:', info.response);
    return info;
  } catch (sendErr) {
    console.error('[sendContactEmail] sendMail threw an error');
    if (sendErr instanceof Error) {
      console.error('[sendContactEmail] Error name:', sendErr.name);
      console.error('[sendContactEmail] Error message:', sendErr.message);
      console.error('[sendContactEmail] Error code:', (sendErr as any).code);
      console.error('[sendContactEmail] Error command:', (sendErr as any).command);
      console.error('[sendContactEmail] Error response:', (sendErr as any).response);
      console.error('[sendContactEmail] Error stack:', sendErr.stack);
    }
    throw sendErr;
  }
}
