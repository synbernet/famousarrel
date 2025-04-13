const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const emailService = require('../utils/emailService');

// Test endpoint to get pricing
router.get('/pricing', (req, res) => {
  const pricing = {
    'Guest Speaker': 500.00,
    '15-minute Performance': 500.00,
    '30-minute Performance': 1000.00,
    '60-minute Performance': 2000.00,
    'Radio/Internet VoiceOver': 500.00,
    'Custom Produced Instrumental': 1500.00
  };
  res.json(pricing);
});

// Submit booking request
router.post('/submit', async (req, res) => {
  try {
    // Create new booking
    const booking = new Booking({
      // Event Details
      eventType: req.body.eventType,
      eventDateTime: new Date(req.body.eventDateTime),
      eventName: req.body.eventName,
      venueName: req.body.venueName,
      venueAddress: req.body.venueAddress,
      eventAttire: req.body.eventAttire,

      // Personal Information
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,

      // Pricing and Payment
      selectedServices: req.body.selectedServices,
      totalAmount: req.body.totalAmount,
      otherArrangement: req.body.otherArrangement,
      paymentMethod: req.body.paymentMethod,

      // Equipment Requirements
      equipment: {
        drumSet: req.body.equipment?.drumSet || false,
        microphones: req.body.equipment?.microphones || false,
        visualDisplays: req.body.equipment?.visualDisplays || false,
        soundSystem: req.body.equipment?.soundSystem || false,
        notApplicable: req.body.equipment?.notApplicable || false
      },

      // Travel Arrangements
      travelArrangements: req.body.travelArrangements
    });

    // Save booking
    await booking.save();

    // Send confirmation emails
    await Promise.all([
      emailService.sendBookingConfirmation(booking),
      emailService.sendBookingNotificationToAdmin(booking)
    ]);

    res.status(201).json({
      message: 'Booking request received successfully',
      booking: booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      message: 'Error processing booking request',
      error: error.message
    });
  }
});

module.exports = router; 