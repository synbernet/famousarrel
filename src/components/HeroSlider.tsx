'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';

interface SlideData {
  bgColor: string;
  bgImage: string;
  title: string;
  subtitle: string;
  link: string;
}

interface HeroSliderProps {
  slides: SlideData[];
  showButtons?: boolean;
}

export default function HeroSlider({ slides, showButtons = true }: HeroSliderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: false
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative h-screen">
      <Slider {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-screen">
            <div className={`absolute inset-0 ${slide.bgColor}`}>
              <Image
                src={slide.bgImage}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  {slide.subtitle}
                </p>
                {showButtons && (
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/booking"
                      className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
                    >
                      Booking
                    </Link>
                    <Link
                      href="/music"
                      className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      Play Music
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
} 