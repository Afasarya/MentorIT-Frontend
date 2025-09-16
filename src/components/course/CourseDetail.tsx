'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface CourseDetailProps {
  courseId: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  formatted_price: string;
  category_name: string;
  level: string;
  target_audience: string;
  benefits: string;
  course_details: string;
  member_count: number;
  trailer: string;
}

interface Module {
  id: number;
  title: string;
  order: number;
  class_id: number;
  module_item?: ModuleItem[];
}

interface ModuleItem {
  id: number;
  module_id: number;
  item_type: 'submodule' | 'quiz' | 'project';
  item_id: number;
  order: number;
  data?: {
    title?: string;
    description?: string;
    content?: string;
  };
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  useEffect(() => {
    fetchCourseData();
    checkEnrollmentStatus();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details
      const courseResponse = await fetch(`${API_BASE_URL}/api/classes/class/${courseId}`);
      if (!courseResponse.ok) {
        throw new Error('Course not found');
      }
      const courseData = await courseResponse.json();
      setCourse(courseData.data);

      // Fetch course modules
      try {
        const modulesResponse = await fetch(`${API_BASE_URL}/api/classes/modules/${courseId}`);
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          const modulesWithItems = await Promise.all(
            (modulesData.data || []).map(async (module: Module) => {
              try {
                const itemsResponse = await fetch(`${API_BASE_URL}/api/classes/item-modules/${module.id}`);
                if (itemsResponse.ok) {
                  const itemsData = await itemsResponse.json();
                  return { ...module, module_item: itemsData.data || [] };
                }
              } catch (err) {
                console.error(`Error fetching items for module ${module.id}:`, err);
              }
              return { ...module, module_item: [] };
            })
          );
          setModules(modulesWithItems);
        }
      } catch (moduleError) {
        console.error('Error fetching modules:', moduleError);
      }

    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      setCheckingEnrollment(true);
      // Check if user is logged in and is a student
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsEnrolled(false);
        return;
      }

      const enrolledResponse = await apiClient.getMyClasses();
      if (enrolledResponse.data) {
        const isUserEnrolled = enrolledResponse.data.some(course => 
          course.id === parseInt(courseId)
        );
        setIsEnrolled(isUserEnrolled);
      }
    } catch (error) {
      console.log('Could not check enrollment status:', error);
      setIsEnrolled(false);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  const getThumbnailUrl = (thumbnail: string) => {
    if (!thumbnail) return '/images/course.png';
    if (thumbnail.startsWith('http')) return thumbnail;
    // Remove "uploads/" prefix if it exists to avoid duplication
    const cleanPath = thumbnail.startsWith('uploads/') ? thumbnail.substring('uploads/'.length) : thumbnail;
    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  // Parse target audience from string to array
  const getTargetAudienceArray = (targetAudience: string) => {
    if (!targetAudience) return ['Pelajar/Mahasiswa', 'Pencari Kerja', 'Kamu yang ingin switch career', 'Programmer', 'Umum'];
    return targetAudience.split('\n').filter(item => item.trim() !== '');
  };

  // Parse benefits from string to array
  const getBenefitsArray = (benefits: string) => {
    if (!benefits) return ['Portofolio dari projek yang berdampak positif untuk masyarakat.', 'Sertifikat Kelulusan', 'Badge'];
    return benefits.split('\n').filter(item => item.trim() !== '');
  };

  // Parse course details from string to array
  const getCourseDetailsArray = (courseDetails: string) => {
    if (!courseDetails) return ['Akses selamanya', 'Durasi 4 jam', 'Projek dengan impact nyata', 'Diskusi grup', 'Sertifikat kelulusan'];
    return courseDetails.split('\n').filter(item => item.trim() !== '');
  };

  const getItemTypeLabel = (itemType: string) => {
    switch (itemType) {
      case 'submodule': return 'Lesson';
      case 'quiz': return 'Quiz';
      case 'project': return 'Project';
      default: return 'Item';
    }
  };

  const getItemTypeDuration = (itemType: string, index: number) => {
    // Mock duration for display purposes
    const durations = ['12:00', '24:32', '15:00', '20:10', '18:45', '22:15', '16:30', '14:20'];
    return durations[index % durations.length] || '15:00';
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="container mx-auto px-4 pt-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f4fe' }}>
        <div className="container mx-auto px-4 pt-20">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-600 mb-2">Course tidak ditemukan</h1>
            <p className="text-gray-500 mb-6">{error || 'Course yang Anda cari tidak tersedia'}</p>
            <Link 
              href="/course"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors"
            >
              Kembali ke Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-16">
        
        {/* Course Header Section - Dibungkus border putih terpisah */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 mb-8 shadow-sm border border-gray-100 relative">
          {/* Enrollment Badge */}
          {isEnrolled && (
            <div className="absolute top-6 right-6">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Sudah Terdaftar</span>
              </div>
            </div>
          )}

          <div className="text-center">
            {/* Course Title - Center */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-dark-primary)] mb-6 leading-tight max-w-4xl mx-auto">
              {course.title}
            </h1>
            
            {/* Course Subtitle - Center */}
            <p className="text-lg sm:text-xl text-[var(--color-text-dark-secondary)] mb-12 leading-relaxed max-w-2xl mx-auto">
              {course.description.substring(0, 100)}...
            </p>

            {/* Stats Row - Full width spacing sesuai Figma */}
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-12">
              
              {/* Member Count */}
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">Member</p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xl font-bold text-[var(--color-text-dark-primary)]">{course.member_count || 0}</span>
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
                  <span className="text-sm font-semibold text-[var(--color-text-dark-primary)]">{course.level || 'Mudah'}</span>
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
                    src={getThumbnailUrl(course.thumbnail)}
                    alt={course.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/course.png';
                    }}
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
                    
                    {modules.length > 0 ? modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center space-x-4">
                            <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                              {module.order}
                            </span>
                            <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)]">
                              {module.title}
                            </h3>
                          </div>
                        </div>
                        
                        {module.module_item && module.module_item.length > 0 && (
                          <div className="px-6 py-4">
                            <div className="space-y-3">
                              {module.module_item.map((item, index) => (
                                <div key={item.id} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                      <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <span className="text-[var(--color-text-dark-secondary)]">
                                      {item.data?.title || `${getItemTypeLabel(item.item_type)} ${item.order}`}
                                    </span>
                                  </div>
                                  <span className="text-sm text-[var(--color-text-dark-tertiary)]">
                                    {getItemTypeDuration(item.item_type, index)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Belum ada modul tersedia untuk course ini.</p>
                      </div>
                    )}
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
                          src="/images/mentors/mentors-1.svg"
                          alt="Course Mentor"
                          fill
                          className="object-cover"
                        />
                        
                        {/* Name and Role Overlay - Bottom positioned like Mentors.tsx */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white rounded-xl px-3 py-2 border-2 border-white shadow-sm">
                            <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-1">
                              Jennifer Coolhan
                            </h3>
                            <p className="text-sm text-[var(--color-text-dark-secondary)]">
                              Web Developer
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
                      {[
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
                      ].map((review) => (
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
                  {!checkingEnrollment && (
                    <>
                      {isEnrolled ? (
                        <>
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-lg font-semibold text-green-600 mb-2">Anda sudah terdaftar!</p>
                            <p className="text-sm text-[var(--color-text-dark-secondary)]">Selamat belajar dan raih sertifikatmu</p>
                          </div>
                          <Link 
                            href={`/course/${courseId}/learn`}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors text-base block text-center"
                          >
                            Mulai Belajar
                          </Link>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">Harga</p>
                          <div className="text-3xl font-bold text-[var(--color-text-dark-primary)] mb-4">
                            {course.formatted_price || `Rp${course.price.toLocaleString('id-ID')}`}
                          </div>
                          <Link 
                            href={`/course/${courseId}/checkout`}
                            className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition-colors text-base block text-center"
                          >
                            Beli Sekarang
                          </Link>
                        </>
                      )}
                    </>
                  )}
                  
                  {checkingEnrollment && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
                      <p className="text-sm text-[var(--color-text-dark-secondary)]">Checking enrollment status...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Untuk siapa course ini? - Section terpisah */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">
                  Untuk siapa course ini?
                </h3>
                <ul className="space-y-3">
                  {getTargetAudienceArray(course.target_audience).map((audience, index) => (
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
                  {getBenefitsArray(course.benefits).map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3 p-4 border-b border-gray-200 last:border-b-0">
                      {/* Purple checkmark circle - KONSISTEN sesuai Figma */}
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[var(--color-text-dark-secondary)] text-sm leading-relaxed">{benefit}</span>
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
                  {getCourseDetailsArray(course.course_details).map((detail, index) => (
                    <li key={index} className="flex items-center space-x-3 p-4 border-b border-gray-200 last:border-b-0">
                      {/* Green checkmark circle - KONSISTEN sesuai Figma */}
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[var(--color-text-dark-secondary)] text-sm">{detail}</span>
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