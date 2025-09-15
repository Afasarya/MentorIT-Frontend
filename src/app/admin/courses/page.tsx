'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const courses = [
    { id: 1, title: 'React Development Fundamentals', category: 'Web Development', instructor: 'Jane Smith', students: 234, price: 1200000, status: 'active', createdDate: '2024-01-15' },
    { id: 2, title: 'Laravel Backend Mastery', category: 'Web Development', instructor: 'John Doe', students: 189, price: 1500000, status: 'active', createdDate: '2024-01-10' },
    { id: 3, title: 'Mobile App Development', category: 'Mobile Development', instructor: 'Sarah Wilson', students: 156, price: 1800000, status: 'draft', createdDate: '2024-01-05' },
    { id: 4, title: 'Data Science with Python', category: 'Data Science', instructor: 'Mike Johnson', students: 134, price: 2000000, status: 'active', createdDate: '2024-01-20' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)]">Course Management</h1>
              <p className="text-[var(--color-text-dark-secondary)] mt-1">Manage all courses and learning content</p>
            </div>
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Create New Course
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Courses</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{courses.length}</p>
                </div>
                <div className="bg-[var(--color-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Active Courses</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{courses.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="bg-[var(--color-text-dark-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Students</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{courses.reduce((sum, course) => sum + course.students, 0)}</p>
                </div>
                <div className="bg-[var(--color-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Revenue</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">Rp 125M</p>
                </div>
                <div className="bg-[var(--color-text-dark-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search courses by title or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Course</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Category</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Instructor</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Students</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Price</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-[var(--color-text-dark-primary)]">{course.title}</p>
                          <p className="text-sm text-[var(--color-text-dark-secondary)]">Created: {course.createdDate}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                          {course.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-dark-secondary)]">{course.instructor}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-[var(--color-text-dark-tertiary)] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="text-[var(--color-text-dark-secondary)]">{course.students}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">{formatPrice(course.price)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.status === 'active'
                            ? 'bg-[var(--color-text-dark-primary)]/10 text-[var(--color-text-dark-primary)]'
                            : course.status === 'draft'
                            ? 'bg-[var(--color-text-dark-tertiary)]/10 text-[var(--color-text-dark-tertiary)]'
                            : 'bg-gray-100 text-[var(--color-text-dark-tertiary)]'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm">
                            Edit
                          </button>
                          <button className="text-[var(--color-text-dark-secondary)] hover:text-[var(--color-text-dark-primary)] font-medium text-sm">
                            View
                          </button>
                          <button className="text-[var(--color-text-dark-tertiary)] hover:text-[var(--color-text-dark-primary)] font-medium text-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-[var(--color-text-dark-secondary)]">Showing {filteredCourses.length} of {courses.length} courses</p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-[var(--color-primary)] text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}