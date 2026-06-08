import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const EMAIL_FROM = process.env.EMAIL_FROM || 'Coding With God <info@codingwithgod.com>';
const EMAIL_TO = process.env.EMAIL_TO || 'namanyadesire090@gmail.com';

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
  try {
    if (req.method !== 'POST') {
      sendJSON(res, 405, { success: false, message: 'Method not allowed' });
      return;
    }

    const rawBody = await readBody(req);
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
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
      `[API] Contact submission from ${newMessage.name} (${newMessage.email})`
    );

    try {
      await sendContactEmail(newMessage);
      console.log(`[Email] Notification sent for ${newMessage.email}`);
    } catch (err) {
      console.error('[Email] Failed to send notification:', err);
    }

    sendJSON(res, 200, {
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('[API] Unhandled error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'An internal server error occurred. Please try again later.',
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
  if (!EMAIL_TO) {
    console.warn('[Email] Skipping email — EMAIL_TO not set');
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2563eb;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject</td><td style="padding: 8px 0;">${data.subject}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Date</td><td style="padding: 8px 0;">${new Date(data.createdAt).toLocaleString()}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <h3 style="color: #374151;">Message</h3>
      <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${data.message}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af;">Sent via Coding With God contact form</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${data.name}" <${data.email}>`,
    to: EMAIL_TO,
    subject: `[Contact Form] ${data.subject}`,
    html,
  });
}
