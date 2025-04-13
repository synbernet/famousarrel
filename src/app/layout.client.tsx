'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { MerchProvider } from '@/contexts/MerchContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { TourProvider } from '@/contexts/TourContext'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-black`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-black focus:text-white">
          Skip to main content
        </a>
        <AuthProvider>
          <TourProvider>
            <MerchProvider>
              <NavBar />
              <main id="main-content" className="flex-grow pt-16">
                {children}
              </main>
            </MerchProvider>
          </TourProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
