'use client';

import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import QRCode from 'react-qr-code';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { stripePromise } from '@/lib/stripe';

interface PaymentProcessorProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentMethod: 'card' | 'bitcoin';
  orderId: string;
}

function CardPaymentForm({ onClose, amount, orderId }: Omit<PaymentProcessorProps, 'paymentMethod' | 'isOpen'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      toast.success('Payment successful!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Payment Information
          </label>
          <PaymentElement
            options={{
              layout: 'tabs',
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'auto',
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <p className="text-sm text-gray-400 text-center">
        Your payment is secure and encrypted
      </p>
    </form>
  );
}

function BitcoinPayment({ amount, orderId }: Omit<PaymentProcessorProps, 'paymentMethod' | 'isOpen' | 'onClose'>) {
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [btcAmount, setBtcAmount] = useState(0);

  useEffect(() => {
    const generateBitcoinAddress = async () => {
      try {
        const response = await fetch('/api/create-bitcoin-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            orderId,
          }),
        });

        const { address, btcAmount } = await response.json();
        setBitcoinAddress(address);
        setBtcAmount(btcAmount);
      } catch (error) {
        toast.error('Failed to generate Bitcoin payment. Please try again.');
      }
    };

    generateBitcoinAddress();
  }, [amount, orderId]);

  return (
    <div className="space-y-6 text-center">
      <h3 className="text-lg font-medium text-white">Pay with Bitcoin</h3>
      <p className="text-gray-400">
        Send exactly {btcAmount} BTC to the following address:
      </p>
      <div className="flex justify-center">
        {bitcoinAddress && (
          <QRCode
            value={bitcoinAddress}
            size={200}
            bgColor="#000000"
            fgColor="#ffffff"
            level="H"
          />
        )}
      </div>
      <div className="bg-gray-800 p-4 rounded-lg break-all">
        <p className="text-sm text-gray-300 font-mono">{bitcoinAddress}</p>
      </div>
      <p className="text-sm text-gray-400">
        The payment will be automatically detected once confirmed on the blockchain.
      </p>
    </div>
  );
}

export default function PaymentProcessor({ isOpen, onClose, amount, paymentMethod, orderId }: PaymentProcessorProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethod === 'card' && isOpen) {
      const createPaymentIntent = async () => {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount,
              orderId,
            }),
          });

          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          toast.error('Failed to initialize payment. Please try again.');
          onClose();
        }
      };

      createPaymentIntent();
    }
  }, [paymentMethod, isOpen, amount, orderId]);

  if (!stripePromise) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4">
            <p className="text-red-500">
              Payment system is not properly configured. Please try again later.
            </p>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {paymentMethod === 'card' && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CardPaymentForm onClose={onClose} amount={amount} orderId={orderId} />
            </Elements>
          ) : paymentMethod === 'bitcoin' ? (
            <BitcoinPayment amount={amount} orderId={orderId} />
          ) : null}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 