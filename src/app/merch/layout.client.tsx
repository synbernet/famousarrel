'use client';

import { useCart } from '@/contexts/CartContext';
import ShoppingCart from '@/components/ShoppingCart';

export default function MerchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggleCart, cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start pt-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Official Merch</h1>
            <p className="text-gray-400">Support the artist and look great doing it.</p>
          </div>
          <button
            onClick={toggleCart}
            className="relative bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors mt-2"
          >
            <span className="flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </span>
          </button>
        </div>
        {children}
      </div>
      <ShoppingCart />
    </div>
  );
} 