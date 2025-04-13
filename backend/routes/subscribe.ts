import { Router } from 'express';
import crypto from 'crypto';
import Subscriber from '../models/Subscriber';
import { sendVerificationEmail } from '../utils/mailer';

const router = Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email, source = 'footer' } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email is already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isVerified) {
        return res.status(400).json({ error: 'Email is already subscribed' });
      } else {
        // Resend verification email
        await sendVerificationEmail(email, existingSubscriber.verificationToken);
        return res.status(200).json({ message: 'Verification email resent' });
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new subscriber
    const subscriber = new Subscriber({
      email,
      source,
      verificationToken
    });

    await subscriber.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      message: 'Please check your email to verify your subscription'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      error: 'Failed to process subscription'
    });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const subscriber = await Subscriber.findOne({ verificationToken: token });

    if (!subscriber) {
      return res.status(404).json({ error: 'Invalid verification token' });
    }

    if (subscriber.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Update subscriber status
    subscriber.isVerified = true;
    subscriber.verificationToken = '';
    await subscriber.save();

    // Send welcome email
    await sendWelcomeEmail(subscriber.email);

    res.status(200).json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Failed to verify email'
    });
  }
});

export default router; 