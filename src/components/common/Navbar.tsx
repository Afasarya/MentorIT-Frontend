'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name || user.username;
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      default:
        return '/';
    }
  };

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
              href="/course" 
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

            {/* Auth Section */}
            {loading ? (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {/* User Info & Dashboard Link */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[var(--color-text-dark-primary)]">
                      {getUserDisplayName()}
                    </span>
                    <span className="text-xs text-[var(--color-text-dark-secondary)] capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Dashboard Button */}
                {(user.role === 'admin' || user.role === 'teacher') && (
                  <Link
                    href={getDashboardLink()}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 text-[var(--color-text-dark-primary)] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] px-3 py-2 text-sm font-medium transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
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
                href="/course" 
                className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kursus
              </Link>
              <Link 
                href="/real-impact" 
                className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Real Impact
              </Link>
              <Link 
                href="/tentang-kami" 
                className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              
              <div className="pt-2 border-t border-gray-200">
                {loading ? (
                  <div className="px-3 py-2">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {getUserDisplayName().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--color-text-dark-primary)]">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-[var(--color-text-dark-secondary)] capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Link */}
                    {(user.role === 'admin' || user.role === 'teacher') && (
                      <Link
                        href={getDashboardLink()}
                        className="block px-3 py-2 text-base font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-base font-medium text-[var(--color-text-dark-secondary)] hover:text-[var(--color-primary)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      className="block px-3 py-2 text-base font-medium bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}