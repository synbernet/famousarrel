export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export const CRYPTO_PAYMENT_ADDRESSES = {
  bitcoin: process.env.BITCOIN_PAYMENT_ADDRESS || '',
  ethereum: process.env.ETHEREUM_PAYMENT_ADDRESS || '',
};

export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

// Minimum payment amounts in USD
export const MIN_PAYMENT_AMOUNTS = {
  card: 1.00,
  bitcoin: 20.00,
  ethereum: 20.00,
  paypal: 1.00,
}; 