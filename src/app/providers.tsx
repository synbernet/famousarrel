'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { MerchProvider } from '@/contexts/MerchContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <MerchProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#facc15',
                secondary: '#000',
              },
            },
          }}
        />
      </MerchProvider>
    </CartProvider>
  );
} 