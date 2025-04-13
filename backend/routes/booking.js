const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const emailService = require('../utils/emailService');

// Submit a booking request
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;

    // Create new booking
    const booking = new Booking(bookingData);
    await booking.save();

    // Send confirmation emails
    await Promise.all([
      emailService.sendBookingConfirmation(booking),
      emailService.sendBookingNotificationToAdmin(booking)
    ]);

    res.status(201).json({
      message: 'Booking request submitted successfully',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      message: 'Error processing booking request',
      error: error.message 
    });
  }
});

// Get booking status (for client reference)
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      status: booking.status,
      eventDate: booking.eventDate,
      venue: booking.eventLocation.venue
    });
  } catch (error) {
    console.error('Booking lookup error:', error);
    res.status(500).json({ message: 'Error retrieving booking information' });
  }
});

module.exports = router; 