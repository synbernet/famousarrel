import { Router } from 'express';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { Subscriber } from '../models/Subscriber';

const router = Router();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SubscribeRequest {
  email: string;
  source?: string;
}

router.post('/', async (req: Request<{}, {}, SubscribeRequest>, res: Response) => {
  try {
    const { email, source = 'newsletter' } = req.body;
    // Remove email from logs for privacy
    console.log('Received subscription request from source:', source);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    // Check if email already exists - use lean() for better performance
    const existingSubscriber = await Subscriber.findOne({ email }).lean();
    if (existingSubscriber) {
      if (existingSubscriber.subscribed) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter',
        });
      } else {
        // Reactivate subscription
        await Subscriber.updateOne(
          { email },
          { $set: { subscribed: true } }
        );
      }
    } else {
      // Create new subscriber
      await Subscriber.create({
        email,
        source,
      });
    }

    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Famous Arrel Newsletter!',
      html: `
        <h2>Thank you for subscribing!</h2>
        <p>Dear subscriber,</p>
        <p>Thank you for joining our newsletter. You'll now receive updates about:</p>
        <ul>
          <li>New music releases</li>
          <li>Upcoming performances</li>
          <li>Special events</li>
          <li>Exclusive content</li>
        </ul>
        <p>Stay tuned for exciting updates!</p>
        <p>Best regards,<br>Famous Arrel Team</p>
      `.trim(),
    });

    // Notify admin about new subscriber - remove sensitive info from logs
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `.trim(),
    });

    console.log('Subscription process completed');

    res.status(200).json({
      success: true,
      message: 'Thank you for subscribing! Please check your email for confirmation.',
    });
  } catch (error) {
    // Remove sensitive information from error logs
    console.error('Newsletter subscription error occurred');
    
    // Handle mongoose duplicate key error
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process subscription. Please try again later.',
    });
  }
});

export const subscribeRouter = router; 