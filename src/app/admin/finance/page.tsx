'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

export default function AdminFinance() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedType, setSelectedType] = useState('all');

  const transactions = [
    { id: 1, type: 'course_purchase', amount: 1200000, user: 'John Doe', course: 'React Development', date: '2024-01-25', status: 'completed', method: 'Credit Card' },
    { id: 2, type: 'course_purchase', amount: 1500000, user: 'Jane Smith', course: 'Laravel Backend', date: '2024-01-24', status: 'completed', method: 'Bank Transfer' },
    { id: 3, type: 'refund', amount: -800000, user: 'Mike Johnson', course: 'Vue.js Basics', date: '2024-01-23', status: 'completed', method: 'Credit Card' },
    { id: 4, type: 'course_purchase', amount: 1800000, user: 'Sarah Wilson', course: 'Mobile Development', date: '2024-01-22', status: 'pending', method: 'Bank Transfer' },
    { id: 5, type: 'course_purchase', amount: 2000000, user: 'David Brown', course: 'Data Science', date: '2024-01-21', status: 'completed', method: 'E-Wallet' },
  ];

  const monthlyRevenue = [
    { month: 'Jan 2024', revenue: 45000000, transactions: 28, growth: 12 },
    { month: 'Dec 2023', revenue: 40000000, transactions: 25, growth: 8 },
    { month: 'Nov 2023', revenue: 37000000, transactions: 22, growth: 15 },
    { month: 'Oct 2023', revenue: 32000000, transactions: 19, growth: -5 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedType === 'all') return true;
    return transaction.type === selectedType;
  });

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.type === 'course_purchase')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingRevenue = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = Math.abs(transactions
    .filter(t => t.type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)]">Financial Reports</h1>
              <p className="text-[var(--color-text-dark-secondary)] mt-1">Monitor revenue, transactions, and financial analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Export Report
              </button>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Revenue</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{formatPrice(totalRevenue)}</p>
                  <p className="text-sm text-[var(--color-text-dark-secondary)] mt-1">+15% from last month</p>
                </div>
                <div className="bg-[var(--color-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Pending Payments</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{formatPrice(pendingRevenue)}</p>
                  <p className="text-sm text-[var(--color-text-dark-tertiary)] mt-1">3 transactions</p>
                </div>
                <div className="bg-[var(--color-text-dark-secondary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Refunds</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{formatPrice(totalRefunds)}</p>
                  <p className="text-sm text-[var(--color-text-dark-tertiary)] mt-1">-2% from last month</p>
                </div>
                <div className="bg-[var(--color-text-dark-tertiary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Transactions</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{transactions.length}</p>
                  <p className="text-sm text-[var(--color-text-dark-secondary)] mt-1">This month</p>
                </div>
                <div className="bg-[var(--color-text-dark-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Monthly Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-[var(--color-text-dark-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                  </svg>
                  <p className="mt-2 text-sm text-[var(--color-text-dark-tertiary)]">Revenue chart visualization</p>
                </div>
              </div>
            </div>

            {/* Monthly Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Monthly Performance</h3>
              <div className="space-y-4">
                {monthlyRevenue.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-[var(--color-text-dark-primary)]">{month.month}</h4>
                      <p className="text-sm text-[var(--color-text-dark-secondary)]">{month.transactions} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--color-text-dark-primary)]">{formatPrice(month.revenue)}</p>
                      <p className={`text-sm ${month.growth >= 0 ? 'text-[var(--color-text-dark-primary)]' : 'text-[var(--color-text-dark-tertiary)]'}`}>
                        {month.growth >= 0 ? '+' : ''}{month.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)]">Recent Transactions</h3>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
              >
                <option value="all">All Types</option>
                <option value="course_purchase">Course Purchases</option>
                <option value="refund">Refunds</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Transaction</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">User</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Amount</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Method</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-[var(--color-text-dark-primary)]">
                            {transaction.type === 'course_purchase' ? 'Course Purchase' : 'Refund'}
                          </p>
                          <p className="text-sm text-[var(--color-text-dark-secondary)]">{transaction.course}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-dark-secondary)]">{transaction.user}</td>
                      <td className="py-4 px-6">
                        <span className={`font-medium ${
                          transaction.amount > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-dark-tertiary)]'
                        }`}>
                          {formatPrice(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-dark-secondary)]">{transaction.method}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-[var(--color-text-dark-primary)]/10 text-[var(--color-text-dark-primary)]'
                            : transaction.status === 'pending'
                            ? 'bg-[var(--color-text-dark-secondary)]/10 text-[var(--color-text-dark-secondary)]'
                            : 'bg-[var(--color-text-dark-tertiary)]/10 text-[var(--color-text-dark-tertiary)]'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-dark-secondary)]">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}