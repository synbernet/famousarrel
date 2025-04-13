'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { motion } from 'framer-motion';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const slides = [
    {
      bgColor: 'bg-gradient-to-r from-black to-purple-900',
      bgImage: '/images/slider/famous-arrel.jpg',
      title: 'Famous Arrel',
      subtitle: 'Let the music speak!',
      link: '/about'
    },
    {
      bgColor: 'bg-gradient-to-r from-purple-900 to-blue-900',
      bgImage: '/images/slider/concert.jpg',
      title: 'Live in Concert',
      subtitle: 'Experience the magic of live music',
      link: '/tour'
    },
    {
      bgColor: 'bg-gradient-to-r from-red-900 to-orange-900',
      bgImage: '/images/slider/album.jpg',
      title: 'The Fishermanson',
      subtitle: 'New Album Out Now',
      link: '/music'
    },
    {
      bgColor: 'bg-gradient-to-r from-green-900 to-teal-900',
      bgImage: '/images/slider/tour.jpg',
      title: 'World Tour 2025',
      subtitle: 'Get your tickets now',
      link: '/tour'
    }
  ];

  const featuredVideos = [
    {
      id: 'TXA3hMncVyM',
      title: 'Anita - Official Music Video',
      description: 'Experience the vibrant energy and captivating rhythms of Anita'
    },
    {
      id: 'FQmipQ1xwL0',
      title: 'Arrel - Kaabata (Official Video)',
      description: 'Journey through the soulful melodies of Kaabata'
    },
    {
      id: 'FFpeoZod_9c',
      title: 'Arrel - Girls them (Official Video)',
      description: 'Feel the groove of this dancehall-inspired hit'
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section with Slider */}
      <HeroSlider slides={slides} />

      {/* Featured Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/music" className="text-center group">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">Latest Releases</h3>
              <p className="text-gray-400">Check out my newest tracks and albums</p>
            </Link>
            <Link href="/tour" className="text-center group">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">Upcoming Shows</h3>
              <p className="text-gray-400">See where I'm performing next</p>
            </Link>
            <Link href="/merch" className="text-center group">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">Exclusive Merch</h3>
              <p className="text-gray-400">Get your hands on official merchandise</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Music Videos Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl font-bold text-white mb-6">Music Videos</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the visual journey through my latest music videos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group"
              >
                <div className="relative aspect-video mb-4 rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-800 transform group-hover:scale-[1.02] transition-all duration-300">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                  className="text-center"
                >
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-400">{video.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="https://www.youtube.com/@famousarrel?sub_confirmation=1"
              target="_blank"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe on YouTube
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
