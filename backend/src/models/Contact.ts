import mongoose from 'mongoose';

export interface IContact {
  name: string;
  email: string;
  inquiryType: 'General Inquiry' | 'Booking' | 'Media' | 'Other';
  subject: string;
  message: string;
  createdAt: Date;
}

const contactSchema = new mongoose.Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  inquiryType: {
    type: String,
    required: [true, 'Inquiry type is required'],
    enum: ['General Inquiry', 'Booking', 'Media', 'Other'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Contact = mongoose.model<IContact>('Contact', contactSchema); 