'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiClient, Class, Module } from '@/lib/api';

interface ClassManagementPageProps {
  params: Promise<{ id: string }>;
}

// Add interface for module item data
interface ModuleItemData {
  title?: string;
  [key: string]: unknown;
}

export default function ClassManagementPage({ params }: ClassManagementPageProps) {
  const resolvedParams = React.use(params);
  const [classData, setClassData] = useState<Class | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [creatingModule, setCreatingModule] = useState(false);

  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true);
      const classId = parseInt(resolvedParams.id);
      
      const [classResponse, modulesResponse] = await Promise.all([
        apiClient.getClass(classId),
        apiClient.getModules(classId)
      ]);
      
      setClassData(classResponse.data || null);
      setModules(modulesResponse.data || []);
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch class data');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchClassData();
    }
  }, [resolvedParams.id, fetchClassData]);

  // Auto clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto clear error message  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) {
      setError('Module title is required');
      return;
    }

    // Prevent multiple submissions
    if (creatingModule) {
      return;
    }

    try {
      setCreatingModule(true);
      setError(null);
      
      console.log('Creating module with title:', newModuleTitle.trim());
      
      const response = await apiClient.createModule({
        title: newModuleTitle.trim(),
        class_id: parseInt(resolvedParams.id)
      });

      console.log('Module creation response:', response);

      if (response.data || response.message) {
        // Give a small delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Close modal and reset form first
        setShowCreateModuleModal(false);
        setNewModuleTitle('');
        setError(null);
        
        // Show success message
        setSuccess('Module created successfully!');
        
        // Refresh modules list
        await fetchClassData();
        
        console.log('Module created successfully');
      }
    } catch (err) {
      console.error('Create module error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create module');
    } finally {
      setCreatingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Are you sure you want to delete this module? All content will be deleted.')) {
      return;
    }

    try {
      await apiClient.deleteModule(moduleId.toString());
      setModules(modules.filter(m => m.id !== moduleId));
      if (expandedModule === moduleId) {
        setExpandedModule(null);
      }
      setSuccess('Module deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete module');
    }
  };

  const toggleModuleExpansion = async (moduleId: number) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
      // Fetch module items when expanding
      try {
        const response = await apiClient.getModuleItems(moduleId.toString());
        const moduleItems = response.data || [];
        
        // Update the module with its items
        setModules(prev => prev.map(module => 
          module.id === moduleId 
            ? { ...module, module_item: moduleItems }
            : module
        ));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch module items');
      }
    }
  };

  const getItemTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'submodule':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'project':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2-2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getItemTypeLabel = (itemType: string) => {
    switch (itemType) {
      case 'submodule': return 'Lesson';
      case 'quiz': return 'Quiz';
      case 'project': return 'Project';
      default: return 'Item';
    }
  };

  const getItemTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'submodule': return 'text-blue-600 bg-blue-50';
      case 'quiz': return 'text-green-600 bg-green-50';
      case 'project': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <AdminLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading class...</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (!classData) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <AdminLayout>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Class Not Found</h3>
              <p className="text-gray-600 mb-6">
                The class you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
              <Link
                href="/admin/courses"
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Back to Classes
              </Link>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href="/admin/courses"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{classData.title}</h1>
                <p className="text-gray-600 mt-1">
                  {classData.category_name} • {classData.formatted_price} 
                  {classData.level && ` • ${classData.level}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/courses/${classData.id}/edit`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Edit Class
              </Link>
              <button
                onClick={() => setShowCreateModuleModal(true)}
                disabled={creatingModule}
                className="bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl transition-colors inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Module
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            </div>
          )}

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

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[{ id: 'overview', label: 'Overview', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { id: 'modules', label: 'Modules', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2-2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#6366F1] text-[#6366F1]'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Class Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="text-gray-900 mt-1">{classData.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <p className="text-gray-900 mt-1">{classData.category_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Price</label>
                        <p className="text-gray-900 mt-1">{classData.formatted_price}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Level</label>
                        <p className="text-gray-900 mt-1">{classData.level || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Members</label>
                        <p className="text-gray-900 mt-1">{classData.member_count || 0}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Trailer URL</label>
                      <p className="text-gray-900 mt-1 break-all">{classData.trailer}</p>
                    </div>
                    
                    {/* New fields */}
                    {classData.target_audience && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Target Audience</label>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{classData.target_audience}</p>
                      </div>
                    )}
                    
                    {classData.benefits && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Benefits</label>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{classData.benefits}</p>
                      </div>
                    )}
                    
                    {classData.course_details && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Course Details</label>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{classData.course_details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Modules</span>
                      <span className="font-semibold text-gray-900">{modules.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-semibold text-gray-900">
                        {modules.reduce((total, module) => total + (module.module_item?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Enrolled Students</span>
                      <span className="font-semibold text-gray-900">{classData.member_count || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCreateModuleModal(true)}
                      disabled={creatingModule}
                      className="w-full bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl transition-colors"
                    >
                      Add New Module
                    </button>
                    <Link
                      href={`/course/${classData.id}`}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl transition-colors block text-center"
                    >
                      Preview Class
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-6">
              {/* Modules List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Course Modules</h2>
                    <button
                      onClick={() => setShowCreateModuleModal(true)}
                      disabled={creatingModule}
                      className="bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl transition-colors inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Module
                    </button>
                  </div>
                </div>

                <div className="p-0">
                  {modules.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2-2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                      <p className="text-gray-600 mb-4">
                        Start building your course by adding the first module.
                      </p>
                      <button
                        onClick={() => setShowCreateModuleModal(true)}
                        disabled={creatingModule}
                        className="bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-xl transition-colors"
                      >
                        Create First Module
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {modules.map((module) => (
                        <div key={module.id} className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleModuleExpansion(module.id)}
                                className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg 
                                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedModule === module.id ? 'rotate-90' : ''}`}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Module {module.order}: {module.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {module.module_item?.length || 0} items
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/courses/${classData.id}/modules/${module.id}`}
                                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-colors"
                              >
                                Manage
                              </Link>
                              <button
                                onClick={() => handleDeleteModule(module.id)}
                                className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-1.5 px-3 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Module Items */}
                          {expandedModule === module.id && (
                            <div className="ml-8 space-y-3">
                              {module.module_item && module.module_item.length > 0 ? (
                                module.module_item.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                      <div className={`p-2 rounded-lg mr-3 ${getItemTypeColor(item.item_type)}`}>
                                        {getItemTypeIcon(item.item_type)}
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {(item.data as unknown as ModuleItemData)?.title || 'Untitled'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {getItemTypeLabel(item.item_type)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium text-gray-500">
                                        Order: {item.order}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-6 text-gray-600">
                                  <p>No content items in this module yet.</p>
                                  <Link
                                    href={`/admin/courses/${classData.id}/modules/${module.id}`}
                                    className="text-[#6366F1] hover:underline text-sm mt-2 inline-block"
                                  >
                                    Add content to this module
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Create Module Modal */}
          {showCreateModuleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-modal-enter">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Create New Module</h3>
                  <button
                    onClick={() => {
                      if (!creatingModule) {
                        setShowCreateModuleModal(false);
                        setNewModuleTitle('');
                        setError(null);
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    disabled={creatingModule}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Module Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => {
                      setNewModuleTitle(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. Introduction to React Components"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none text-gray-900 placeholder-gray-500 bg-white transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={creatingModule}
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newModuleTitle.trim() && !creatingModule) {
                        handleCreateModule();
                      }
                    }}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Enter a descriptive title for your module
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModuleModal(false);
                      setNewModuleTitle('');
                      setError(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={creatingModule}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateModule}
                    disabled={!newModuleTitle.trim() || creatingModule}
                    className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center min-w-[140px]"
                  >
                    {creatingModule ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Module
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add CSS animations */}
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

          @keyframes modal-enter {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          .animate-modal-enter {
            animation: modal-enter 0.2s ease-out;
          }
        `}</style>
      </AdminLayout>
    </ProtectedRoute>
  );
}