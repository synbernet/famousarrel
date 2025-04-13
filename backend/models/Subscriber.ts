import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  source: {
    type: String,
    required: true,
    enum: ['footer', 'home', 'tour', 'music'],
    default: 'footer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    required: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  lastEmailSent: {
    type: Date,
    default: null
  }
});

// Add index for email uniqueness and faster queries
subscriberSchema.index({ email: 1 }, { unique: true });

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export default Subscriber; 