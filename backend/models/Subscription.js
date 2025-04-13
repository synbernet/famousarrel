const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['home', 'tour'],
    required: true
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema); 