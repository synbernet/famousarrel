import nodemailer from 'nodemailer';
import { IContact } from '../models/Contact';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactNotification = async (contact: IContact): Promise<void> => {
  // Email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
      <p><strong>Type:</strong> ${contact.inquiryType}</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message.replace(/\n/g, '<br>')}</p>
    `,
  });

  // Auto-reply to sender
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: contact.email,
    subject: 'Thank you for contacting Famous Arrel',
    html: `
      <h2>Thank you for reaching out!</h2>
      <p>Dear ${contact.name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <hr>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Best regards,<br>Famous Arrel Team</p>
    `,
  });
}; 