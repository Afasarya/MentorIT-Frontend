'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import TeacherLayout from '@/components/teacher/TeacherLayout';

// Define interfaces for type safety
interface Course {
  id: number;
  title: string;
  description: string;
  category: 'web-development' | 'mobile-development' | 'data-science';
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  rating: number;
  image: string;
  status: 'published' | 'draft' | 'archived';
  modules: number;
  created_at: string;
}

interface FormData {
  title: string;
  description: string;
  category: Course['category'];
  price: string;
  duration: string;
  level: Course['level'];
  image: string;
}

type CategoryFilter = 'all' | 'web-development' | 'mobile-development' | 'data-science';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [total, setTotal] = useState(18);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Extended mock courses data with pagination
  const allMockCourses: Course[] = [
    {
      id: 1,
      title: 'Complete React.js Development',
      description: 'Master React.js from basics to advanced concepts including hooks, context, and state management',
      category: 'web-development',
      price: 1200000,
      duration: '12 minggu',
      level: 'Beginner',
      students: 280,
      rating: 4.8,
      image: '/images/course.png',
      status: 'published',
      modules: 8,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      title: 'Flutter Mobile App Development',
      description: 'Build cross-platform mobile apps with Flutter and Dart programming language',
      category: 'mobile-development',
      price: 1500000,
      duration: '16 minggu',
      level: 'Intermediate',
      students: 165,
      rating: 4.9,
      image: '/images/course.png',
      status: 'draft',
      modules: 12,
      created_at: '2024-02-10'
    },
    {
      id: 3,
      title: 'Python Data Science Bootcamp',
      description: 'Complete guide for data science using Python and machine learning algorithms',
      category: 'data-science',
      price: 1800000,
      duration: '20 minggu',
      level: 'Advanced',
      students: 95,
      rating: 4.7,
      image: '/images/course.png',
      status: 'published',
      modules: 15,
      created_at: '2024-03-05'
    },
    {
      id: 4,
      title: 'Next.js Full Stack Development',
      description: 'Build modern full-stack applications with Next.js, TypeScript, and databases',
      category: 'web-development',
      price: 1600000,
      duration: '18 minggu',
      level: 'Intermediate',
      students: 220,
      rating: 4.6,
      image: '/images/course.png',
      status: 'published',
      modules: 14,
      created_at: '2024-03-15'
    },
    {
      id: 5,
      title: 'Vue.js Progressive Web Apps',
      description: 'Learn to build progressive web applications using Vue.js framework',
      category: 'web-development',
      price: 1300000,
      duration: '14 minggu',
      level: 'Intermediate',
      students: 145,
      rating: 4.5,
      image: '/images/course.png',
      status: 'draft',
      modules: 10,
      created_at: '2024-03-20'
    },
    {
      id: 6,
      title: 'React Native Cross Platform',
      description: 'Create mobile applications for iOS and Android using React Native',
      category: 'mobile-development',
      price: 1450000,
      duration: '15 minggu',
      level: 'Advanced',
      students: 180,
      rating: 4.8,
      image: '/images/course.png',
      status: 'published',
      modules: 13,
      created_at: '2024-04-01'
    },
    {
      id: 7,
      title: 'Angular Enterprise Development',
      description: 'Build large-scale enterprise applications with Angular and TypeScript',
      category: 'web-development',
      price: 1400000,
      duration: '16 minggu',
      level: 'Advanced',
      students: 120,
      rating: 4.7,
      image: '/images/course.png',
      status: 'published',
      modules: 12,
      created_at: '2024-04-10'
    },
    {
      id: 8,
      title: 'iOS Swift Development',
      description: 'Create native iOS applications using Swift and SwiftUI',
      category: 'mobile-development',
      price: 1700000,
      duration: '18 minggu',
      level: 'Intermediate',
      students: 85,
      rating: 4.6,
      image: '/images/course.png',
      status: 'draft',
      modules: 14,
      created_at: '2024-04-15'
    },
    {
      id: 9,
      title: 'Machine Learning with TensorFlow',
      description: 'Deep dive into machine learning and neural networks with TensorFlow',
      category: 'data-science',
      price: 2000000,
      duration: '24 minggu',
      level: 'Advanced',
      students: 65,
      rating: 4.9,
      image: '/images/course.png',
      status: 'published',
      modules: 18,
      created_at: '2024-05-01'
    },
    {
      id: 10,
      title: 'Kotlin Android Development',
      description: 'Build modern Android applications using Kotlin and Jetpack Compose',
      category: 'mobile-development',
      price: 1550000,
      duration: '17 minggu',
      level: 'Intermediate',
      students: 140,
      rating: 4.8,
      image: '/images/course.png',
      status: 'published',
      modules: 13,
      created_at: '2024-05-10'
    },
    {
      id: 11,
      title: 'Data Visualization with D3.js',
      description: 'Create stunning data visualizations using D3.js and JavaScript',
      category: 'data-science',
      price: 1350000,
      duration: '12 minggu',
      level: 'Intermediate',
      students: 90,
      rating: 4.5,
      image: '/images/course.png',
      status: 'draft',
      modules: 10,
      created_at: '2024-05-15'
    },
    {
      id: 12,
      title: 'Full Stack Node.js',
      description: 'Complete Node.js development from backend APIs to frontend integration',
      category: 'web-development',
      price: 1500000,
      duration: '20 minggu',
      level: 'Advanced',
      students: 200,
      rating: 4.7,
      image: '/images/course.png',
      status: 'published',
      modules: 16,
      created_at: '2024-05-20'
    }
  ];

  const fetchCourses = () => {
    setLoading(true);
    
    setTimeout(() => {
      const itemsPerPage = 6;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      let filteredCourses = allMockCourses;
      
      if (selectedCategory !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.category === selectedCategory);
      }
      
      if (searchTerm) {
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
      setCourses(paginatedCourses);
      setTotal(filteredCourses.length);
      setTotalPages(Math.ceil(filteredCourses.length / itemsPerPage));
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, selectedCategory, searchTerm]);

  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case 'web-development': return 'bg-gradient-to-r from-[#7c42e5] to-purple-600 text-white shadow-lg';
      case 'mobile-development': return 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg';
      case 'data-science': return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg';
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'published': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      case 'draft': return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg';
      case 'archived': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="text-sm text-gray-700 font-medium">
          Showing <span className="font-bold text-[#7c42e5]">{((currentPage - 1) * 6) + 1}</span> to{' '}
          <span className="font-bold text-[#7c42e5]">{Math.min(currentPage * 6, total)}</span> of{' '}
          <span className="font-bold text-[#7c42e5]">{total}</span> courses
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === number
                  ? 'bg-gradient-to-r from-[#7c42e5] to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Create Modal Component
  const CreateCourseModal = () => {
    const [formData, setFormData] = useState<FormData>({
      title: '',
      description: '',
      category: 'web-development',
      price: '',
      duration: '',
      level: 'Beginner',
      image: '/images/course.png'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission
      console.log('Creating course:', formData);
      setIsCreateModalOpen(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'web-development',
        price: '',
        duration: '',
        level: 'Beginner',
        image: '/images/course.png'
      });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    if (!isCreateModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7c42e5] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7c42e5] focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7c42e5] focus:border-transparent"
                >
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="data-science">Data Science</option>
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7c42e5] focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (IDR)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7c42e5] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 12 minggu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7c42e5] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#7c42e5] to-purple-600 text-white rounded-xl hover:from-[#6d30d1] hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Create Course
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!isDeleteModalOpen || !selectedCourse) return null;

    const handleDelete = () => {
      // Handle delete logic here
      console.log('Deleting course:', selectedCourse.id);
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Course</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{selectedCourse.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedCourse(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['teacher']}>
        <TeacherLayout>
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="animate-pulse">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4 mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
              </div>
              
              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Filters Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                  <div className="w-40 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                </div>
              </div>
              
              {/* Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
                        <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
                        <div className="flex space-x-2">
                          <div className="flex-1 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                          <div className="flex-1 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TeacherLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherLayout>
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7c42e5] to-purple-600 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your courses and educational content</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-[#7c42e5] to-purple-600 hover:from-[#6d30d1] hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Course</span>
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
                <div className="bg-gradient-to-r from-[#7c42e5] to-purple-600 p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{allMockCourses.filter(c => c.status === 'published').length}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">{allMockCourses.filter(c => c.status === 'draft').length}</p>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{allMockCourses.reduce((acc, course) => acc + course.students, 0)}</p>
                </div>
                <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] transition-colors duration-200"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] bg-white transition-colors duration-200 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="data-science">Data Science</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl mb-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Courses Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <AnimatePresence mode="wait">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(course.category)}`}>
                        {course.category.replace('-', ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase())}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(course.status)}`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-[#7c42e5]">{formatPrice(course.price)}</span>
                      <div className="flex items-center text-yellow-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-medium">{course.modules} modules</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span className="font-medium">{course.students}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-[#7c42e5] to-purple-600 hover:from-[#6d30d1] hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsDeleteModalOpen(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {courses.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or create your first course</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-[#7c42e5] to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-shadow duration-200"
              >
                Create First Course
              </button>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Pagination />
            </motion.div>
          )}
        </div>
      </TeacherLayout>
    </ProtectedRoute>
  );
}