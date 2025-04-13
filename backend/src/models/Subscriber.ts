import mongoose from 'mongoose';

export interface ISubscriber {
  email: string;
  source: string;
  subscribed: boolean;
  subscribedAt: Date;
}

const subscriberSchema = new mongoose.Schema<ISubscriber>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  source: {
    type: String,
    required: true,
    default: 'newsletter',
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Subscriber = mongoose.model<ISubscriber>('Subscriber', subscriberSchema); 