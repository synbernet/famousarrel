'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentMethod = 'card' | 'bitcoin';

interface PaymentDetails {
  method: PaymentMethod;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function ShoppingCart() {
  const { isOpen, toggleCart, cartItems, removeFromCart, updateQuantity, total, processPayment, isProcessing } = useCart();
  const [paymentStep, setPaymentStep] = useState<'cart' | 'payment' | 'confirmation'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaymentDetails(prev => ({ ...prev, method }));
    setError('');
  };

  const handleCheckout = async () => {
    try {
      setError('');
      const success = await processPayment({
        ...paymentDetails,
        method: paymentMethod
      });

      if (success) {
        setPaymentStep('confirmation');
        // Reset form after successful payment
        setTimeout(() => {
          setPaymentStep('cart');
          setPaymentDetails({
            method: 'card',
            cardNumber: '',
            expiryDate: '',
            cvv: ''
          });
          toggleCart();
        }, 3000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment processing failed');
    }
  };

  const handleProceedToCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      setError('Please add items to your cart before proceeding to checkout');
      return;
    }
    
    // Clear any previous errors
    setError('');
    setPaymentStep('payment');
  };

  const renderPaymentForm = () => {
    if (paymentMethod === 'card') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
            <input
              type="text"
              maxLength={16}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '') }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={paymentDetails.expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                  }
                  setPaymentDetails(prev => ({ ...prev, expiryDate: value }));
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                maxLength={3}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={paymentDetails.cvv}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Send Bitcoin to the following address:</p>
          <p className="text-yellow-400 font-mono text-sm break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
          <p className="text-sm text-gray-400 mt-2">Amount: {(total / 40000).toFixed(8)} BTC</p>
        </div>
        <p className="text-sm text-gray-400">
          After sending the payment, click "Complete Purchase" to confirm your order.
          We'll verify the transaction on the blockchain.
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      onClick={() => paymentStep === 'cart' && toggleCart()}
    >
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">
              {paymentStep === 'payment' ? 'Checkout' : 
               paymentStep === 'confirmation' ? 'Order Confirmed' : 
               'Shopping Cart'}
            </h2>
            {paymentStep === 'cart' && (
              <button
                onClick={toggleCart}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {paymentStep === 'cart' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Your cart is empty</p>
                      {error && (
                        <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}
                      <button
                        onClick={toggleCart}
                        className="mt-4 text-yellow-400 hover:text-yellow-300 transition"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-lg"
                        >
                          <div className="relative w-20 h-20">
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
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="text-gray-400 hover:text-white transition"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-400 hover:text-white transition"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-400 transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}

              {paymentStep === 'payment' && cartItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex gap-4">
                    <button
                      onClick={() => handlePaymentMethodChange('card')}
                      className={`flex-1 p-4 rounded-lg border-2 transition ${
                        paymentMethod === 'card'
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="font-medium">Card</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handlePaymentMethodChange('bitcoin')}
                      className={`flex-1 p-4 rounded-lg border-2 transition ${
                        paymentMethod === 'bitcoin'
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.236-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
                        </svg>
                        <span className="font-medium">Bitcoin</span>
                      </div>
                    </button>
                  </div>

                  {renderPaymentForm()}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg">
                      {error}
                    </div>
                  )}
                </motion.div>
              )}

              {paymentStep === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Order Confirmed!</h3>
                  <p className="text-gray-400">
                    Thank you for your purchase. You will receive a confirmation email shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {cartItems.length > 0 && paymentStep !== 'confirmation' && (
            <div className="border-t border-gray-800 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  if (paymentStep === 'cart') {
                    handleProceedToCheckout();
                  } else {
                    handleCheckout();
                  }
                }}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : paymentStep === 'cart' ? (
                  'Proceed to Checkout'
                ) : (
                  'Complete Purchase'
                )}
              </button>
              {paymentStep === 'payment' && (
                <button
                  onClick={() => setPaymentStep('cart')}
                  className="w-full text-gray-400 hover:text-white transition"
                  disabled={isProcessing}
                >
                  Back to Cart
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 