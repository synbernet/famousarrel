import mongoose from 'mongoose';

export interface IBooking {
  // Event Details
  eventType: string;
  eventDate: Date;
  eventTime: string;
  eventName: string;
  venueName: string;
  venueAddress: string;
  eventAttire: string;

  // Contact Information
  clientName: string;
  email: string;
  phone: string;

  // Performance Package
  selectedPackage: {
    type: string;
    price: number;
  };

  // Additional Details
  requiresCustomArrangement: boolean;
  paymentMethod: 'check' | 'paypal';
  
  // Equipment
  equipment: {
    drumSet: boolean;
    microphones: boolean;
    visualDisplays: boolean;
    soundSystem: boolean;
    isVoiceOverRequest: boolean;
  };

  // Travel & Status
  travelArrangements: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  depositPaid: boolean;
  totalAmount: number;
  depositAmount: number;
  createdAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>({
  // Event Details
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    trim: true,
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  eventTime: {
    type: String,
    required: [true, 'Event time is required'],
    trim: true,
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
  },
  venueName: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,
  },
  venueAddress: {
    type: String,
    required: [true, 'Venue address is required'],
    trim: true,
  },
  eventAttire: {
    type: String,
    required: [true, 'Event attire is required'],
    trim: true,
  },

  // Contact Information
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },

  // Performance Package
  selectedPackage: {
    type: {
      type: String,
      required: [true, 'Package type is required'],
      enum: [
        'Guest Speaker',
        '15-minute Performance',
        '30-minute Performance',
        '60-minute Performance',
        'Radio/Internet VoiceOver',
        'Custom Produced Instrumental'
      ],
    },
    price: {
      type: Number,
      required: [true, 'Package price is required'],
    },
  },

  // Additional Details
  requiresCustomArrangement: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['check', 'paypal'],
  },

  // Equipment
  equipment: {
    drumSet: { type: Boolean, default: false },
    microphones: { type: Boolean, default: false },
    visualDisplays: { type: Boolean, default: false },
    soundSystem: { type: Boolean, default: false },
    isVoiceOverRequest: { type: Boolean, default: false },
  },

  // Travel & Status
  travelArrangements: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  depositPaid: {
    type: Boolean,
    default: false,
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
  },
  depositAmount: {
    type: Number,
    required: [true, 'Deposit amount is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema); 