'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient, type Transaction } from '@/lib/api';

// Loading component for Suspense
function PaymentPendingLoading() {
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
function PaymentPendingContent() {
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
        
        // If payment is successful, redirect to success page
        if (response.data && (response.data.status === 'paid' || response.data.status === 'settlement')) {
          router.push(`/payment/success?order_id=${orderId}`);
          return;
        }
      } catch (error: any) {
        console.error('Error checking transaction:', error);
        // Fallback to database status if manual check fails
        try {
          const fallbackResponse = await apiClient.getTransactionStatus(orderId);
          setTransaction(fallbackResponse.data || null);
          
          // Check for success status in fallback too
          if (fallbackResponse.data && (fallbackResponse.data.status === 'paid' || fallbackResponse.data.status === 'settlement')) {
            router.push(`/payment/success?order_id=${orderId}`);
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setError('Failed to check payment status');
        }
      } finally {
        setLoading(false);
      }
    };

    checkTransactionStatus();

    // Check transaction status every 10 seconds
    const interval = setInterval(checkTransactionStatus, 10000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[var(--color-text-dark-primary)] mb-2">
            Checking Payment Status...
          </h2>
          <p className="text-[var(--color-text-dark-secondary)]">
            Please wait while we verify your payment
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
              Unable to Check Payment
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
            Payment Pending
          </h1>
          <p className="text-[var(--color-text-dark-secondary)] mb-6">
            Your payment is being processed. Please complete the payment process or wait for confirmation.
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
                <span className="font-medium text-yellow-600 capitalize">{transaction.status}</span>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Payment Instructions
                </p>
                <p className="text-sm text-blue-700">
                  Please complete your payment using the method you selected. Once confirmed, you will receive access to your course.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Check Payment Status
            </button>
            <Link
              href="/student/dashboard"
              className="block w-full bg-gray-100 text-[var(--color-text-dark-primary)] font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
          
          <p className="text-xs text-[var(--color-text-dark-secondary)] mt-4">
            This page will automatically update when your payment is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense
export default function PaymentPending() {
  return (
    <Suspense fallback={<PaymentPendingLoading />}>
      <PaymentPendingContent />
    </Suspense>
  );
}