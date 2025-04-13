import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from './client-layout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Famous Arrel',
    default: 'Famous Arrel - Professional Musician',
  },
  description: 'Experience the fusion of traditional and modern music with Famous Arrel. Book live performances for your events, explore music albums, and more.',
  keywords: ['music', 'live performance', 'musician', 'artist', 'booking', 'events'],
  authors: [{ name: 'Famous Arrel' }],
  creator: 'Famous Arrel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Famous Arrel',
    title: 'Famous Arrel - Professional Musician',
    description: 'Experience the fusion of traditional and modern music with Famous Arrel',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Famous Arrel performing live',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Famous Arrel - Professional Musician',
    description: 'Experience the fusion of traditional and modern music with Famous Arrel',
    images: ['https://your-domain.com/twitter-image.jpg'],
    creator: '@yourtwitterhandle'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

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
        <link rel="icon" href="/icon.png" sizes="32x32" />
        <link rel="icon" href="/icon.png" sizes="128x128" />
        <link rel="icon" href="/icon.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon.png" sizes="180x180" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-black`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
