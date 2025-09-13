'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState('web-development');

  const categories = [
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

  const courses = [
    {
      id: 1,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      category: 'web-development'
    },
    {
      id: 2,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      category: 'web-development'
    },
    {
      id: 3,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      category: 'web-development'
    },
    {
      id: 4,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      category: 'web-development'
    },
    {
      id: 5,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      category: 'web-development'
    },
    {
      id: 6,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      category: 'web-development'
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
          
          {/* Category Tabs - Responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-4 px-6 sm:px-7 py-4 sm:py-5 rounded-2xl border-2 transition-all duration-200 w-full ${
                  selectedCategory === category.id
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'bg-white border-gray-200 hover:border-[var(--color-primary)] text-[var(--color-text-dark-primary)]'
                }`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedCategory === category.id ? 'bg-white/20' : category.color
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

        {/* Paling Diminati Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-8">
            Paling Diminati
          </h2>
          
          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <Link 
                key={course.id}
                href={`/course/${course.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                        {course.rating}
                      </span>
                      <span className="text-sm text-[var(--color-text-dark-tertiary)]">
                        ({course.reviewCount})
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                      {course.price}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4 leading-tight line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">JC</span>
                    </div>
                    <span className="text-sm text-[var(--color-text-dark-secondary)]">
                      {course.instructor}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-[var(--color-text-dark-primary)] hover:bg-[var(--color-primary)] text-white font-medium rounded-full transition-all duration-200">
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
          </button>
        </div>
      </div>
    </div>
  );
}