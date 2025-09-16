'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiClient, ClassCategory, CreateCategoryRequest, UpdateCategoryRequest } from '@/lib/api';

interface CategoryFormData {
  name: string;
  description: string;
  icon: File | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ClassCategory | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getClassCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: null });
    setIconPreview(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Category description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!showEditModal && !formData.icon) {
      errors.icon = 'Category icon is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, icon: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, icon: 'Image size must be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, icon: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setIconPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      
      // Clear icon error
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.icon;
        return newErrors;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!validateForm()) return;
    
    try {
      setFormLoading(true);
      setError(null);
      
      const createData: CreateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon!
      };
      
      await apiClient.createClassCategory(createData);
      
      setSuccess('Category created successfully!');
      setShowCreateModal(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory || !validateForm()) return;
    
    try {
      setFormLoading(true);
      setError(null);
      
      const updateData: UpdateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };
      
      if (formData.icon) {
        updateData.icon = formData.icon;
      }
      
      await apiClient.updateClassCategory(selectedCategory.id, updateData);
      
      setSuccess('Category updated successfully!');
      setShowEditModal(false);
      resetForm();
      setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      setFormLoading(true);
      setError(null);
      
      await apiClient.deleteClassCategory(selectedCategory.id);
      
      setSuccess('Category deleted successfully!');
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setFormLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (category: ClassCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: null
    });
    
    // Set current icon as preview if it exists
    if (category.icon) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const iconUrl = category.icon.startsWith('http') ? category.icon : `${API_BASE_URL}/${category.icon}`;
      setIconPreview(iconUrl);
    }
    
    setShowEditModal(true);
  };

  const openDeleteModal = (category: ClassCategory) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    resetForm();
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconUrl = (iconPath: string) => {
    if (iconPath.startsWith('http')) return iconPath;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    return `${API_BASE_URL}/${iconPath}`;
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading categories...</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600 mt-1">Create and manage course categories</p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium py-2 px-4 rounded-xl transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>

          {/* Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search categories by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none text-gray-900"
                />
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                <span className="text-sm text-gray-600">
                  Total: {categories.length}
                </span>
              </div>
            </div>

            <div className="p-6">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
                  <p className="text-gray-600 mb-6">
                    {categories.length === 0 
                      ? "Get started by creating your first category" 
                      : "No categories match your search criteria"}
                  </p>
                  {categories.length === 0 && (
                    <button
                      onClick={openCreateModal}
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium py-2 px-4 rounded-xl transition-colors inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create First Category
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-4">
                            {category.icon ? (
                              <Image
                                src={getIconUrl(category.icon)}
                                alt={category.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">ID: {category.id}</p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{category.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {category.created_at && (
                            <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm font-medium py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(category)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Category</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter category name"
                    />
                    {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none resize-none ${
                        formErrors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter category description"
                    />
                    {formErrors.description && <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Icon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="icon"
                      accept="image/*"
                      onChange={handleIconChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none ${
                        formErrors.icon ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.icon && <p className="text-red-600 text-sm mt-1">{formErrors.icon}</p>}
                    {iconPreview && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <Image 
                          src={iconPreview} 
                          alt="Icon preview" 
                          width={64} 
                          height={64} 
                          className="object-cover rounded-lg" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeModals}
                    disabled={formLoading}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCategory}
                    disabled={formLoading}
                    className="px-6 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Category'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Category</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter category name"
                    />
                    {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none resize-none ${
                        formErrors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter category description"
                    />
                    {formErrors.description && <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-icon" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Icon
                    </label>
                    <input
                      type="file"
                      id="edit-icon"
                      accept="image/*"
                      onChange={handleIconChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none ${
                        formErrors.icon ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.icon && <p className="text-red-600 text-sm mt-1">{formErrors.icon}</p>}
                    <p className="text-sm text-gray-500 mt-1">Leave empty to keep current icon</p>
                    {iconPreview && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {formData.icon ? 'New Icon Preview:' : 'Current Icon:'}
                        </p>
                        <Image 
                          src={iconPreview} 
                          alt="Icon preview" 
                          width={64} 
                          height={64} 
                          className="object-cover rounded-lg" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeModals}
                    disabled={formLoading}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCategory}
                    disabled={formLoading}
                    className="px-6 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Category'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && selectedCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Category</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the category &ldquo;<strong>{selectedCategory.name}</strong>&rdquo;? 
                  This action cannot be undone and may affect courses in this category.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModals}
                    disabled={formLoading}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCategory}
                    disabled={formLoading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete Category'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}