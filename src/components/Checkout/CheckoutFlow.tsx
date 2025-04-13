'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { CartItem } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';
import { PaymentDetails } from '@/lib/services/PaymentService';

interface CheckoutStep {
  title: string;
  component: React.ReactNode;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'card' | 'bitcoin' | 'ethereum' | 'paypal';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingAddress: ShippingInfo;
}

interface CheckoutFlowProps {
  onClose: () => void;
}

export default function CheckoutFlow({ onClose }: CheckoutFlowProps) {
  const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.email ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode ||
      !shippingInfo.country
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCurrentStep(2);
    if (!paymentInfo.billingAddress.firstName) {
      setPaymentInfo(prev => ({
        ...prev,
        billingAddress: shippingInfo
      }));
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Don't proceed if total is 0
      if (total <= 0) {
        toast.error('Invalid order amount');
        return;
      }

      // Prepare payment details
      const paymentDetails: PaymentDetails = {
        amount: total,
        currency: 'USD',
        paymentMethod: paymentInfo.method,
        billingDetails: {
          name: `${paymentInfo.billingAddress.firstName} ${paymentInfo.billingAddress.lastName}`,
          email: paymentInfo.billingAddress.email,
          address: {
            line1: paymentInfo.billingAddress.address,
            city: paymentInfo.billingAddress.city,
            state: paymentInfo.billingAddress.state,
            postal_code: paymentInfo.billingAddress.zipCode,
            country: paymentInfo.billingAddress.country,
          },
        },
      };

      // Process payment
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentDetails,
          orderDetails: {
            items: cartItems,
            total,
            shippingAddress: shippingInfo,
          },
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      // Handle different payment flows
      if (result.status === 'pending') {
        if (result.paymentUrl) {
          if (paymentInfo.method === 'card') {
            // Handle Stripe payment confirmation
            // You would typically use the Stripe.js SDK here
          } else if (paymentInfo.method === 'paypal') {
            // Redirect to PayPal
            window.location.href = result.paymentUrl;
            return;
          } else if (paymentInfo.method === 'bitcoin' || paymentInfo.method === 'ethereum') {
            // Show crypto payment address and wait for confirmation
            toast.success(`Please send ${result.cryptoAmount} ${paymentInfo.method} to: ${result.paymentUrl}`);
            
            // Start polling for payment status
            const isConfirmed = await pollPaymentStatus(result.transactionId, paymentInfo.method);
            
            if (!isConfirmed) {
              throw new Error('Payment not confirmed');
            }
          }
        }
      }

      // If we get here, payment was successful
      setCurrentStep(3);
      clearCart();
      
      // Close checkout after delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
      setCurrentStep(2); // Stay on payment step
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (transactionId: string, paymentMethod: string): Promise<boolean> => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId,
            paymentMethod,
          }),
        });

        const result = await response.json();

        if (result.success && result.status === 'completed') {
          return true;
        }

        if (result.status === 'failed') {
          throw new Error(result.error || 'Payment verification failed');
        }

        // Wait 1 second before next attempt
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        console.error('Payment verification error:', error);
        return false;
      }
    }

    throw new Error('Payment verification timeout');
  };

  const CartReview = (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Review Your Cart</h2>
      <div className="space-y-4">
        {cartItems.map((item: CartItem) => (
          <div key={item.id} className="flex items-start space-x-4 bg-gray-800/50 p-4 rounded-lg">
            <div className="relative w-24 h-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">{item.name}</h3>
              <p className="text-gray-400">${item.price.toFixed(2)}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="text-gray-400">Qty: {item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between text-white">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => setCurrentStep(1)}
          className="w-full mt-4 bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Proceed to Shipping
        </button>
      </div>
    </div>
  );

  const ShippingForm = (
    <form onSubmit={handleShippingSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Shipping Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-1">First Name</label>
          <input
            type="text"
            required
            className="w-full bg-gray-800 text-white rounded-lg p-2"
            value={shippingInfo.firstName}
            onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Last Name</label>
          <input
            type="text"
            required
            className="w-full bg-gray-800 text-white rounded-lg p-2"
            value={shippingInfo.lastName}
            onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-400 mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full bg-gray-800 text-white rounded-lg p-2"
          value={shippingInfo.email}
          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-1">Address</label>
        <input
          type="text"
          required
          className="w-full bg-gray-800 text-white rounded-lg p-2"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-1">City</label>
          <input
            type="text"
            required
            className="w-full bg-gray-800 text-white rounded-lg p-2"
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">State</label>
          <input
            type="text"
            required
            className="w-full bg-gray-800 text-white rounded-lg p-2"
            value={shippingInfo.state}
            onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-1">ZIP Code</label>
          <input
            type="text"
            required
            className="w-full bg-gray-800 text-white rounded-lg p-2"
            value={shippingInfo.zipCode}
            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Country</label>
          <select
            required
            className="w-full bg-gray-800 text-white rounded-lg p-2"
            value={shippingInfo.country}
            onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(0)}
          className="text-gray-400 hover:text-white"
        >
          Back to Cart
        </button>
        <button
          type="submit"
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );

  const PaymentForm = (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Payment Information</h2>
      
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'card' }))}
          className={`p-4 rounded-lg border-2 transition-all ${
            paymentInfo.method === 'card'
              ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-lg shadow-yellow-400/10'
              : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-yellow-400/50 hover:text-yellow-400/90 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
            <span className="font-medium">Card</span>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'paypal' }))}
          className={`p-4 rounded-lg border-2 transition-all ${
            paymentInfo.method === 'paypal'
              ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-lg shadow-yellow-400/10'
              : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-yellow-400/50 hover:text-yellow-400/90 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.539h6.964c2.377 0 4.17.554 5.323 1.645 1.154 1.09 1.523 2.638 1.097 4.605-.009.039-.014.078-.014.117l-.001.053v.073c-.12 2.406-1.145 4.338-3.039 5.744-1.894 1.406-4.324 2.112-7.256 2.112H6.87a.642.642 0 0 0-.633.533l-.772 3.9a.641.641 0 0 1-.632.539h-1.42a.642.642 0 0 1-.633-.74l2.296-16.337z"/>
            </svg>
            <span className="font-medium">PayPal</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'bitcoin' }))}
          className={`p-4 rounded-lg border-2 transition-all ${
            paymentInfo.method === 'bitcoin'
              ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-lg shadow-yellow-400/10'
              : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-yellow-400/50 hover:text-yellow-400/90 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.18-.24.45-.614.35.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.236-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
            </svg>
            <span className="font-medium">Bitcoin</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'ethereum' }))}
          className={`p-4 rounded-lg border-2 transition-all ${
            paymentInfo.method === 'ethereum'
              ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-lg shadow-yellow-400/10'
              : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-yellow-400/50 hover:text-yellow-400/90 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
            </svg>
            <span className="font-medium">Ethereum</span>
          </div>
        </button>
      </div>

      {paymentInfo.method === 'card' && (
        <>
          <div>
            <label className="block text-gray-400 mb-1">Card Number</label>
            <input
              type="text"
              required
              placeholder="1234 5678 9012 3456"
              className="w-full bg-gray-800 text-white rounded-lg p-2"
              value={paymentInfo.cardNumber}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Expiry Date</label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                className="w-full bg-gray-800 text-white rounded-lg p-2"
                value={paymentInfo.expiryDate}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">CVV</label>
              <input
                type="text"
                required
                placeholder="123"
                className="w-full bg-gray-800 text-white rounded-lg p-2"
                value={paymentInfo.cvv}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
              />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="text-gray-400 hover:text-white"
          disabled={isProcessing}
        >
          Back to Shipping
        </button>
        <button
          type="submit"
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </form>
  );

  const OrderConfirmation = (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white">Order Confirmed!</h2>
      <p className="text-gray-400">
        Thank you for your purchase. You will receive a confirmation email shortly.
      </p>
      <div className="bg-gray-800/50 p-6 rounded-lg text-left">
        <h3 className="text-white font-medium mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-white font-medium pt-2 border-t border-gray-700">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const steps: CheckoutStep[] = [
    { title: 'Cart Review', component: CartReview },
    { title: 'Shipping', component: ShippingForm },
    { title: 'Payment', component: PaymentForm },
    { title: 'Confirmation', component: OrderConfirmation }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex-1 ${
                  index < steps.length - 1 ? 'border-b-2' : ''
                } ${
                  index <= currentStep
                    ? 'border-yellow-400'
                    : 'border-gray-700'
                }`}
              >
                <div
                  className={`text-center ${
                    index <= currentStep ? 'text-yellow-400' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 