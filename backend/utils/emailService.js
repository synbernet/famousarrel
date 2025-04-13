const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  });
};

const emailService = {
  // Send subscription confirmation
  async sendSubscriptionConfirmation(email) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Famous Arrel Newsletter!',
      html: `
        <h1>Thank you for subscribing!</h1>
        <p>You're now part of Famous Arrel's exclusive community. You'll be the first to know about:</p>
        <ul>
          <li>New music releases</li>
          <li>Upcoming tour dates</li>
          <li>Special events</li>
          <li>Behind-the-scenes content</li>
        </ul>
        <p>Stay tuned for exciting updates!</p>
      `
    };
    
    return transporter.sendMail(mailOptions);
  },

  // Send booking confirmation to customer
  async sendBookingConfirmation(booking) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.email,
      subject: 'Booking Request Received - Famous Arrel',
      html: `
        <h1>Thank You for Your Booking Request!</h1>
        <p>Dear ${booking.name},</p>
        <p>We have received your booking request for the following event:</p>
        
        <h2>Event Details:</h2>
        <ul>
          <li>Event Name: ${booking.eventName}</li>
          <li>Event Type: ${booking.eventType}</li>
          <li>Date & Time: ${formatDateTime(booking.eventDateTime)}</li>
          <li>Venue: ${booking.venueName}</li>
          <li>Address: ${booking.venueAddress}</li>
          <li>Attire: ${booking.eventAttire}</li>
        </ul>

        <h2>Financial Details:</h2>
        <ul>
          <li>Total Amount: ${formatPrice(booking.totalAmount)}</li>
          <li>Required Deposit: ${formatPrice(booking.totalAmount / 2)} (50% non-refundable)</li>
          <li>Payment Method: ${booking.paymentMethod === 'check' ? 'Check payable to Fine Art Music Empire' : 'PayPal invoice'}</li>
        </ul>

        <h2>Equipment Requirements:</h2>
        <ul>
          ${booking.equipment.drumSet ? '<li>Full Professional Quality Drum Set w/headphones</li>' : ''}
          ${booking.equipment.microphones ? '<li>2 Microphones</li>' : ''}
          ${booking.equipment.visualDisplays ? '<li>Visual Display Screens</li>' : ''}
          ${booking.equipment.soundSystem ? '<li>Professional Quality Sound Systems</li>' : ''}
          ${booking.equipment.notApplicable ? '<li>N/A - VoiceOver/Production Request</li>' : ''}
        </ul>

        ${booking.travelArrangements ? `
        <h2>Travel Arrangements:</h2>
        <p>${booking.travelArrangements}</p>
        ` : ''}

        <p>Our team will review your request and get back to you within 48 hours.</p>
        <p>Reference Number: ${booking._id}</p>
        
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>You will receive payment instructions for the 50% deposit shortly.</li>
          <li>Once the deposit is received, your booking will be confirmed.</li>
          <li>Final payment is due prior to the performance date.</li>
        </ol>
      `
    };
    
    return transporter.sendMail(mailOptions);
  },

  // Send booking notification to admin
  async sendBookingNotificationToAdmin(booking) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Booking Request - ' + booking.eventName,
      html: `
        <h1>New Booking Request Received</h1>
        
        <h2>Event Details:</h2>
        <ul>
          <li>Event Name: ${booking.eventName}</li>
          <li>Event Type: ${booking.eventType}</li>
          <li>Date & Time: ${formatDateTime(booking.eventDateTime)}</li>
          <li>Venue: ${booking.venueName}</li>
          <li>Address: ${booking.venueAddress}</li>
          <li>Attire: ${booking.eventAttire}</li>
        </ul>

        <h2>Client Information:</h2>
        <ul>
          <li>Name: ${booking.name}</li>
          <li>Email: ${booking.email}</li>
          <li>Phone: ${booking.phone}</li>
        </ul>

        <h2>Financial Details:</h2>
        <ul>
          <li>Total Amount: ${formatPrice(booking.totalAmount)}</li>
          <li>Required Deposit: ${formatPrice(booking.totalAmount / 2)}</li>
          <li>Payment Method: ${booking.paymentMethod === 'check' ? 'Check' : 'PayPal'}</li>
          <li>Other Arrangement Requested: ${booking.otherArrangement ? 'Yes' : 'No'}</li>
        </ul>

        <h2>Equipment Requirements:</h2>
        <ul>
          ${booking.equipment.drumSet ? '<li>Full Professional Quality Drum Set w/headphones</li>' : ''}
          ${booking.equipment.microphones ? '<li>2 Microphones</li>' : ''}
          ${booking.equipment.visualDisplays ? '<li>Visual Display Screens</li>' : ''}
          ${booking.equipment.soundSystem ? '<li>Professional Quality Sound Systems</li>' : ''}
          ${booking.equipment.notApplicable ? '<li>N/A - VoiceOver/Production Request</li>' : ''}
        </ul>

        ${booking.travelArrangements ? `
        <h2>Travel Arrangements:</h2>
        <p>${booking.travelArrangements}</p>
        ` : ''}

        <p><strong>Required Actions:</strong></p>
        <ol>
          <li>Review booking details</li>
          <li>Send deposit payment instructions</li>
          <li>Update booking status in admin panel</li>
          <li>Coordinate with venue for equipment requirements</li>
        </ol>
      `
    };
    
    return transporter.sendMail(mailOptions);
  },

  // Send contact form notification to admin
  async sendContactNotificationToAdmin(contact) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${contact.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <h2>Contact Details:</h2>
        <ul>
          <li>Name: ${contact.name}</li>
          <li>Email: ${contact.email}</li>
          <li>Type of Inquiry: ${contact.inquiryType}</li>
          <li>Subject: ${contact.subject}</li>
        </ul>
        <h2>Message:</h2>
        <p>${contact.message}</p>
        <p>Submitted on: ${new Date(contact.submissionDate).toLocaleString()}</p>
      `
    };
    
    return transporter.sendMail(mailOptions);
  }
};

module.exports = emailService; 