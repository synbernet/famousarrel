'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ChatBot from '@/components/ChatBot';

export default function AboutPage() {
  const achievements = [
    { number: '12+', label: 'Years in Music' },
    { number: '13+', label: 'Hit Singles' },
    { number: '1', label: 'Debut EP' },
    { number: '4', label: '2024 Releases' },
  ];

  const slides = [
    {
      bgColor: 'bg-gray-900',
      bgImage: '/images/about-slider/slide1.jpg',
      title: 'Arrel Moses',
      subtitle: 'Nigerian singer, songwriter, producer, and instrumentalist crafting unique Afrobeat and Afrodancehall music.',
      link: '/about'
    },
    {
      bgColor: 'bg-gray-900',
      bgImage: '/images/about-slider/slide2.jpg',
      title: 'The Journey',
      subtitle: 'From Army Children School to becoming a prominent figure in Nigerian music.',
      link: '/music'
    },
    {
      bgColor: 'bg-gray-900',
      bgImage: '/images/about-slider/slide3.jpg',
      title: 'Musical Evolution',
      subtitle: 'Blending Afrobeat with contemporary African rhythms and dancehall elements.',
      link: '/tour'
    },
    {
      bgColor: 'bg-gray-900',
      bgImage: '/images/about-slider/slide4.jpg',
      title: 'Latest Releases',
      subtitle: 'Featuring hits like "Anita", "Ogologo", "Uthando", and "Our Father" in 2024.',
      link: '/music'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Multiple Hit Singles',
      description: 'Released "Anita" ft. Olley-RSA, "Ogologo", "Uthando", and "Our Father"'
    },
    {
      year: '2022',
      title: 'Golden Stars Award',
      description: 'Received the "Promising Artist of the Year" award at the Golden Stars ceremony'
    },
    {
      year: '2019',
      title: 'The Fisherman Son EP',
      description: 'Released debut EP featuring hits like "Lagos", "Chanel", "Kimkardashian", and more'
    },
    {
      year: '2017',
      title: 'Breakthrough Single',
      description: 'Released "Girlsthem", gaining significant attention in the Afrobeat scene'
    },
    {
      year: '2012',
      title: 'Career Launch',
      description: 'Released debut single "Let\'s Go" and placed as second runner-up in Star Road Quest'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Hero Slider Section */}
      <section className="relative h-screen">
        <HeroSlider slides={slides} showButtons={false} />
      </section>

      {/* Chat with Arrel's AI Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-8">Chat with Arrel's AI</h2>
            <p className="text-xl text-gray-300 text-center mb-12">
              Have questions about Arrel? Ask our AI assistant anything about his music, career, or background!
            </p>
            <ChatBot />
          </motion.div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">The Artist</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Moses Oghenare Iribevbe, widely known as Arrel, is a Nigerian singer, songwriter, producer, and instrumentalist.
                  Born on August 22 in the 1990s in Ibadan, Oyo State, he has emerged as a distinctive voice in the Afrobeat and 
                  Afrodancehall music scene.
                </p>
                <p>
                  As the only boy among six siblings, Arrel's unique perspective was shaped by his family background. His father, 
                  Moses Iribevbe, served in the Nigerian Army, while his mother, Rhoda Iribevbe, is a businessperson. This diverse 
                  upbringing influenced his multifaceted approach to music.
                </p>
                <p>
                  His educational journey took him from Army Children School 2 in Lafenwa to African Church Grammar School in 
                  Abeokuta. He later earned his B.Tech in Fine and Applied Arts from Ladoke Akintola University of Technology 
                  (LAUTECH), where he developed his musical talents alongside his artistic studies.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[600px] rounded-lg overflow-hidden"
            >
              <Image
                src="/images/artists/slide-about_4.png"
                alt="Arrel performing"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                  {achievement.number}
                </h3>
                <p className="text-gray-300">{achievement.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Musical Journey Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Musical Journey</h2>
          <div className="space-y-8 text-gray-300">
            <p>
              Arrel's musical journey began in his early school years, where he joined the three-member boy band Soul Plus. 
              His talent was recognized when he became the second runner-up in Star Road Quest, a prestigious talent hunt show 
              in Abeokuta.
            </p>
            <p>
              Signed to Fine Art Music Empire, Arrel has collaborated with renowned producers including Ill Blackie, Twinbeatz, 
              Spottless, and Jack the Music Nerd. His music uniquely blends Afrobeat and Afrodancehall, creating a sound that 
              resonates with audiences worldwide.
            </p>
            <p>
              His 2019 debut EP "The Fisherman Son" marked a significant milestone, featuring hits like "Lagos", "Chanel", and 
              "Kimkardashian". Recent releases in 2024, including collaborations with South African artist Olley-RSA, showcase 
              his continued evolution and relevance in the industry.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Career Milestones</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="flex items-start gap-6">
                  <span className="text-yellow-400 text-2xl font-bold">{milestone.year}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-300">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-black to-transparent">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Join the Journey</h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience the unique blend of Afrobeat and Afrodancehall music with Arrel
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/music"
                className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Listen Now
              </Link>
              <Link
                href="/booking"
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 