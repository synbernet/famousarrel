'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import PaymentProcessor from '@/components/Payment/PaymentProcessor';
import { v4 as uuidv4 } from 'uuid';
import CheckoutFlow from '@/components/Checkout/CheckoutFlow';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { state: cartState, removeFromCart, updateQuantity } = useCart();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bitcoin'>('card');
  const [isCheckout, setIsCheckout] = useState(false);

  // Reset states when cart is closed
  useEffect(() => {
    if (!isOpen) {
      setIsCheckout(false);
      setIsPaymentOpen(false);
    }
  }, [isOpen]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = (method: 'card' | 'bitcoin') => {
    setPaymentMethod(method);
    setIsPaymentOpen(true);
  };

  const handleStartCheckout = () => {
    if (!cartState.items.length) {
      toast.error('Please add items to your cart before proceeding to checkout');
      return;
    }
    setIsCheckout(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckout(false);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  {isCheckout ? (
                    <CheckoutFlow onClose={handleCloseCheckout} />
                  ) : (
                    <div className="flex h-full flex-col overflow-y-scroll bg-gray-900 shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            Shopping Cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={onClose}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {cartState.items.length === 0 ? (
                          <div className="mt-8">
                            <div className="text-center">
                              <p className="mt-4 text-gray-400">Your cart is empty</p>
                              <button
                                type="button"
                                className="mt-4 font-medium text-yellow-400 hover:text-yellow-300"
                                onClick={onClose}
                              >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-8">
                            <div className="flow-root">
                              <ul role="list" className="-my-6 divide-y divide-gray-700">
                                {cartState.items.map((item) => (
                                  <li key={item.id} className="flex py-6">
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                      <Image
                                        src={item.image || '/images/placeholder.jpg'}
                                        alt={item.name}
                                        fill
                                        className="h-full w-full object-cover object-center"
                                        sizes="96px"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/images/placeholder.jpg';
                                        }}
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-white">
                                          <h3>{item.name}</h3>
                                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        {item.size && (
                                          <p className="mt-1 text-sm text-gray-400">Size: {item.size}</p>
                                        )}
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="text-gray-400 hover:text-white"
                                          >
                                            -
                                          </button>
                                          <p className="text-gray-400">Qty {item.quantity}</p>
                                          <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="text-gray-400 hover:text-white"
                                          >
                                            +
                                          </button>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => handleRemoveItem(item.id)}
                                          className="font-medium text-yellow-400 hover:text-yellow-300"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {cartState.items.length > 0 ? (
                        <div className="border-t border-gray-700 px-4 py-6 sm:px-6">
                          <div className="flex justify-between text-base font-medium text-white">
                            <p>Subtotal</p>
                            <p>${cartState.total.toFixed(2)}</p>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-400">Shipping and taxes calculated at checkout.</p>

                          <div className="mt-6 space-y-4">
                            <button
                              onClick={handleStartCheckout}
                              className="w-full bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                            >
                              Proceed to Checkout
                            </button>
                          </div>

                          <div className="mt-6 flex justify-center text-center text-sm text-gray-400">
                            <p>
                              or{' '}
                              <button
                                type="button"
                                className="font-medium text-yellow-400 hover:text-yellow-300"
                                onClick={onClose}
                              >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>

      {isPaymentOpen && cartState.items.length > 0 && (
        <PaymentProcessor
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          amount={cartState.total}
          paymentMethod={paymentMethod}
          orderId={uuidv4()}
        />
      )}
    </Transition.Root>
  );
} 