'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function Coursehome() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/classes`);
      if (response.ok) {
        const data = await response.json();
        // Show only first 6 courses for homepage
        setCourses((data.data || []).slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

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
    return `${API_BASE_URL}/uploads/${thumbnail}`;
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-[#f5f4fe] py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header - Left aligned typography with right search */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:max-w-xl mb-8 lg:mb-0"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-[var(--color-primary)] rounded-full mb-4">
              <span className="text-[var(--color-primary)] text-sm font-medium">
                #CourseUntukmu
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-dark-primary)] mb-3 leading-tight">
              Pilih Course Favoritmu
            </h2>
            
            <p className="text-base sm:text-lg text-[var(--color-text-dark-secondary)] leading-relaxed">
              Bergabung dengan course untuk ciptakan portofolio yang berdampak
            </p>
          </motion.div>

          {/* Right Search Component */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:mt-12"
          >
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Cari"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Course Grid - Better typography sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link
                  href={`/course/${course.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group w-full cursor-pointer block"
                >
                  {/* Course Image - Wider aspect ratio */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={getThumbnailUrl(course.thumbnail)}
                      alt={course.title}
                      width={450}
                      height={280}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/course.png'; // Fallback image
                      }}
                    />
                  </div>

                  {/* Course Content */}
                  <div className="p-5">
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
                    <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-3 leading-tight line-clamp-2">
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
              </motion.div>
            ))
          ) : (
            // No courses found
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada course ditemukan</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Coba dengan kata kunci yang berbeda' : 'Belum ada course tersedia'}
              </p>
            </div>
          )}
        </div>

        {/* View More Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center"
        >
          <Link 
            href="/course"
            className="inline-flex items-center px-8 py-3 bg-[var(--color-text-dark-primary)] hover:bg-gray-800 text-white font-medium rounded-full transition-colors duration-200 text-sm"
          >
            Lihat Semuanya
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}