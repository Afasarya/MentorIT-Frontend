'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, type Transaction } from '@/lib/api';

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchTransaction = async () => {
        try {
          const response = await apiClient.getTransactionStatus(orderId);
          setTransaction(response.data);
        } catch (error) {
          console.error('Failed to fetch transaction:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTransaction();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pembayaran Gagal
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi dengan metode pembayaran yang berbeda atau hubungi customer service untuk bantuan.
        </p>

        {/* Transaction Details */}
        {transaction && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Detail Transaksi:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono">{transaction.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>Rp{transaction.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="capitalize font-medium text-red-600">{transaction.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* Help Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900 text-sm">Kemungkinan Penyebab:</h4>
              <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                <li>• Saldo kartu atau akun tidak mencukupi</li>
                <li>• Informasi pembayaran tidak valid</li>
                <li>• Masalah teknis pada sistem pembayaran</li>
                <li>• Transaksi dibatalkan oleh pengguna</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/course/${transaction?.class_id}/checkout`)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Coba Lagi Pembayaran
          </button>
          
          <button
            onClick={() => router.push('/course')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Lihat Course Lain
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Contact Support */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Butuh bantuan?</p>
          <button 
            onClick={() => window.open('mailto:support@mentorit.com')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Hubungi Customer Service
          </button>
        </div>
      </div>
    </div>
  );
}