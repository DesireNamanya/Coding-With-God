import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Email transporter (SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const EMAIL_FROM = process.env.EMAIL_FROM || '';
const EMAIL_TO = process.env.EMAIL_TO || '';

const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}) => {
  if (!EMAIL_FROM || !EMAIL_TO) {
    console.warn('[Email] Skipping email — EMAIL_FROM or EMAIL_TO not set');
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
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `[Contact Form] ${data.subject}`,
    html,
    replyTo: data.email,
  });
};

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174',
    'http://localhost:5175', 'http://127.0.0.1:5175'
  ],
  credentials: true
}));
app.use(express.json());

// Path to data file
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'messages.json');

// Ensure data directory and file exist
const initDatabase = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

initDatabase();

// Form message interface
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

// API Routes
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Backend Validation
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

    // Save message to JSON file database
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const messages: ContactMessage[] = JSON.parse(rawData);

    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8');

    console.log(`[API] Saved contact submission from ${name.trim()} (${email.trim()})`);

    // Send email notification (non-blocking)
    sendContactEmail(newMessage).then(() => {
      console.log(`[Email] Notification sent for ${email.trim()}`);
    }).catch((err) => {
      console.error('[Email] Failed to send notification:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('[API] Error handling contact form submission:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try again later.'
    });
  }
});

// Serve client static files in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Coding With God Tech Backend running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${isProduction ? 'production' : 'development'}`);
});
