'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-transparent backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[var(--color-text-dark-primary)]">
              MentorIT
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/kursus" 
              className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] px-3 py-2 text-sm font-medium transition-colors"
            >
              Kursus
            </Link>
            <Link 
              href="/real-impact" 
              className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] px-3 py-2 text-sm font-medium transition-colors"
            >
              Real Impact
            </Link>
            <Link 
              href="/tentang-kami" 
              className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] px-3 py-2 text-sm font-medium transition-colors"
            >
              Tentang Kami
            </Link>
            <button className="text-[var(--color-text-dark-primary)] border border-black hover:bg-black hover:text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200">
              Masuk
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-lg mt-2">
              <Link 
                href="/kursus" 
                className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] block px-3 py-2 text-base font-medium transition-colors"
              >
                Kursus
              </Link>
              <Link 
                href="/real-impact" 
                className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] block px-3 py-2 text-base font-medium transition-colors"
              >
                Real Impact
              </Link>
              <Link 
                href="/tentang-kami" 
                className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] block px-3 py-2 text-base font-medium transition-colors"
              >
                Tentang Kami
              </Link>
              <div className="pt-2">
                <button className="text-[var(--color-text-dark-primary)] border border-black hover:bg-black hover:text-white px-4 py-2 rounded-full text-base font-medium transition-all duration-200 w-full">
                  Masuk
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}