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

const EMAIL_FROM = process.env.EMAIL_FROM || 'Coding With God <hello@demomailtrap.co>';
const EMAIL_TO   = process.env.EMAIL_TO   || 'cwgtechnologies@gmail.com';

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