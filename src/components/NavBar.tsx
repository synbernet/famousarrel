'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/music', label: 'Music' },
    { href: '/tour', label: 'Tour' },
    { href: '/booking', label: 'Booking' },
    { href: '/merch', label: 'Merch' },
    { href: '/contact', label: 'Contact' },
  ];

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="relative w-[200px] h-[67px]" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-[200px] h-[67px]">
              <Image
                src="/images/header_logo.png"
                alt="Famous Arrel"
                fill
                sizes="(max-width: 768px) 150px, 200px"
                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                priority
                className="hover:opacity-90 transition-opacity"
              />
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white hover:text-yellow-400 transition relative py-2 group ${
                  pathname === item.href ? 'text-yellow-400' : ''
                }`}
              >
                {item.label}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-transform duration-300 ${
                    pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-3 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white hover:text-yellow-400 transition relative py-2 group ${
                  pathname === item.href ? 'text-yellow-400' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative">
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-transform duration-300 ${
                      pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 