import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY && process.env.NODE_ENV === 'production') {
  throw new Error(
    'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Please add it to your .env.local file.'
  );
}

export const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

export const getStripe = async () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.warn('Stripe publishable key is missing. Payment features will be disabled.');
    return null;
  }
  
  const stripe = await stripePromise;
  if (!stripe) {
    console.warn('Failed to initialize Stripe. Payment features will be disabled.');
    return null;
  }
  
  return stripe;
}; 