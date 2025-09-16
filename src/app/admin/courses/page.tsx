'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient, Class, ClassCategory } from '@/lib/api';

// Add API_BASE_URL import
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Helper function to get thumbnail URL
const getThumbnailUrl = (thumbnail: string) => {
  if (!thumbnail) return '/images/course.png';
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${API_BASE_URL}/${thumbnail}`;
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesResponse, categoriesResponse] = await Promise.all([
        apiClient.getClasses(),
        apiClient.getClassCategories()
      ]);
      
      setClasses(classesResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.deleteClass(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete class');
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cls.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getClassStats = () => {
    const totalClasses = classes.length;
    const categoryStats = categories.map(category => ({
      name: category.name,
      count: classes.filter(cls => cls.category_name === category.name).length
    }));
    
    return { totalClasses, categoryStats };
  };

  const stats = getClassStats();

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <AdminLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courses...</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AdminLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600 mt-1">Create and manage courses, modules, and content</p>
            </div>
            <Link
              href="/admin/courses/create"
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium py-2 px-6 rounded-xl transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Course
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <div className="flex">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
                </div>
                <div className="bg-[#6366F1] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            {stats.categoryStats.slice(0, 3).map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{category.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                  </div>
                  <div className={`p-3 rounded-lg text-white ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search courses by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none text-gray-900"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none text-gray-900"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
                <span className="text-sm text-gray-600">
                  {filteredClasses.length} course{filteredClasses.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            <div className="p-6">
              {filteredClasses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {classes.length === 0 ? 'No courses yet' : 'No courses found'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {classes.length === 0 
                      ? 'Start building your course catalog by creating your first course.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {classes.length === 0 && (
                    <Link
                      href="/admin/courses/create"
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium py-2 px-6 rounded-xl transition-colors"
                    >
                      Create Your First Course
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClasses.map((course) => (
                    <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <img
                          src={getThumbnailUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium px-3 py-1 rounded-full">
                            {course.category_name}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-[#6366F1]/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                            {course.formatted_price}
                          </span>
                        </div>
                        {/* Level Badge */}
                        {course.level && (
                          <div className="absolute bottom-4 left-4">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              course.level === 'Mudah' ? 'bg-green-100 text-green-800' :
                              course.level === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                              course.level === 'Sulit' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {course.level}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {course.description}
                        </p>
                        
                        {/* Course stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span>{course.member_count || 0} students</span>
                          {course.level && <span>{course.level}</span>}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/admin/courses/${course.id}`}
                            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Manage Course
                          </Link>
                          
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/courses/${course.id}/edit`}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteClass(course.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}