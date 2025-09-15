'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

interface Module {
  id: number;
  title: string;
  description: string;
  class_id: number;
  created_at: string;
  updated_at: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details
      const courseResponse = await fetch(`${API_BASE_URL}/api/classes/${courseId}`);
      if (!courseResponse.ok) {
        throw new Error('Course not found');
      }
      const courseData = await courseResponse.json();
      setCourse(courseData.data);

      // Fetch course modules
      const modulesResponse = await fetch(`${API_BASE_URL}/api/modules/class/${courseId}`);
      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json();
        setModules(modulesData.data || []);
      }

    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course details');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="w-full h-64 bg-gray-200 rounded-xl mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="bg-gray-100 p-6 rounded-xl">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Course tidak ditemukan</h1>
          <p className="text-gray-500 mb-6">{error || 'Course yang Anda cari tidak tersedia'}</p>
          <Link 
            href="/course"
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
          >
            Kembali ke Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
          <span>/</span>
          <Link href="/course" className="hover:text-[var(--color-primary)]">Course</Link>
          <span>/</span>
          <span className="text-gray-900">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Image */}
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6">
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

            {/* Course Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium rounded-full">
                  {course.category_name}
                </span>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-gray-500">(1,190 reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-gray-600 leading-relaxed mb-6">
                {course.description}
              </p>
            </div>

            {/* Course Modules */}
            {modules.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Materi Course</h2>
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div key={module.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-[var(--color-primary)]/30 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-xl sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                  {formatPrice(course.price)}
                </div>
                <p className="text-sm text-gray-600">Akses selamanya</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Akses selamanya</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{modules.length} Modul pembelajaran</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Sertifikat kelulusan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Diskusi dengan mentor</span>
                </div>
              </div>

              <button className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 px-6 rounded-full hover:bg-[var(--color-primary)]/90 transition-colors mb-4">
                Beli Sekarang
              </button>

              <button className="w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold py-3 px-6 rounded-full hover:bg-[var(--color-primary)]/5 transition-colors">
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}