'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import type { Transaction } from '@/lib/api';

// Loading component for Suspense
function PaymentFailedLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main component that uses useSearchParams
function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const reason = searchParams.get('reason');
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      apiClient.getTransactionStatus(orderId)
        .then(response => {
          if (response.data) {
            setTransaction(response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching transaction:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleTryAgain = () => {
    if (transaction?.class_id) {
      router.push(`/course/${transaction.class_id}/enroll`);
    } else {
      router.push('/course');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat informasi pembayaran...</p>
        </div>
      </div>
    );
  }

  const getFailureMessage = () => {
    if (reason === 'timeout') {
      return 'Waktu pembayaran telah habis. Silakan coba lagi.';
    }
    return transaction?.failure_reason || 'Pembayaran gagal atau dibatalkan.';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Gagal</h1>
          <p className="text-gray-600 mb-6">{getFailureMessage()}</p>
        </div>

        {transaction && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Detail Transaksi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-gray-900">{transaction.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kelas:</span>
                <span className="text-gray-900">{transaction.class_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah:</span>
                <span className="text-gray-900">
                  Rp {transaction.amount?.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-red-600 font-semibold">Gagal</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={handleBackToHome}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Butuh bantuan? Hubungi{' '}
            <a href="mailto:support@mentorit.com" className="text-blue-600 hover:underline">
              support@mentorit.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense
export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<PaymentFailedLoading />}>
      <PaymentFailedContent />
    </Suspense>
  );
}