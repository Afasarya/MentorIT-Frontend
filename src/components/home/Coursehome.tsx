'use client';

import Image from 'next/image';

export default function Coursehome() {
  const courses = [
    {
      id: 1,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      instructorAvatar: '/images/hero/hero-avatars.png'
    },
    {
      id: 2,
      image: '/images/course.png',
      rating: 4.6,
      reviewCount: 952,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      instructorAvatar: '/images/hero/hero-avatars.png'
    },
    {
      id: 3,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 890,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      instructorAvatar: '/images/hero/hero-avatars.png'
    },
    {
      id: 4,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 1190,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      instructorAvatar: '/images/hero/hero-avatars.png'
    },
    {
      id: 5,
      image: '/images/course.png',
      rating: 4.6,
      reviewCount: 952,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      instructorAvatar: '/images/hero/hero-avatars.png'
    },
    {
      id: 6,
      image: '/images/course.png',
      rating: 4.8,
      reviewCount: 890,
      price: 'Rp1.200.000',
      title: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      instructorAvatar: '/images/hero/hero-avatars.png'
    }
  ];

  return (
    <section className="bg-[#f5f4fe] py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header - Left aligned typography with right search */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12">
          {/* Left Content */}
          <div className="lg:max-w-xl mb-8 lg:mb-0">
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
          </div>

          {/* Right Search Component */}
          <div className="lg:mt-12">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Cari"
                className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid - Better typography sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group w-full"
            >
              {/* Course Image - Wider aspect ratio */}
              <div className="relative overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={450}
                  height={280}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-3 leading-tight">
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
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <button className="inline-flex items-center px-8 py-3 bg-[var(--color-text-dark-primary)] hover:bg-gray-800 text-white font-medium rounded-full transition-colors duration-200 text-sm">
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
    </section>
  );
}