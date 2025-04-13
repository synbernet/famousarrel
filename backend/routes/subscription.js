const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const emailService = require('../utils/emailService');

// Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email, source } = req.body;

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Create new subscription
    const subscription = new Subscription({
      email,
      source: source || 'home'
    });

    await subscription.save();

    // Send confirmation email
    await emailService.sendSubscriptionConfirmation(email);

    res.status(201).json({
      message: 'Subscription successful',
      subscription
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Error processing subscription' });
  }
});

module.exports = router; 