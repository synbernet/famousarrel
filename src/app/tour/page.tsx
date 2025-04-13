'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Show {
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketLink?: string;
  status: 'available' | 'sold-out' | 'limited';
  prices: {
    vip: number;
    standard: number;
    early: number;
  };
}

const shows: Show[] = [
  {
    date: 'Friday, March 14, 2025',
    venue: 'O2 Arena',
    city: 'London',
    country: 'UK',
    ticketLink: '/tickets/london',
    status: 'limited',
    prices: {
      vip: 800,
      standard: 400,
      early: 300
    }
  },
  {
    date: 'Saturday, March 22, 2025',
    venue: 'AccorHotels Arena',
    city: 'Paris',
    country: 'France',
    ticketLink: '/tickets/paris',
    status: 'available',
    prices: {
      vip: 750,
      standard: 350,
      early: 250
    }
  },
  {
    date: 'Friday, March 28, 2025',
    venue: 'Ziggo Dome',
    city: 'Amsterdam',
    country: 'Netherlands',
    ticketLink: '/tickets/amsterdam',
    status: 'available',
    prices: {
      vip: 700,
      standard: 300,
      early: 200
    }
  },
  {
    date: 'Monday, April 7, 2025',
    venue: 'Mercedes-Benz Arena',
    city: 'Berlin',
    country: 'Germany',
    status: 'sold-out',
    prices: {
      vip: 750,
      standard: 350,
      early: 250
    }
  },
  {
    date: 'Saturday, April 12, 2025',
    venue: 'Mediolanum Forum',
    city: 'Milan',
    country: 'Italy',
    ticketLink: '/tickets/milan',
    status: 'available',
    prices: {
      vip: 700,
      standard: 320,
      early: 220
    }
  },
  {
    date: 'Friday, April 18, 2025',
    venue: 'WiZink Center',
    city: 'Madrid',
    country: 'Spain',
    status: 'sold-out',
    prices: {
      vip: 680,
      standard: 300,
      early: 200
    }
  },
  {
    date: 'Wednesday, April 23, 2025',
    venue: 'Royal Arena',
    city: 'Copenhagen',
    country: 'Denmark',
    ticketLink: '/tickets/copenhagen',
    status: 'limited',
    prices: {
      vip: 720,
      standard: 340,
      early: 240
    }
  },
  {
    date: 'Monday, April 28, 2025',
    venue: 'Avicii Arena',
    city: 'Stockholm',
    country: 'Sweden',
    ticketLink: '/tickets/stockholm',
    status: 'available',
    prices: {
      vip: 750,
      standard: 350,
      early: 250
    }
  },
  {
    date: 'Saturday, May 3, 2025',
    venue: '3Arena',
    city: 'Dublin',
    country: 'Ireland',
    ticketLink: '/tickets/dublin',
    status: 'available',
    prices: {
      vip: 700,
      standard: 320,
      early: 220
    }
  }
];

export default function TourPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const countries = ['All Countries', ...new Set(shows.map(show => show.country))];

  const filteredShows = selectedCountry === 'All Countries' 
    ? shows 
    : shows.filter(show => show.country === selectedCountry);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/90"></div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            World Tour 2025
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Join Famous Arrel on his world tour across multiple cities. Get your tickets early!
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Country Filter */}
        <div className="mb-12 max-w-md mx-auto">
          <label htmlFor="country-select" className="block text-gray-400 mb-2 text-sm font-medium">
            Select Country
          </label>
          <select 
            id="country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-4 bg-gray-800/50 text-white rounded-xl border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Shows Grid */}
        <div className="grid gap-8 max-w-5xl mx-auto">
          {filteredShows.map((show, index) => (
            <motion.div
              key={`${show.date}-${show.venue}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-800/50"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <h3 className="text-xl font-semibold text-gray-200">{show.date}</h3>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-white">{show.venue}</h2>
                  <p className="text-gray-400 text-lg mb-4">{show.city}, {show.country}</p>
                  
                  {/* Price Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                      <p className="text-purple-400 font-medium">VIP Package: ${show.prices.vip}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                      <p className="text-blue-400 font-medium">Standard Ticket: ${show.prices.standard}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400"></span>
                      <p className="text-green-400 font-medium">Early Bird: ${show.prices.early}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 min-w-[200px]">
                  {show.status === 'sold-out' ? (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-8 py-4 rounded-xl font-bold w-full text-center">
                      SOLD OUT
                    </div>
                  ) : show.status === 'limited' ? (
                    <div className="flex flex-col items-center w-full gap-3">
                      <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-8 py-4 rounded-xl font-bold w-full text-center">
                        LIMITED SEATS
                      </div>
                      <a 
                        href={show.ticketLink} 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold w-full text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                      >
                        Get Tickets
                      </a>
                    </div>
                  ) : (
                    <a 
                      href={show.ticketLink} 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold w-full text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                      Get Tickets
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIP Package Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-900 rounded-2xl p-10 border border-purple-500/20 backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              VIP Package Experience
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p className="text-lg text-gray-300">Meet & Greet with Famous Arrel</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p className="text-lg text-gray-300">Exclusive Pre-show Reception</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p className="text-lg text-gray-300">Limited Edition Merchandise</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p className="text-lg text-gray-300">Priority Seating</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p className="text-lg text-gray-300">Backstage Tour</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p className="text-lg text-gray-300">Professional Photo Opportunity</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 