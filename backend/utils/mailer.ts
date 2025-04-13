import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your subscription to Famous Arrel Newsletter',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to Famous Arrel Newsletter!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Thank you for subscribing to our newsletter. To complete your subscription and start receiving updates, please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center;">
          If you didn't request this subscription, you can safely ignore this email.
        </p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} Famous Arrel. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendWelcomeEmail = async (email: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Famous Arrel Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Thank You for Subscribing!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Your email has been verified, and you're now officially part of the Famous Arrel community! You'll be the first to know about:
        </p>
        <ul style="color: #666; font-size: 16px; line-height: 1.5;">
          <li>New music releases</li>
          <li>Upcoming tour dates</li>
          <li>Exclusive content and behind-the-scenes</li>
          <li>Special announcements and events</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" 
             style="background-color: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Visit Website
          </a>
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} Famous Arrel. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}; 