'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient, type Transaction } from '@/lib/api';

// Loading component for Suspense
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-[var(--color-text-dark-primary)] mb-2">
          Loading...
        </h2>
        <p className="text-[var(--color-text-dark-secondary)]">
          Please wait
        </p>
      </div>
    </div>
  );
}

// Main component that uses useSearchParams
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkTransactionStatus = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use the new manual check endpoint that queries Midtrans directly
        const response = await apiClient.checkTransactionStatus(orderId);
        setTransaction(response.data || null);
      } catch (error: any) {
        console.error('Error checking transaction:', error);
        // Fallback to database status if manual check fails
        try {
          const fallbackResponse = await apiClient.getTransactionStatus(orderId);
          setTransaction(fallbackResponse.data || null);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setError('Failed to verify payment status');
        }
      } finally {
        setLoading(false);
      }
    };

    checkTransactionStatus();

    // Check transaction status every 10 seconds for up to 60 seconds
    const interval = setInterval(checkTransactionStatus, 10000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      clearTimeout(timeout);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[var(--color-text-dark-primary)] mb-2">
            Verifying Payment...
          </h2>
          <p className="text-[var(--color-text-dark-secondary)]">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-2">
              Payment Verification Failed
            </h1>
            <p className="text-[var(--color-text-dark-secondary)] mb-6">
              {error || 'Unable to verify your payment status'}
            </p>
            <div className="space-y-3">
              <Link
                href="/student/dashboard"
                className="block w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/course"
                className="block w-full bg-gray-100 text-[var(--color-text-dark-primary)] font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success message if payment is successful
  if (transaction.status === 'paid' || transaction.status === 'settlement') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-2">
              Payment Successful!
            </h1>
            <p className="text-[var(--color-text-dark-secondary)] mb-6">
              Congratulations! Your payment has been processed successfully. You now have access to your course.
            </p>
            
            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-[var(--color-text-dark-primary)] mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-dark-secondary)]">Order ID:</span>
                  <span className="font-medium text-[var(--color-text-dark-primary)]">{transaction.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-dark-secondary)]">Amount:</span>
                  <span className="font-medium text-[var(--color-text-dark-primary)]">
                    Rp{transaction.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-dark-secondary)]">Status:</span>
                  <span className="font-medium text-green-600 capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/student/dashboard"
                className="block w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Start Learning
              </Link>
              <Link
                href="/course"
                className="block w-full bg-gray-100 text-[var(--color-text-dark-primary)] font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Browse More Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show pending message if payment is still pending
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-2">
            Payment {transaction.status === 'failed' ? 'Failed' : 'Processing'}
          </h1>
          <p className="text-[var(--color-text-dark-secondary)] mb-6">
            {transaction.status === 'failed' 
              ? 'Your payment could not be processed. Please try again.'
              : 'Your payment is being processed. You will receive access to your course once payment is confirmed.'
            }
          </p>
          
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-[var(--color-text-dark-primary)] mb-2">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-dark-secondary)]">Order ID:</span>
                <span className="font-medium text-[var(--color-text-dark-primary)]">{transaction.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-dark-secondary)]">Amount:</span>
                <span className="font-medium text-[var(--color-text-dark-primary)]">
                  Rp{transaction.amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-dark-secondary)]">Status:</span>
                <span className={`font-medium capitalize ${
                  transaction.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {transaction.status === 'failed' && (
              <button
                onClick={() => router.push(`/course/${transaction.class_id}/checkout`)}
                className="block w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Try Again
              </button>
            )}
            <Link
              href="/student/dashboard"
              className="block w-full bg-gray-100 text-[var(--color-text-dark-primary)] font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense
export default function PaymentSuccess() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}