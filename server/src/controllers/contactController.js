import nodemailer from 'nodemailer';
import ContactMessage from '../models/ContactMessage.js';

// SSE subscribers — admin clients listening for new messages
const subscribers = new Set();

export function subscribeMessages(request, response) {
  response.setHeader('Content-Type', 'text/event-stream');
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Connection', 'keep-alive');
  response.flushHeaders();

  // Send all existing messages on connect
  ContactMessage.find().sort({ createdAt: -1 }).limit(50).lean().then((messages) => {
    response.write(`data: ${JSON.stringify({ type: 'history', messages })}\n\n`);
  });

  subscribers.add(response);
  request.on('close', () => subscribers.delete(response));
}

function broadcast(message) {
  for (const res of subscribers) {
    res.write(`data: ${JSON.stringify({ type: 'new', message })}\n\n`);
  }
}

function createTransporter() {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
}

export async function sendContactMessage(request, response) {
  const { name, email, message } = request.body;

  if (!name || !email || !message) {
    return response.status(400).json({ message: 'Name, email, and message are required' });
  }

  const savedMessage = await ContactMessage.create({ name, email, message });
  broadcast(savedMessage.toObject());
  const transporter = createTransporter();

  if (transporter) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: process.env.CONTACT_TO || process.env.MAIL_USER,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: message
    });
  }

  response.status(201).json({
    message: transporter ? 'Message sent successfully' : 'Message saved successfully',
    id: savedMessage._id
  });
}
