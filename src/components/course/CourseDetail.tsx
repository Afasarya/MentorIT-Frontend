'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseDetailProps {
  courseId: string;
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState('deskripsi');

  // Mock course data - sesuai dengan design figma
  const course = {
    id: courseId,
    title: 'Website Development dengan Laravel dan React JS',
    subtitle: 'Mempelajari konsep dasar web development',
    description: 'Course Website Development dengan Laravel dan React JS ini hanya mempelajari teknik-teknik juga trik menjadi membuat kamu pada praktis. Ini menceritakan kita untuk praktis mendalami lebih dalam lagi tentang apa yang digunakan untuk membuat web-web yang komplek dan bisa digunakan masyarakat.',
    image: '/images/course.png',
    
    // Stats sesuai design figma
    stats: {
      members: 280,
      level: 'Sulit',
      certificate: true,
      duration: '12 minggu',
      language: 'Indonesia'
    },

    // Price dan CTA
    price: {
      current: 'Rp1.200.000',
      original: null,
      discount: null
    },

    // Untuk siapa course ini
    targetAudience: [
      'Pelajar/Mahasiswa',
      'Pencari Kerja', 
      'Kamu yang ingin switch career',
      'Programmer',
      'Umum'
    ],

    // Apa yang kamu dapatkan
    benefits: [
      'Akses selamanya',
      'Durasi 4 jam',
      'Project dengan impact nyata',
      'Dedikasi 4 jam per minggu',
      'Sertifikat kelulusan'
    ],

    // Detail course sections
    detailSections: {
      'akses-selamanya': { color: 'text-green-500', icon: '✓' },
      'durasi-4-jam': { color: 'text-blue-500', icon: '⏱' },
      'project-impact': { color: 'text-purple-500', icon: '🎯' },
      'dedikasi-per-minggu': { color: 'text-orange-500', icon: '📅' },
      'sertifikat-kelulusan': { color: 'text-red-500', icon: '🏆' }
    },

    // Modules data untuk tab Modul
    modules: [
      {
        id: 1,
        title: 'Dasar Pemrograman Web & Tools Set-up',
        lessons: [
          { name: 'Preparation Tools', duration: '12:00' },
          { name: 'Pengenalan konsep client, server dan arsitektur fullstack', duration: '24:32' },
          { name: 'HTML, CSS, dan JavaScript untuk antauka berbahan hian web', duration: '15:00' },
          { name: 'Instalasi environment (PCIP) Composer, Laravel, Node.js, NPM/Yarn', duration: '20:10' }
        ]
      },
      {
        id: 2,
        title: 'Backend Development dengan Laravel'
      },
      {
        id: 3,
        title: 'Frontend Development dengan React.js'
      }
    ],

    // Mentor info
    mentor: {
      name: 'Jennifer Coolhan',
      role: 'Web Developer', 
      image: '/images/mentors/mentors-1.svg',
      experience: '5+ years',
      students: '2,500+',
      rating: 4.8
    },

    // Ratings & Reviews
    rating: {
      overall: 4.8,
      totalReviews: 1190,
      breakdown: {
        5: 80,
        4: 15,
        3: 3,
        2: 1,
        1: 1
      }
    },

    reviews: [
      {
        id: 1,
        author: 'Jane Cooper',
        role: 'Web Developer',
        rating: 5,
        comment: 'Aku jadi punya pengalaman sistem, langsung sama orang yang kubantu langsung sama cara yang kubantu waktu buat projek akhir',
        avatar: 'JC'
      },
      {
        id: 2,
        author: 'Jane Cooper', 
        role: 'Web Developer',
        rating: 5,
        comment: 'Aku jadi punya pengalaman sistem, langsung sama orang yang kubantu langsung sama cara yang kubantu waktu buat projek akhir',
        avatar: 'JC'
      }
    ]
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-16">
        
        {/* Course Header Section - Dibungkus border putih terpisah */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 mb-8 shadow-sm border border-gray-100">
          <div className="text-center">
            {/* Course Title - Center */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-dark-primary)] mb-6 leading-tight max-w-4xl mx-auto">
              {course.title}
            </h1>
            
            {/* Course Subtitle - Center */}
            <p className="text-lg sm:text-xl text-[var(--color-text-dark-secondary)] mb-12 leading-relaxed max-w-2xl mx-auto">
              {course.subtitle}
            </p>

            {/* Stats Row - Full width spacing sesuai Figma */}
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-12">
              
              {/* Member Count */}
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">Member</p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xl font-bold text-[var(--color-text-dark-primary)]">{course.stats.members}</span>
                  <span className="text-sm text-[var(--color-text-dark-secondary)]">aktif</span>
                </div>
              </div>

              {/* Level dengan bar chart icon 3 tingkat sesuai Figma */}
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">Level</p>
                <div className="flex items-center justify-center space-x-2">
                  {/* Bar Chart Icon 3 tingkat - hanya ungu */}
                  <div className="flex items-end space-x-1">
                    <div className="w-2 h-4 bg-purple-600 rounded-sm"></div>
                    <div className="w-2 h-6 bg-purple-600 rounded-sm"></div>
                    <div className="w-2 h-5 bg-purple-600 rounded-sm"></div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-text-dark-primary)]">{course.stats.level}</span>
                </div>
              </div>

              {/* Sertifikat dengan icon sesuai Figma */}
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">Sertifikat</p>
                <div className="flex items-center justify-center space-x-2">
                  {/* Certificate Check Icon ungu */}
                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-[var(--color-text-dark-primary)]">Ya</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Content Section - Dibungkus border putih terpisah */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              
              {/* Course Image */}
              <div className="mb-8">
                <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'deskripsi', label: 'Deskripsi' },
                      { id: 'modul', label: 'Modul' },
                      { id: 'mentor', label: 'Mentor' },
                      { id: 'rating', label: 'Rating' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                          activeTab === tab.id
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-[var(--color-text-dark-secondary)] hover:text-[var(--color-text-dark-primary)]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                
                {/* Deskripsi Tab */}
                {activeTab === 'deskripsi' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-6">
                      Deskripsi Course
                    </h2>
                    <p className="text-[var(--color-text-dark-secondary)] leading-relaxed text-base">
                      {course.description}
                    </p>
                  </div>
                )}

                {/* Modul Tab */}
                {activeTab === 'modul' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-6">
                      Modul
                    </h2>
                    
                    {course.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center space-x-4">
                            <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                              {module.id}
                            </span>
                            <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)]">
                              {module.title}
                            </h3>
                          </div>
                        </div>
                        
                        {module.lessons && (
                          <div className="px-6 py-4">
                            <div className="space-y-3">
                              {module.lessons.map((lesson, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                      <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <span className="text-[var(--color-text-dark-secondary)]">{lesson.name}</span>
                                  </div>
                                  <span className="text-sm text-[var(--color-text-dark-tertiary)]">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Mentor Tab */}
                {activeTab === 'mentor' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-6">
                      Mentor
                    </h2>
                    
                    {/* Single Mentor Card - Positioned at left, below title */}
                    <div className="flex justify-start">
                      <div className="w-64 h-80 rounded-2xl overflow-hidden relative">
                        {/* Mentor Image */}
                        <Image
                          src={course.mentor.image}
                          alt={course.mentor.name}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Name and Role Overlay - Bottom positioned like Mentors.tsx */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white rounded-xl px-3 py-2 border-2 border-white shadow-sm">
                            <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-1">
                              {course.mentor.name}
                            </h3>
                            <p className="text-sm text-[var(--color-text-dark-secondary)]">
                              {course.mentor.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating Tab */}
                {activeTab === 'rating' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-dark-primary)] mb-6">
                      Apa Kata Mereka?
                    </h2>

                    {/* Reviews Grid - 2 columns sesuai Testimonials.tsx */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {course.reviews.map((review) => (
                        <div key={review.id} className="relative">
                          {/* Purple Left Border - sesuai Testimonials.tsx */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-l"></div>
                          
                          {/* Review Card Content */}
                          <div className="pl-6 py-4">
                            {/* Rating Stars - At the very top */}
                            <div className="flex items-center space-x-1 mb-4">
                              {[...Array(review.rating)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>

                            {/* Quote Icon */}
                            <div className="mb-4">
                              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                                <path d="M15.583 17.321c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                              </svg>
                            </div>

                            {/* Comment */}
                            <p className="text-[var(--color-text-dark-secondary)] mb-6 leading-relaxed">
                              {review.comment}
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">{review.avatar}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[var(--color-text-dark-primary)]">
                                  {review.author}
                                </p>
                                <p className="text-xs text-[var(--color-text-dark-tertiary)]">
                                  {review.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More Button - sesuai Testimonials.tsx */}
                    <div className="text-center">
                      <button className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-medium rounded-full transition-all duration-200 text-sm">
                        Load More
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
                            d="M19 9l-7 7-7-7" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Setiap section dibungkus border putih terpisah */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Price and CTA Section - Top of sidebar sesuai Figma */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">Harga</p>
                  <div className="text-3xl font-bold text-[var(--color-text-dark-primary)] mb-4">
                    {course.price.current}
                  </div>
                  <Link 
                    href={`/course/${courseId}/checkout`}
                    className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition-colors text-base block text-center"
                  >
                    Beli Sekarang
                  </Link>
                </div>
              </div>
              
              {/* Untuk siapa course ini? - Section terpisah */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">
                  Untuk siapa course ini?
                </h3>
                <ul className="space-y-3">
                  {course.targetAudience.map((audience, index) => (
                    <li key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      {/* Purple checkmark circle - KONSISTEN sesuai Figma */}
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[var(--color-text-dark-secondary)] text-sm">{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apa yang Kamu Dapatkan? - Section terpisah dengan border items */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">
                  Apa yang Kamu Dapatkan?
                </h3>
                <ul className="space-y-0">
                  {[
                    { text: 'Portofolio dari projek yang berdampak positif untuk masyarakat.' },
                    { text: 'Sertifikat Kelulusan' },
                    { text: 'Badge' }
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3 p-4 border-b border-gray-200 last:border-b-0">
                      {/* Purple checkmark circle - KONSISTEN sesuai Figma */}
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[var(--color-text-dark-secondary)] text-sm leading-relaxed">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detail Course - Section terpisah dengan layout list dan icons yang konsisten */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">
                  Detail Course
                </h3>
                
                <ul className="space-y-0">
                  {[
                    { text: 'Akses selamanya' },
                    { text: 'Durasi 4 jam' },
                    { text: 'Projek dengan impact nyata' },
                    { text: 'Diskusi grup' },
                    { text: 'Sertifikat kelulusan' }
                  ].map((detail, index) => (
                    <li key={index} className="flex items-center space-x-3 p-4 border-b border-gray-200 last:border-b-0">
                      {/* Green checkmark circle - KONSISTEN sesuai Figma */}
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[var(--color-text-dark-secondary)] text-sm">{detail.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}