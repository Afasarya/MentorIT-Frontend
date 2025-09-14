'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CourseCheckoutProps {
  courseId: string;
}

export default function CourseCheckout({ courseId }: CourseCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState('otomatis');
  const [promoCode, setPromoCode] = useState('');

  // Mock course data - sesuai dengan design figma
  const course = {
    id: courseId,
    title: 'Website Development dengan Laravel dan React JS',
    instructor: 'Jane Cooper',
    image: '/images/course.png',
    price: 'Rp1.200.000',
    rating: 4.8,
    reviews: 190
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-16">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text-dark-primary)] mb-4">
            Checkout
          </h1>
          <p className="text-lg text-[var(--color-text-dark-secondary)]">
            Bergabung dengan course untuk ciptakan portofolio yang berdampak
          </p>
        </div>

        {/* Main Content Grid - Jarak diperkecil lagi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          
          {/* Left Side - Course Card dengan border lebih lebar */}
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full max-w-md h-fit">
              {/* Course Image - Rasio 16:9 sesuai Figma untuk menampilkan gambar penuh */}
              <div className="relative overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Course Content - Padding disesuaikan */}
              <div className="p-4">
                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--color-text-dark-primary)]">
                      {course.rating}
                    </span>
                    <span className="text-sm text-[var(--color-text-dark-tertiary)]">
                      ({course.reviews})
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {course.price}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-3 leading-tight line-clamp-2">
                  {course.title}
                </h3>

                {/* Instructor */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">JC</span>
                  </div>
                  <span className="text-sm text-[var(--color-text-dark-secondary)]">
                    {course.instructor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Checkout Form dengan padding disesuaikan */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            
            {/* Metode Pembayaran */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-3">
                Metode Pembayaran
              </h2>
              
              <div className="mb-1">
                <span className="text-[var(--color-text-dark-secondary)] text-sm">
                  Otomatis
                </span>
              </div>
            </div>

            {/* Kode Promo */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-3">
                Kode Promo
              </h3>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Text field"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all duration-200 text-[var(--color-text-dark-primary)] placeholder-[var(--color-text-disabled)] text-sm"
                />
                <button className="px-4 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm">
                  Apply
                </button>
              </div>
            </div>

            {/* Detail Pembayaran */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">
                Detail Pembayaran
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-5">
                {/* Original Price */}
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-dark-secondary)] text-sm">Harga normal</span>
                  <span className="text-[var(--color-text-dark-primary)] text-sm">
                    Rp1.200.000
                  </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-dark-secondary)] text-sm">Potongan Harga</span>
                  <span className="text-green-600 font-medium text-sm">
                    -Rp1.200.000
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-3"></div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-[var(--color-text-dark-primary)]">Total</span>
                  <span className="text-base font-bold text-[var(--color-text-dark-primary)]">
                    Rp0
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-[#2d1b4e] hover:bg-[#3d2b5e] active:bg-[#1d0b3e] text-white font-semibold py-3 rounded-lg transition-all duration-200 text-base mb-4">
              Bayar
            </button>

            {/* Security Note */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-primary)] mb-1">
                    Pembayaran Aman
                  </p>
                  <p className="text-xs text-[var(--color-text-dark-secondary)]">
                    Transaksi Anda dilindungi dengan enkripsi SSL 256-bit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}