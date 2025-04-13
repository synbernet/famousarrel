import nodemailer from 'nodemailer';
import { IBooking } from '../models/Booking';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const sendBookingNotification = async (booking: IBooking): Promise<void> => {
  // Email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking Request: ${booking.eventName}`,
    html: `
      <h2>New Booking Request</h2>
      
      <h3>Event Details</h3>
      <p><strong>Event Type:</strong> ${booking.eventType}</p>
      <p><strong>Date:</strong> ${formatDate(booking.eventDate)}</p>
      <p><strong>Time:</strong> ${booking.eventTime}</p>
      <p><strong>Event Name:</strong> ${booking.eventName}</p>
      <p><strong>Venue:</strong> ${booking.venueName}</p>
      <p><strong>Address:</strong> ${booking.venueAddress}</p>
      <p><strong>Attire:</strong> ${booking.eventAttire}</p>

      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${booking.clientName}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>

      <h3>Package Details</h3>
      <p><strong>Selected Package:</strong> ${booking.selectedPackage.type}</p>
      <p><strong>Price:</strong> ${formatCurrency(booking.selectedPackage.price)}</p>
      <p><strong>Total Amount:</strong> ${formatCurrency(booking.totalAmount)}</p>
      <p><strong>Deposit Required:</strong> ${formatCurrency(booking.depositAmount)}</p>
      <p><strong>Custom Arrangement Required:</strong> ${booking.requiresCustomArrangement ? 'Yes' : 'No'}</p>
      <p><strong>Payment Method:</strong> ${booking.paymentMethod === 'check' ? 'Check' : 'PayPal'}</p>

      <h3>Equipment Requirements</h3>
      <ul>
        ${booking.equipment.drumSet ? '<li>Full Professional Quality Drum Set</li>' : ''}
        ${booking.equipment.microphones ? '<li>2 Microphones</li>' : ''}
        ${booking.equipment.visualDisplays ? '<li>Visual Display Screens</li>' : ''}
        ${booking.equipment.soundSystem ? '<li>Professional Quality Sound Systems</li>' : ''}
        ${booking.equipment.isVoiceOverRequest ? '<li>VoiceOver/Production Request</li>' : ''}
      </ul>

      <h3>Travel Arrangements</h3>
      <p>${booking.travelArrangements || 'No specific travel arrangements provided'}</p>
    `,
  });

  // Email to client
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: booking.email,
    subject: 'Your Booking Request - Famous Arrel',
    html: `
      <h2>Thank you for your booking request!</h2>
      <p>Dear ${booking.clientName},</p>
      <p>We have received your booking request for ${booking.eventName} on ${formatDate(booking.eventDate)}. Our team will review your request and get back to you within 24-48 hours.</p>

      <h3>Booking Details</h3>
      <p><strong>Event:</strong> ${booking.eventName}</p>
      <p><strong>Date:</strong> ${formatDate(booking.eventDate)}</p>
      <p><strong>Time:</strong> ${booking.eventTime}</p>
      <p><strong>Venue:</strong> ${booking.venueName}</p>
      <p><strong>Package:</strong> ${booking.selectedPackage.type}</p>
      <p><strong>Total Amount:</strong> ${formatCurrency(booking.totalAmount)}</p>
      <p><strong>Required Deposit:</strong> ${formatCurrency(booking.depositAmount)}</p>

      <h3>Next Steps</h3>
      <p>To secure your booking:</p>
      <ol>
        <li>Wait for our confirmation email (within 24-48 hours)</li>
        <li>Once confirmed, pay the deposit (${formatCurrency(booking.depositAmount)})</li>
        <li>Payment method: ${booking.paymentMethod === 'check' ? 'Check payable to Fine Art Music Empire' : 'PayPal invoice will be sent'}</li>
      </ol>

      <p><strong>Note:</strong> The booking is not confirmed until we receive your deposit payment.</p>

      <p>If you have any questions, please don't hesitate to contact us.</p>

      <p>Best regards,<br>Famous Arrel Team</p>
    `,
  });
}; 