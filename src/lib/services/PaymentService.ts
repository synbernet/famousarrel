import Stripe from 'stripe';
import { PaymentIntent } from '@stripe/stripe-js';
import { 
  STRIPE_SECRET_KEY, 
  CRYPTO_PAYMENT_ADDRESSES,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  MIN_PAYMENT_AMOUNTS 
} from '../config/payment';
import { toast } from 'react-hot-toast';

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bitcoin' | 'ethereum' | 'paypal';
  billingDetails: {
    name: string;
    email: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  status: 'pending' | 'completed' | 'failed';
  paymentUrl?: string;
}

interface CryptoPayment {
  address: string;
  amount: number;
  fiatAmount: number;
  currency: string;
  cryptoType: string;
  customerEmail: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia' as const,
});

export class PaymentService {
  private static toastShown = false;

  private static showToast(message: string, type: 'success' | 'error') {
    if (this.toastShown) return;
    this.toastShown = true;
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
    setTimeout(() => {
      this.toastShown = false;
    }, 3000);
  }

  private static async safeFetch(url: string, options?: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('Network request failed');
    }
  }

  static async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      // Validate minimum payment amount
      const minAmount = MIN_PAYMENT_AMOUNTS[details.paymentMethod];
      if (details.amount < minAmount) {
        return {
          success: false,
          error: `Minimum payment amount for ${details.paymentMethod} is $${minAmount}`,
          status: 'failed'
        };
      }

      let result: PaymentResult;
      switch (details.paymentMethod) {
        case 'card':
          result = await this.processCardPayment(details);
          break;
        case 'bitcoin':
        case 'ethereum':
          result = await this.processCryptoPayment(details);
          break;
        case 'paypal':
          result = await this.processPayPalPayment(details);
          break;
        default:
          result = {
            success: false,
            error: 'Invalid payment method',
            status: 'failed'
          };
      }

      if (!result.success && result.error) {
        this.showToast(result.error, 'error');
      }
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      this.showToast(errorMessage, 'error');
      return {
        success: false,
        error: errorMessage,
        status: 'failed'
      };
    }
  }

  static async processCardPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(details.amount * 100), // Convert to cents
        currency: details.currency.toLowerCase(),
        payment_method_types: ['card'],
        metadata: {
          customerEmail: details.billingDetails.email,
          customerName: details.billingDetails.name,
        },
        receipt_email: details.billingDetails.email,
        shipping: {
          name: details.billingDetails.name,
          address: {
            line1: details.billingDetails.address.line1,
            city: details.billingDetails.address.city,
            state: details.billingDetails.address.state,
            postal_code: details.billingDetails.address.postal_code,
            country: details.billingDetails.address.country,
          },
        },
      });

      if (!paymentIntent.client_secret) {
        throw new Error('Failed to create payment intent');
      }

      return {
        success: true,
        transactionId: paymentIntent.id,
        status: 'pending',
        paymentUrl: paymentIntent.client_secret,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      return {
        success: false,
        error: errorMessage,
        status: 'failed',
      };
    }
  }

  static async processCryptoPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      const cryptoId = details.paymentMethod === 'bitcoin' ? 'bitcoin' : 'ethereum';
      const response = await this.safeFetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${details.currency.toLowerCase()}`
      );
      
      const priceData = await response.json();
      const cryptoPrice = priceData[cryptoId][details.currency.toLowerCase()];
      
      if (!cryptoPrice) {
        throw new Error('Failed to get crypto price');
      }

      const cryptoAmount = details.amount / cryptoPrice;
      const paymentAddress = CRYPTO_PAYMENT_ADDRESSES[details.paymentMethod as 'bitcoin' | 'ethereum'];
      
      if (!paymentAddress) {
        throw new Error(`${details.paymentMethod} payment address not configured`);
      }

      const paymentRef = `${details.paymentMethod}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      await this.storePendingCryptoPayment({
        address: paymentAddress,
        amount: cryptoAmount,
        fiatAmount: details.amount,
        currency: details.currency,
        cryptoType: details.paymentMethod,
        customerEmail: details.billingDetails.email,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        success: true,
        status: 'pending',
        paymentUrl: paymentAddress,
        transactionId: paymentRef,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Crypto payment setup failed';
      return {
        success: false,
        error: errorMessage,
        status: 'failed',
      };
    }
  }

  static async processPayPalPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
      const response = await this.safeFetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: details.currency.toUpperCase(),
              value: details.amount.toFixed(2),
            },
            shipping: {
              name: {
                full_name: details.billingDetails.name
              },
              address: {
                address_line_1: details.billingDetails.address.line1,
                admin_area_2: details.billingDetails.address.city,
                admin_area_1: details.billingDetails.address.state,
                postal_code: details.billingDetails.address.postal_code,
                country_code: details.billingDetails.address.country,
              }
            }
          }],
          application_context: {
            return_url: `${baseUrl}/api/payment/paypal/success`,
            cancel_url: `${baseUrl}/api/payment/paypal/cancel`
          }
        })
      });

      const orderData = await response.json();
      const approvalLink = orderData.links?.find(
        (link: { rel: string; href: string }) => link.rel === 'approve'
      );

      if (!approvalLink?.href) {
        throw new Error('PayPal approval URL not found');
      }

      return {
        success: true,
        status: 'pending',
        paymentUrl: approvalLink.href,
        transactionId: orderData.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'PayPal payment setup failed';
      return {
        success: false,
        error: errorMessage,
        status: 'failed',
      };
    }
  }

  private static async storePendingCryptoPayment(payment: CryptoPayment): Promise<void> {
    // Here you would implement the database storage
    // For now, we'll just log it
    console.log('Storing pending crypto payment:', payment);
  }

  static async verifyPayment(transactionId: string, paymentMethod: string): Promise<PaymentResult> {
    try {
      let result: PaymentResult;

      switch (paymentMethod) {
        case 'card':
          const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
          result = {
            success: paymentIntent.status === 'succeeded',
            status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
            transactionId,
          };
          break;

        case 'bitcoin':
        case 'ethereum':
          // Simulated success for demo
          result = {
            success: true,
            status: 'completed',
            transactionId,
          };
          break;

        case 'paypal':
          const response = await this.safeFetch(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${transactionId}`,
            {
              headers: {
                'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
              },
            }
          );
          
          const orderData = await response.json();
          result = {
            success: orderData.status === 'COMPLETED',
            status: orderData.status === 'COMPLETED' ? 'completed' : 'pending',
            transactionId,
          };
          break;

        default:
          result = {
            success: false,
            error: 'Invalid payment method',
            status: 'failed',
          };
      }

      if (!result.success && result.error) {
        this.showToast(result.error, 'error');
      }
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      this.showToast(errorMessage, 'error');
      return {
        success: false,
        error: errorMessage,
        status: 'failed'
      };
    }
  }
} 