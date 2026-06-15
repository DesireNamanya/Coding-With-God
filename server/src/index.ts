import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// ─── Startup Config Check ────────────────────────────────────────────────────
console.log('[Config] SMTP_HOST :', process.env.SMTP_HOST  || '⚠️  using default');
console.log('[Config] SMTP_USER :', process.env.SMTP_USER  ? '✅ set' : '❌ MISSING');
console.log('[Config] SMTP_PASS :', process.env.SMTP_PASS  ? '✅ set' : '❌ MISSING');
console.log('[Config] EMAIL_FROM:', process.env.EMAIL_FROM || '❌ MISSING');
console.log('[Config] EMAIL_TO  :', process.env.EMAIL_TO   || '❌ MISSING');

// ─── Email Transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('[SMTP] ❌ Connection failed:', error.message);
  } else {
    console.log('[SMTP] ✅ Ready to send emails');
  }
});

const EMAIL_FROM = process.env.EMAIL_FROM || '';
const EMAIL_TO   = process.env.EMAIL_TO   || '';

// ─── Email Sender ─────────────────────────────────────────────────────────────
const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}) => {
  if (!EMAIL_FROM || !EMAIL_TO) {
    throw new Error('EMAIL_FROM or EMAIL_TO is not configured');
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2563eb;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #374151;">Name</td>
          <td style="padding: 8px 0;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject</td>
          <td style="padding: 8px 0;">${data.subject}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #374151;">Date</td>
          <td style="padding: 8px 0;">${new Date(data.createdAt).toLocaleString()}</td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <h3 style="color: #374151;">Message</h3>
      <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${data.message}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af;">Sent via Coding With God contact form</p>
    </div>
  `;

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `[Contact Form] ${data.subject}`,
    html,
    replyTo: data.email,
  });
};

// ─── Express App ──────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'https://codingwithgod.com',
      'https://www.codingwithgod.com',
    ];
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ─── POST /api/contact ────────────────────────────────────────────────────────
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
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
      return res.status(400).json({ success: false, errors });
    }

    const newMessage = {
      name:      name.trim(),
      email:     email.trim(),
      subject:   subject.trim(),
      message:   message.trim(),
      createdAt: new Date().toISOString(),
    };

    // Send email — await so errors are caught and returned to the client
    await sendContactEmail(newMessage);
    console.log(`[Email] ✅ Sent for ${newMessage.email}`);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });

  } catch (error: any) {
    console.error('[API] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'An internal server error occurred.',
    });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Serve Frontend in Production ─────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n[Server] 🚀 Running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${isProduction ? 'production' : 'development'}\n`);
});