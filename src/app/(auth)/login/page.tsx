'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen flex bg-[#f5f4fe]">
      {/* Left Side - Background Image with rounded border */}
      <div className="hidden lg:flex lg:w-1/2 p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/images/background/login.svg"
            alt="Login Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Logo + Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo - Positioned above the Masuk Akun tag */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-6">
              MentorIT
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)] rounded-full text-sm font-medium mb-6">
              <span className="text-[var(--color-primary)]">Masuk Akun</span>
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-text-dark-primary)] mb-4 leading-tight">
              Selamat Datang di MentorIT
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-[var(--color-text-dark-primary)] mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Text Field"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all duration-200 text-[var(--color-text-dark-primary)] placeholder-[var(--color-text-disabled)]"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[var(--color-text-dark-primary)] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Text Field"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all duration-200 text-[var(--color-text-dark-primary)] placeholder-[var(--color-text-disabled)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-disabled)] hover:text-[var(--color-text-dark-primary)] transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#1f2937] hover:bg-[var(--color-primary)] active:bg-[var(--color-primary-pressed)] text-white font-semibold rounded-xl transition-all duration-200 mt-8"
            >
              Masuk
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-[var(--color-text-disabled)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}