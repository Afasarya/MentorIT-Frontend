'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/category`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/classes/class`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on selected category and search term
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category_name.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getThumbnailUrl = (thumbnail: string) => {
    if (thumbnail.startsWith('http')) {
      return thumbnail;
    }
    // Remove "uploads/" prefix if it exists to avoid duplication
    const cleanPath = thumbnail.startsWith('uploads/') ? thumbnail.substring('uploads/'.length) : thumbnail;
    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  // Static fallback categories if API fails
  const fallbackCategories = [
    {
      id: 'web-development',
      name: 'Web Development',
      icon: '/images/category-web.png',
      color: 'bg-purple-50'
    },
    {
      id: 'app-development', 
      name: 'App Development',
      icon: '/images/category-mobile.png',
      color: 'bg-purple-50'
    },
    {
      id: 'data-science',
      name: 'Data Science', 
      icon: '/images/category-datascience.png',
      color: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-16">
        {/* Header Section */}
        <div className="mb-12">
          <span className="inline-block px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)] rounded-full text-sm font-medium mb-4">
            <span className="text-[var(--color-primary)]">#CourseUntukmu</span>
          </span>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            {/* Title and Description */}
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-[var(--color-text-dark-primary)] mb-2">
                Courses
              </h1>
              <p className="text-[var(--color-text-dark-secondary)] text-base">
                Bergabung dengan course untuk ciptakan portofolio yang berdampak
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-8">
            Kategori
          </h2>
          
          {/* Category Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center space-x-4 px-6 sm:px-7 py-4 sm:py-5 rounded-2xl border-2 transition-all duration-200 w-full ${
                selectedCategory === 'all'
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                  : 'bg-white border-gray-200 hover:border-[var(--color-primary)] text-[var(--color-text-dark-primary)]'
              }`}
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selectedCategory === 'all' ? 'bg-white/20' : 'bg-purple-50'
              }`}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="font-semibold text-base sm:text-lg flex-1 text-left">
                Semua
              </span>
            </button>

            {/* Dynamic Categories */}
            {categories.length > 0 ? categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-4 px-6 sm:px-7 py-4 sm:py-5 rounded-2xl border-2 transition-all duration-200 w-full ${
                  selectedCategory === category.name
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'bg-white border-gray-200 hover:border-[var(--color-primary)] text-[var(--color-text-dark-primary)]'
                }`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedCategory === category.name ? 'bg-white/20' : 'bg-purple-50'
                }`}>
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-base sm:text-lg flex-1 text-left">
                  {category.name}
                </span>
              </button>
            )) : fallbackCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-4 px-6 sm:px-7 py-4 sm:py-5 rounded-2xl border-2 transition-all duration-200 w-full ${
                  selectedCategory === category.name
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'bg-white border-gray-200 hover:border-[var(--color-primary)] text-[var(--color-text-dark-primary)]'
                }`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedCategory === category.name ? 'bg-white/20' : category.color
                }`}>
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="object-contain w-8 h-8 sm:w-10 sm:h-10"
                  />
                </div>
                <span className="font-semibold text-base sm:text-lg flex-1 text-left">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-8">
            {selectedCategory === 'all' ? 'Semua Course' : `Course ${selectedCategory}`}
          </h2>
          
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            // Course Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
                <Link 
                  key={course.id}
                  href={`/course/${course.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                >
                  {/* Course Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={getThumbnailUrl(course.thumbnail)}
                      alt={course.title}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/course.png'; // Fallback image
                      }}
                    />
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
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
                          (1190)
                        </span>
                      </div>
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        {formatPrice(course.price)}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4 leading-tight line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Category */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{course.category_name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-[var(--color-text-dark-secondary)]">
                        {course.category_name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // No courses found
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada course ditemukan</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Coba dengan kata kunci yang berbeda' : 'Belum ada course tersedia untuk kategori ini'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}