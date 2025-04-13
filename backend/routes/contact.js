const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const emailService = require('../utils/emailService');

// Submit a contact form
router.post('/', async (req, res) => {
  try {
    const contactData = req.body;

    // Create new contact entry
    const contact = new Contact(contactData);
    await contact.save();

    // Send notification to admin
    await emailService.sendContactNotificationToAdmin(contact);

    res.status(201).json({
      message: 'Message sent successfully',
      contact
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Error sending message',
      error: error.message 
    });
  }
});

module.exports = router; 