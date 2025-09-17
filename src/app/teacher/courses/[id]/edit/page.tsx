'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import TeacherLayout from '@/components/teacher/TeacherLayout';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient, Class, ClassCategory, UpdateClassRequest } from '@/lib/api';
import { getThumbnailUrl } from '@/lib/helpers';

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Class | null>(null);
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_name: '',
    price: '',
    trailer: '',
    level: '',
    target_audience: '',
    benefits: '',
    course_details: '',
    thumbnail: null as File | null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseResponse, categoriesResponse] = await Promise.all([
        apiClient.getClass(id),
        apiClient.getClassCategories()
      ]);
      
      const courseData = courseResponse.data;
      if (courseData) {
        setCourse(courseData);
        setCategories(categoriesResponse.data || []);
        
        // Populate form with existing data
        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          category_name: courseData.category_name || '',
          price: courseData.price?.toString() || '',
          trailer: courseData.trailer || '',
          level: courseData.level || '',
          target_audience: courseData.target_audience || '',
          benefits: courseData.benefits || '',
          course_details: courseData.course_details || '',
          thumbnail: null
        });

        // Set thumbnail preview if exists
        if (courseData.thumbnail) {
          setThumbnailPreview(getThumbnailUrl(courseData.thumbnail));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for price field to ensure it's numeric
    if (name === 'price') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, thumbnail: 'Please select an image file' }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, thumbnail: 'File size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, thumbnail: file }));
      setErrors(prev => ({ ...prev, thumbnail: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }

    if (!formData.category_name) {
      newErrors.category_name = 'Please select a category';
    }

    // Improved price validation
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseInt(formData.price, 10);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Please enter a valid positive price';
      } else if (priceNum < 1000) {
        newErrors.price = 'Price must be at least Rp1.000';
      }
    }

    if (!formData.trailer.trim()) {
      newErrors.trailer = 'Trailer URL is required';
    } else if (!isValidUrl(formData.trailer)) {
      newErrors.trailer = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const priceValue = parseInt(formData.price.trim(), 10);
      if (isNaN(priceValue) || priceValue <= 0) {
        setError('Price must be a valid positive integer');
        return;
      }

      // Create the update data object
      const updateData: UpdateClassRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_name: formData.category_name,
        price: priceValue.toString(),
        trailer: formData.trailer.trim(),
        level: formData.level.trim() || undefined,
        target_audience: formData.target_audience.trim() || undefined,
        benefits: formData.benefits.trim() || undefined,
        course_details: formData.course_details.trim() || undefined
      };

      // Only include thumbnail if a new file was selected
      if (formData.thumbnail) {
        updateData.thumbnail = formData.thumbnail;
      }

      console.log('Updating course data:', {
        ...updateData,
        thumbnail: updateData.thumbnail?.name || 'No new thumbnail'
      });

      await apiClient.updateClass(parseInt(id), updateData);
      router.push('/teacher/courses');
    } catch (err) {
      console.error('Update course error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['teacher']}>
        <TeacherLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c42e5] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course...</p>
              </div>
            </div>
          </div>
        </TeacherLayout>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute allowedRoles={['teacher']}>
        <TeacherLayout>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
              <p className="text-gray-600 mb-6">
                The course you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
              <Link
                href="/teacher/courses"
                className="bg-gradient-to-r from-[#7c42e5] to-purple-600 text-white font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Back to Courses
              </Link>
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
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/teacher/courses"
              className="mr-4 p-2 hover:bg-white rounded-lg transition-colors shadow-sm border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7c42e5] to-purple-600 bg-clip-text text-transparent">
                Edit Course
              </h1>
              <p className="text-gray-600 mt-1">Update your course details and settings</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Course Information</h2>
                  
                  <div className="space-y-4">
                    {/* Course Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                        Course Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors text-gray-900 ${
                          errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter course title..."
                      />
                      {errors.title && (
                        <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>

                    {/* Course Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                        Course Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors resize-none text-gray-900 ${
                          errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter course description..."
                      />
                      {errors.description && (
                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* Category and Price Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category */}
                      <div>
                        <label htmlFor="category_name" className="block text-sm font-medium text-gray-900 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category_name"
                          name="category_name"
                          value={formData.category_name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors text-gray-900 ${
                            errors.category_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="" className="text-gray-500">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name} className="text-gray-900">
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.category_name && (
                          <p className="text-red-600 text-sm mt-1">{errors.category_name}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                          Price (Rp) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors text-gray-900 ${
                            errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="299000"
                        />
                        {errors.price && (
                          <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          Enter amount in Rupiah (e.g., 299000 for Rp299.000)
                        </p>
                      </div>
                    </div>

                    {/* Level */}
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-900 mb-2">
                        Level
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors text-gray-900"
                      >
                        <option value="">Select level</option>
                        <option value="Mudah">Mudah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Sulit">Sulit</option>
                      </select>
                    </div>

                    {/* Trailer URL */}
                    <div>
                      <label htmlFor="trailer" className="block text-sm font-medium text-gray-900 mb-2">
                        Trailer URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        id="trailer"
                        name="trailer"
                        value={formData.trailer}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors text-gray-900 ${
                          errors.trailer ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      {errors.trailer && (
                        <p className="text-red-600 text-sm mt-1">{errors.trailer}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        YouTube, Vimeo, or other video platform URL
                      </p>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <label htmlFor="target_audience" className="block text-sm font-medium text-gray-900 mb-2">
                        Target Audience
                      </label>
                      <textarea
                        id="target_audience"
                        name="target_audience"
                        value={formData.target_audience}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors resize-none text-gray-900"
                        placeholder="Who is this course for? (e.g., Beginners, Students, Professionals)"
                      />
                    </div>

                    {/* Benefits */}
                    <div>
                      <label htmlFor="benefits" className="block text-sm font-medium text-gray-900 mb-2">
                        Course Benefits
                      </label>
                      <textarea
                        id="benefits"
                        name="benefits"
                        value={formData.benefits}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors resize-none text-gray-900"
                        placeholder="What will students learn and achieve from this course?"
                      />
                    </div>

                    {/* Course Details */}
                    <div>
                      <label htmlFor="course_details" className="block text-sm font-medium text-gray-900 mb-2">
                        Course Details
                      </label>
                      <textarea
                        id="course_details"
                        name="course_details"
                        value={formData.course_details}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors resize-none text-gray-900"
                        placeholder="Additional course details, requirements, or information"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Current Thumbnail */}
                {thumbnailPreview && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Thumbnail</h3>
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={thumbnailPreview}
                        alt="Current thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Thumbnail Upload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {thumbnailPreview ? 'Update Thumbnail' : 'Course Thumbnail'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-900 mb-2">
                        Upload New Image {!thumbnailPreview && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c42e5]/20 focus:border-[#7c42e5] outline-none transition-colors text-gray-900 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#7c42e5] file:text-white hover:file:bg-purple-600"
                      />
                      {errors.thumbnail && (
                        <p className="text-red-600 text-sm mt-1">{errors.thumbnail}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        JPG, PNG up to 5MB. Recommended: 1280x720px
                        {thumbnailPreview && <br />}
                        {thumbnailPreview && 'Leave empty to keep current thumbnail'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full bg-gradient-to-r from-[#7c42e5] to-purple-600 hover:from-purple-600 hover:to-[#7c42e5] disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating Course...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Update Course
                        </>
                      )}
                    </button>
                    
                    <Link
                      href="/teacher/courses"
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center border border-gray-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Add CSS for animations */}
        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </TeacherLayout>
    </ProtectedRoute>
  );
}