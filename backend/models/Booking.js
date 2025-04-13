const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Event Details
  eventType: {
    type: String,
    required: true,
    enum: ['Guest Speaker', '15-minute Performance', '30-minute Performance', '60-minute Performance', 'Radio/Internet VoiceOver', 'Custom Produced Instrumental']
  },
  eventDateTime: {
    type: Date,
    required: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  venueName: {
    type: String,
    required: true,
    trim: true
  },
  venueAddress: {
    type: String,
    required: true,
    trim: true
  },
  eventAttire: {
    type: String,
    required: true,
    trim: true
  },

  // Personal Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },

  // Pricing and Payment
  selectedServices: [{
    type: String,
    enum: ['Guest Speaker', '15-minute Performance', '30-minute Performance', '60-minute Performance', 'Radio/Internet VoiceOver', 'Custom Produced Instrumental']
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  otherArrangement: {
    type: Boolean,
    required: true,
    default: false
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['check', 'paypal']
  },

  // Equipment Requirements
  equipment: {
    drumSet: Boolean,
    microphones: Boolean,
    visualDisplays: Boolean,
    soundSystem: Boolean,
    notApplicable: Boolean
  },

  // Travel Arrangements
  travelArrangements: {
    type: String,
    trim: true
  },

  // Status and Timestamps
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  depositPaid: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Booking', bookingSchema); 