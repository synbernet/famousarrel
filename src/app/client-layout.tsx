'use client';

import { Providers } from './providers';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <NavBar />
      {children}
      <Footer />
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
    </Providers>
  );
} 