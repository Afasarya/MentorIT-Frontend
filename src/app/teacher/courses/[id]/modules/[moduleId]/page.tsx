'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import TeacherLayout from '@/components/teacher/TeacherLayout';
import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { apiClient, Module, ModuleItem, Quiz } from '@/lib/api';

interface ModuleManagementPageProps {
  params: Promise<{ 
    id: string;
    moduleId: string;
  }>;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  order: number;
}

// Interface for module item data to replace 'any'
interface ModuleItemData {
  title?: string;
  description?: string;
  content?: string;
  questions?: QuizQuestion[];
  guide?: string;
}

export default function ModuleManagementPage({ params }: ModuleManagementPageProps) {
  const { id, moduleId } = use(params); // Unwrap params Promise
  
  const [module, setModule] = useState<Module | null>(null);
  const [moduleItems, setModuleItems] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [creatingItem, setCreatingItem] = useState(false);
  
  // Form states for different content types
  const [subModuleForm, setSubModuleForm] = useState({
    title: '',
    description: '',
    content: '',
    youtube_url: ''
  });
  
  const [quizForm, setQuizForm] = useState({
    title: '',
    questions: [] as QuizQuestion[]
  });
  
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    guide: ''
  });

  const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    order: 1
  });

  const fetchModuleData = useCallback(async () => {
    try {
      setLoading(true);
      const [moduleResponse, itemsResponse] = await Promise.all([
        apiClient.getModule(moduleId),
        apiClient.getModuleItems(moduleId)
      ]);
      
      setModule(moduleResponse.data || null);
      setModuleItems(itemsResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch module data');
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    if (moduleId) {
      fetchModuleData();
    }
  }, [moduleId, fetchModuleData]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateSubModule = async () => {
    if (!subModuleForm.title || !subModuleForm.description || !subModuleForm.content) {
      setError('All fields are required for SubModule');
      return;
    }

    try {
      setCreatingItem(true);
      setError(null);
      
      const response = await apiClient.createModuleItem({
        module_id: parseInt(moduleId),
        item_type: 'submodule',
        title: subModuleForm.title,
        description: subModuleForm.description,
        content: subModuleForm.content,
        youtube_url: subModuleForm.youtube_url
      });

      if (response.data) {
        await fetchModuleData();
        setActiveModal(null);
        setSubModuleForm({ title: '', description: '', content: '', youtube_url: '' });
        setSuccess('Lesson created successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create submodule');
    } finally {
      setCreatingItem(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizForm.title.trim()) {
      setError('Quiz title is required');
      return;
    }

    if (quizForm.questions.length === 0) {
      setError('At least one question is required');
      return;
    }

    // Validate all questions
    for (const q of quizForm.questions) {
      if (!q.question || q.options.some(opt => !opt.trim()) || !q.answer) {
        setError('All question fields must be filled');
        return;
      }
    }

    try {
      setCreatingItem(true);
      setError(null);
      
      const response = await apiClient.createModuleItem({
        module_id: parseInt(moduleId),
        item_type: 'quiz',
        title: quizForm.title,
        questions: quizForm.questions
      });

      if (response.data) {
        await fetchModuleData();
        setActiveModal(null);
        setQuizForm({ title: '', questions: [] });
        setSuccess('Quiz created successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setCreatingItem(false);
    }
  };

  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      setError('Project title and description are required');
      return;
    }

    try {
      setCreatingItem(true);
      setError(null);
      
      const response = await apiClient.createModuleItem({
        module_id: parseInt(moduleId),
        item_type: 'project',
        title: projectForm.title,
        description: projectForm.description,
        guide: projectForm.guide
      });

      if (response.data) {
        await fetchModuleData();
        setActiveModal(null);
        setProjectForm({ title: '', description: '', guide: '' });
        setSuccess('Project created successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setCreatingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await apiClient.deleteModuleItem(itemId);
      await fetchModuleData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const addQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt.trim()) || !newQuestion.answer) {
      setError('Please fill all question fields');
      return;
    }

    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion, order: prev.questions.length + 1 }]
    }));
    
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      answer: '',
      order: quizForm.questions.length + 2
    });
    setError(null);
  };

  const removeQuestion = (index: number) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }))
    }));
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return null;
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
      <ProtectedRoute allowedRoles={['teacher']}>
        <TeacherLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c42e5] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading module...</p>
              </div>
            </div>
          </div>
        </TeacherLayout>
      </ProtectedRoute>
    );
  }

  if (!module) {
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Module Not Found</h3>
              <p className="text-gray-600 mb-6">
                The module you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
              <Link
                href={`/teacher/courses/${id}`}
                className="bg-gradient-to-r from-[#7c42e5] to-purple-600 text-white font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Back to Class
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href={`/teacher/courses/${id}`}
                className="mr-4 p-2 hover:bg-white rounded-lg transition-colors shadow-sm border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7c42e5] to-purple-600 bg-clip-text text-transparent">
                  Module {module.order}: {module.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage content items for this module
                </p>
              </div>
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

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActiveModal('submodule')}
              className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl p-6 text-left transition-all duration-200 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Add Lesson</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Create a new lesson with text content, descriptions, and learning materials
              </p>
            </button>

            <button
              onClick={() => setActiveModal('quiz')}
              className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl p-6 text-left transition-all duration-200 hover:border-green-300 hover:shadow-md"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Add Quiz</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Create multiple choice questions to test student understanding
              </p>
            </button>

            <button
              onClick={() => setActiveModal('project')}
              className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl p-6 text-left transition-all duration-200 hover:border-purple-300 hover:shadow-md"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Add Project</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Create final project assignments with detailed instructions and guidelines
              </p>
            </button>
          </div>

          {/* Content Items List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Module Content</h2>
                <span className="text-sm text-gray-600">
                  {moduleItems.length} item{moduleItems.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="p-0">
              {moduleItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start building this module by adding lessons, quizzes, or projects.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setActiveModal('submodule')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
                    >
                      Add Lesson
                    </button>
                    <button
                      onClick={() => setActiveModal('quiz')}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
                    >
                      Add Quiz
                    </button>
                    <button
                      onClick={() => setActiveModal('project')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {moduleItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg mr-4 ${getItemTypeColor(item.item_type)}`}>
                            {getItemTypeIcon(item.item_type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {(item.data as ModuleItemData)?.title || 'Untitled'}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  item.item_type === 'submodule' ? 'bg-blue-400' :
                                  item.item_type === 'quiz' ? 'bg-green-400' : 'bg-purple-400'
                                }`}></span>
                                {getItemTypeLabel(item.item_type)}
                              </span>
                              <span>Order: {item.order}</span>
                              {item.item_type === 'quiz' && (item.data as Quiz)?.questions && (
                                <span>{(item.data as Quiz).questions.length} questions</span>
                              )}
                            </div>
                            {(item.data as ModuleItemData)?.description && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {(item.data as ModuleItemData).description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
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

          {/* SubModule Modal */}
          {activeModal === 'submodule' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-enter">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Lesson</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={subModuleForm.title}
                      onChange={(e) => setSubModuleForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Introduction to React Components"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={subModuleForm.description}
                      onChange={(e) => setSubModuleForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of what students will learn"
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={subModuleForm.youtube_url}
                      onChange={(e) => setSubModuleForm(prev => ({ ...prev, youtube_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Optional: Add a video lesson from YouTube
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={subModuleForm.content}
                      onChange={(e) => setSubModuleForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Full lesson content, learning materials, explanations..."
                      rows={8}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setSubModuleForm({ title: '', description: '', content: '', youtube_url: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={creatingItem}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSubModule}
                    disabled={creatingItem}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center min-w-[140px] shadow-lg hover:shadow-xl"
                  >
                    {creatingItem ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Lesson'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Modal */}
          {activeModal === 'quiz' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-modal-enter">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Quiz</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      value={quizForm.title}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. React Components Quiz"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  {/* Existing Questions */}
                  {quizForm.questions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Questions ({quizForm.questions.length})</h4>
                      <div className="space-y-4">
                        {quizForm.questions.map((question, index) => (
                          <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">Question {index + 1}</h5>
                              <button
                                onClick={() => removeQuestion(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-gray-700 mb-2">{question.question}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className={`p-2 rounded ${option === question.answer ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-gray-50'}`}>
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {option === question.answer && <span className="ml-2 text-xs">✓ Correct</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Question */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Add New Question</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Question *
                        </label>
                        <input
                          type="text"
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                          placeholder="Enter your question"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Options *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {newQuestion.options.map((option, index) => (
                            <input
                              key={index}
                              type="text"
                              value={option}
                              onChange={(e) => setNewQuestion(prev => ({
                                ...prev,
                                options: prev.options.map((opt, i) => i === index ? e.target.value : opt)
                              }))}
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-gray-900 placeholder-gray-500"
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Correct Answer *
                        </label>
                        <select
                          value={newQuestion.answer}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, answer: e.target.value }))}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-gray-900"
                        >
                          <option value="">Select correct answer</option>
                          {newQuestion.options.map((option, index) => (
                            <option key={index} value={option} disabled={!option.trim()}>
                              {String.fromCharCode(65 + index)}. {option || '(Empty)'}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        onClick={addQuestion}
                        className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setQuizForm({ title: '', questions: [] });
                      setNewQuestion({ question: '', options: ['', '', '', ''], answer: '', order: 1 });
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={creatingItem}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateQuiz}
                    disabled={creatingItem || !quizForm.title.trim() || quizForm.questions.length === 0}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center min-w-[140px] shadow-lg hover:shadow-xl"
                  >
                    {creatingItem ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Quiz'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Project Modal */}
          {activeModal === 'project' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-enter">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Project</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Build a Todo App with React"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what students need to build and accomplish"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Project Guide
                    </label>
                    <textarea
                      value={projectForm.guide}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, guide: e.target.value }))}
                      placeholder="Step-by-step instructions, requirements, submission guidelines..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setProjectForm({ title: '', description: '', guide: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={creatingItem}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProject}
                    disabled={creatingItem}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center min-w-[140px] shadow-lg hover:shadow-xl"
                  >
                    {creatingItem ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Project'
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
      </TeacherLayout>
    </ProtectedRoute>
  );
}