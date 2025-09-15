'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient, Class, ClassCategory, UpdateClassRequest } from '@/lib/api';

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_name: '',
    price: '',
    trailer: '',
    thumbnail: null as File | null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchInitialData();
  }, [resolvedParams.id]);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const classId = parseInt(resolvedParams.id);
      
      const [classResponse, categoriesResponse] = await Promise.all([
        apiClient.getClass(classId),
        apiClient.getClassCategories()
      ]);
      
      const classData = classResponse.data;
      if (classData) {
        setFormData({
          title: classData.title,
          description: classData.description,
          category_name: classData.category_name,
          price: classData.price.toString(),
          trailer: classData.trailer,
          thumbnail: null
        });
        
        // Set thumbnail preview if exists
        if (classData.thumbnail) {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
          const thumbnailUrl = classData.thumbnail.startsWith('http') 
            ? classData.thumbnail 
            : `${API_BASE_URL}/${classData.thumbnail}`;
          setThumbnailPreview(thumbnailUrl);
        }
      }
      
      setCategories(categoriesResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setInitialLoading(false);
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

    // Price validation
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
      setLoading(true);
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
      };

      // Only include thumbnail if a new one was selected
      if (formData.thumbnail) {
        updateData.thumbnail = formData.thumbnail;
      }

      console.log('Updating course data:', {
        ...updateData,
        thumbnail: updateData.thumbnail?.name
      });

      await apiClient.updateClass(parseInt(resolvedParams.id), updateData);
      router.push('/admin/courses');
    } catch (err) {
      console.error('Update course error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <AdminLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course data...</p>
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
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/admin/courses/${resolvedParams.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
              <p className="text-gray-600 mt-1">Update course details and information</p>
            </div>
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-gray-900 ${
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none text-gray-900 ${
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-gray-900 ${
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-gray-900 ${
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-gray-900 ${
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
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Thumbnail Upload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-900 mb-2">
                        Update Image (Optional)
                      </label>
                      <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-gray-900 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      {errors.thumbnail && (
                        <p className="text-red-600 text-sm mt-1">{errors.thumbnail}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        JPG, PNG up to 5MB. Leave empty to keep current image.
                      </p>
                    </div>

                    {/* Thumbnail Preview */}
                    {thumbnailPreview && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Current/Preview</p>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {loading ? (
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
                      href={`/admin/courses/${resolvedParams.id}`}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
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
      </AdminLayout>
    </ProtectedRoute>
  );
}