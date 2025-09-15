'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const { user } = useAuth();

  const statsCards = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      title: 'Active Courses',
      value: '45',
      change: '+8%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Teachers',
      value: '28',
      change: '+3%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Revenue',
      value: 'Rp 125M',
      change: '+25%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Course completed', user: 'Jane Smith', time: '5 minutes ago', type: 'course' },
    { id: 3, action: 'Payment received', user: 'Mike Johnson', time: '10 minutes ago', type: 'payment' },
    { id: 4, action: 'New course created', user: 'Sarah Wilson', time: '15 minutes ago', type: 'course' },
    { id: 5, action: 'Teacher approved', user: 'David Brown', time: '20 minutes ago', type: 'user' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)]">Dashboard</h1>
            <p className="text-[var(--color-text-dark-secondary)] mt-1">
              Selamat datang kembali, {user?.name || user?.username}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-2">{stat.value}</p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-[var(--color-text-dark-secondary)]">
                        {stat.change}
                      </span>
                      <span className="text-sm text-[var(--color-text-dark-tertiary)] ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-primary)] p-3 rounded-lg text-white">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Revenue Overview</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-[var(--color-text-dark-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2 text-sm text-[var(--color-text-dark-tertiary)]">Chart will be integrated here</p>
                </div>
              </div>
            </div>

            {/* Course Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Top Performing Courses</h3>
              <div className="space-y-4">
                {[
                  { name: 'React Development', students: 234, rating: 4.8, revenue: 'Rp 45M' },
                  { name: 'Laravel Backend', students: 189, rating: 4.7, revenue: 'Rp 38M' },
                  { name: 'Vue.js Mastery', students: 156, rating: 4.9, revenue: 'Rp 31M' },
                  { name: 'Node.js API', students: 134, rating: 4.6, revenue: 'Rp 27M' }
                ].map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--color-text-dark-primary)]">{course.name}</h4>
                      <p className="text-sm text-[var(--color-text-dark-secondary)]">{course.students} students • ⭐ {course.rating}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--color-primary)]">{course.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-text-dark-primary)]">{activity.action}</p>
                      <p className="text-sm text-[var(--color-text-dark-secondary)]">{activity.user}</p>
                    </div>
                    <span className="text-xs text-[var(--color-text-dark-tertiary)]">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create New Course</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-[var(--color-text-dark-primary)] hover:bg-black text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Add Teacher</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-[var(--color-text-dark-tertiary)] text-[var(--color-text-dark-primary)] hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>View Reports</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-[var(--color-text-dark-tertiary)] text-[var(--color-text-dark-primary)] hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>System Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}