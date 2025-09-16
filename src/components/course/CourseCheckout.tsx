'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiClient, type Class, type MidtransResponse } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface CourseCheckoutProps {
  courseId: string;
}

interface MidtransResult {
  order_id: string;
  transaction_status: string;
  payment_type: string;
  status_message: string;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: MidtransResult) => void;
        onPending: (result: MidtransResult) => void;
        onError: (result: MidtransResult) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function CourseCheckout({ courseId }: CourseCheckoutProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const getThumbnailUrl = (thumbnail: string) => {
    if (!thumbnail) return '/images/course.png';
    if (thumbnail.startsWith('http')) return thumbnail;
    // Remove "uploads/" prefix if it exists to avoid duplication
    const cleanPath = thumbnail.startsWith('uploads/') ? thumbnail.substring('uploads/'.length) : thumbnail;
    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  // Load course data and check enrollment status
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${API_BASE_URL}/api/classes/class/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.data || null);
        } else {
          setError('Course not found');
        }

        // Check if user is already enrolled
        try {
          const enrolledResponse = await apiClient.getMyClasses();
          if (enrolledResponse.data) {
            const isEnrolled = enrolledResponse.data.some(enrolledCourse => 
              enrolledCourse.id === parseInt(courseId)
            );
            setIsAlreadyEnrolled(isEnrolled);
          }
        } catch (enrolledError) {
          console.log('Could not check enrollment status:', enrolledError);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-B2ZG9N5vjEMB4YC0');
    
    script.onload = () => {
      console.log('Midtrans Snap script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('Failed to load Midtrans Snap script');
      setError('Failed to load payment system');
    };
    
    document.head.appendChild(script);

    return () => {
      // Clean up script on component unmount
      try {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      } catch (e) {
        console.warn('Failed to remove Midtrans script:', e);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!course) return;

    // Check if already enrolled before proceeding
    if (isAlreadyEnrolled) {
      setError('You are already enrolled in this course');
      return;
    }

    setPaymentLoading(true);
    setError('');

    try {
      const response = await apiClient.buyClass(course.id);
      const snapData = response.data as MidtransResponse;

      if (window.snap) {
        window.snap.pay(snapData.token, {
          onSuccess: (result) => {
            console.log('Payment successful:', result);
            // Wait a moment for webhook processing then redirect
            setTimeout(() => {
              router.push(`/payment/success?order_id=${result.order_id}`);
            }, 2000);
          },
          onPending: (result) => {
            console.log('Payment pending:', result);
            router.push(`/payment/pending?order_id=${result.order_id}`);
          },
          onError: (result) => {
            console.error('Payment error:', result);
            setError('Payment failed. Please try again.');
          },
          onClose: () => {
            console.log('Payment popup closed');
          }
        });
      } else {
        throw new Error('Midtrans Snap not loaded');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Handle specific error messages
      if (error.message?.includes('already enrolled') || error.message?.includes('already purchased')) {
        setIsAlreadyEnrolled(true);
        setError('You have already purchased this course');
      } else {
        setError(error.message || 'Payment failed. Please try again.');
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const applyPromoCode = () => {
    // Mock promo code logic - you can implement real promo system later
    if (promoCode.toLowerCase() === 'free100') {
      setDiscount(course?.price || 0);
    } else if (promoCode.toLowerCase() === 'discount50') {
      setDiscount((course?.price || 0) * 0.5);
    } else {
      setError('Invalid promo code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const finalPrice = (course?.price || 0) - discount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Course not found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If already enrolled, show enrollment message
  if (isAlreadyEnrolled) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-2">
                Already Enrolled
              </h1>
              <p className="text-[var(--color-text-dark-secondary)] mb-6">
                You are already enrolled in this course. You can access it from your dashboard.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/student/dashboard')}
                  className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push('/course')}
                  className="w-full bg-gray-100 text-[var(--color-text-dark-primary)] font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Browse Other Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          
          {/* Left Side - Course Card */}
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full max-w-md h-fit">
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={getThumbnailUrl(course.thumbnail)}
                  alt={course.title}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/course.png';
                  }}
                />
              </div>

              {/* Course Content */}
              <div className="p-4">
                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--color-text-dark-primary)]">
                      4.8
                    </span>
                    <span className="text-sm text-[var(--color-text-dark-tertiary)]">
                      ({course.member_count || 0})
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {course.formatted_price}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-3 leading-tight line-clamp-2">
                  {course.title}
                </h3>

                {/* Category */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {course.category_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-[var(--color-text-dark-secondary)]">
                    {course.category_name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Checkout Form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            
            {/* Metode Pembayaran */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-3">
                Metode Pembayaran
              </h2>
              
              <div className="mb-1">
                <span className="text-[var(--color-text-dark-secondary)] text-sm">
                  Midtrans (Credit Card, E-Wallet, Bank Transfer)
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
                  placeholder="Masukkan kode promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all duration-200 text-[var(--color-text-dark-primary)] placeholder-[var(--color-text-disabled)] text-sm"
                />
                <button 
                  onClick={applyPromoCode}
                  className="px-4 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm"
                >
                  Apply
                </button>
              </div>
              
              <div className="mt-2 text-xs text-[var(--color-text-dark-secondary)]">
                Try: <code className="bg-gray-100 px-1 rounded">FREE100</code> or <code className="bg-gray-100 px-1 rounded">DISCOUNT50</code>
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
                    {course.formatted_price}
                  </span>
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-dark-secondary)] text-sm">Potongan Harga</span>
                    <span className="text-green-600 font-medium text-sm">
                      -Rp{discount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 my-3"></div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-[var(--color-text-dark-primary)]">Total</span>
                  <span className="text-base font-bold text-[var(--color-text-dark-primary)]">
                    Rp{finalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full bg-[#2d1b4e] hover:bg-[#3d2b5e] active:bg-[#1d0b3e] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 text-base mb-4"
            >
              {paymentLoading ? 'Processing...' : finalPrice === 0 ? 'Enroll Free' : 'Bayar Sekarang'}
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
                    Transaksi Anda dilindungi dengan enkripsi SSL 256-bit melalui Midtrans
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