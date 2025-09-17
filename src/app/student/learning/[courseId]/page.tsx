'use client';

import React, { useState, useEffect, use } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import StudentLayout from '@/components/student/StudentLayout';
import Link from 'next/link';
import { apiClient, Class, Module, ModuleItem } from '@/lib/api';

interface LearningPageProps {
  params: Promise<{ courseId: string }>;
}

interface StudentProgress {
  completed_items: number[];
  quiz_scores: { [key: number]: number };
  is_completed: boolean;
}

// Interface for module item data
interface ModuleItemData {
  title?: string;
  description?: string;
  content?: string;
  questions?: unknown[];
  passing_score?: number;
  [key: string]: unknown;
}

// Interface for quiz data
interface QuizData {
  title?: string;
  questions?: unknown[];
  passing_score?: number;
}

// Interface for project data
interface ProjectData {
  title?: string;
  description?: string;
  requirements?: string;
}

export default function LearningPage({ params }: LearningPageProps) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<Class | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedItem, setSelectedItem] = useState<ModuleItem | null>(null);
  const [progress, setProgress] = useState<StudentProgress>({
    completed_items: [],
    quiz_scores: {},
    is_completed: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await apiClient.getClass(courseId);
      if (courseResponse.data) {
        setCourse(courseResponse.data);
      }

      // Fetch modules
      const modulesResponse = await apiClient.getModules(courseId);
      if (modulesResponse.data) {
        setModules(modulesResponse.data);
        
        // Auto-select first module if available
        if (modulesResponse.data.length > 0) {
          setSelectedModule(modulesResponse.data[0]);
          
          // Auto-select first item in first module
          if (modulesResponse.data[0].module_item && modulesResponse.data[0].module_item.length > 0) {
            setSelectedItem(modulesResponse.data[0].module_item[0]);
          }
        }
      }

      // TODO: Fetch student progress from backend
      // For now using mock data
      setProgress({
        completed_items: [1, 2, 3],
        quiz_scores: { 1: 85, 2: 92 },
        is_completed: false
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    // Auto-select first item in selected module
    if (module.module_item && module.module_item.length > 0) {
      setSelectedItem(module.module_item[0]);
    } else {
      setSelectedItem(null);
    }
  };

  const handleItemSelect = (item: ModuleItem) => {
    setSelectedItem(item);
  };

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'submodule':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12l-5-5-5 5z" />
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
        return null;
    }
  };

  const getItemTypeLabel = (itemType: string) => {
    switch (itemType) {
      case 'submodule': return 'Pembelajaran';
      case 'quiz': return 'Quiz';
      case 'project': return 'Project';
      default: return 'Item';
    }
  };

  const getItemTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'submodule': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'quiz': return 'text-green-600 bg-green-50 border-green-200';
      case 'project': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isItemCompleted = (itemId: number) => {
    return progress.completed_items.includes(itemId);
  };

  const getQuizScore = (itemId: number) => {
    return progress.quiz_scores[itemId] || null;
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <StudentLayout>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course...</p>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <StudentLayout>
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Course</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/student/courses"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-colors"
            >
              Back to Courses
            </Link>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <StudentLayout>
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
            <p className="text-gray-600 mb-6">The course you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
            <Link
              href="/student/courses"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-colors"
            >
              Back to Courses
            </Link>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar - Module List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Course Header */}
            <div className="p-6 border-b border-gray-200">
              <Link
                href="/student/courses"
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Courses
              </Link>
              <h1 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-sm text-gray-600">{course.category_name}</p>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto">
              {modules.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No Modules Yet</h3>
                  <p className="text-xs text-gray-500">This course doesn&apos;t have any modules yet.</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.id} className="space-y-1">
                      {/* Module Header */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {module.order}. {module.title}
                        </h3>
                      </div>

                      {/* Module Items */}
                      {module.module_item && module.module_item.length > 0 && (
                        <div className="space-y-1 ml-4">
                          {module.module_item.map((item, itemIndex) => {
                            const isCompleted = isItemCompleted(item.id);
                            const quizScore = getQuizScore(item.id);
                            const isSelected = selectedItem?.id === item.id;
                            
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleItemSelect(item)}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                                  isSelected
                                    ? 'border-purple-200 bg-purple-50 shadow-sm'
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded-lg border ${getItemTypeColor(item.item_type)}`}>
                                      {getItemIcon(item.item_type)}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {(item.data as unknown as ModuleItemData)?.title || 'Untitled'}
                                      </h4>
                                      <p className="text-xs text-gray-500">
                                        {getItemTypeLabel(item.item_type)}
                                      </p>
                                      {quizScore && (
                                        <p className="text-xs text-green-600 font-medium">
                                          Score: {quizScore}/100
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Completion Status */}
                                  <div className="flex items-center">
                                    {isCompleted ? (
                                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-gray-200"></div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {selectedItem ? (
              <>
                {selectedItem.item_type === 'submodule' && (
                  <LearningContent 
                    item={selectedItem} 
                    onComplete={() => {
                      // TODO: Mark as completed
                      console.log('Mark as completed:', selectedItem.id);
                    }}
                  />
                )}
                {selectedItem.item_type === 'quiz' && (
                  <QuizContent 
                    item={selectedItem}
                    onComplete={(score) => {
                      // TODO: Save quiz score
                      console.log('Quiz completed with score:', score);
                    }}
                  />
                )}
                {selectedItem.item_type === 'project' && (
                  <ProjectContent 
                    item={selectedItem}
                    courseId={courseId}
                  />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {course.title}</h3>
                  <p className="text-gray-600 mb-6">Select a module item from the sidebar to start learning.</p>
                  <div className="text-sm text-gray-500">
                    <p>🎥 Watch video lessons</p>
                    <p>📝 Complete quizzes</p>
                    <p>🚀 Submit real-world projects</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}

// Learning Content Component
function LearningContent({ item, onComplete }: { item: ModuleItem; onComplete: () => void }) {
  const [completed, setCompleted] = useState(false);
  const data = item.data as unknown as ModuleItemData;

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12l-5-5-5 5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{data?.title}</h1>
                <p className="text-gray-600">Video Pembelajaran</p>
              </div>
            </div>
          </div>

          {/* Video Section */}
          {data?.content && data.content.includes('youtube.com') ? (
            <div className="mb-8">
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={data.content.replace('watch?v=', 'embed/')}
                  title={data.title}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          ) : (
            <div className="mb-8 p-8 bg-gray-100 rounded-xl text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12l-5-5-5 5z" />
              </svg>
              <p className="text-gray-600">No video available for this lesson</p>
            </div>
          )}

          {/* Description */}
          {data?.description && (
            <div className="mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Pembelajaran</h3>
                <p className="text-gray-700 leading-relaxed">{data.description}</p>
              </div>
            </div>
          )}

          {/* Content */}
          {data?.content && !data.content.includes('youtube.com') && (
            <div className="mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Materi Pembelajaran</h3>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: String(data.content).replace(/\n/g, '<br>') }} />
                </div>
              </div>
            </div>
          )}

          {/* Mark as Complete Button */}
          {!completed && (
            <div className="text-center">
              <button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
              >
                Mark as Completed
              </button>
            </div>
          )}

          {completed && (
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-xl">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quiz Content Component
function QuizContent({ item, onComplete }: { item: ModuleItem; onComplete: (score: number) => void }) {
  const data = item.data as unknown as QuizData;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz: {data?.title}</h3>
        <p className="text-gray-600 mb-6">Test your knowledge with this interactive quiz.</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="text-blue-800 space-y-1 text-sm">
            <p>• {data?.questions?.length || 0} questions</p>
            <p>• 60 minutes time limit</p>
            <p>• Passing score: {data?.passing_score || 70}%</p>
            <p>• Multiple attempts allowed</p>
          </div>
        </div>

        <Link
          href={`/student/learning/quiz/${item.id}`}
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start Quiz
        </Link>
      </div>
    </div>
  );
}

// Project Content Component
function ProjectContent({ item, courseId }: { item: ModuleItem; courseId: string }) {
  const data = item.data as unknown as ProjectData;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2-2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Project: {data?.title}</h3>
        <p className="text-gray-600 mb-6">Create a real-world project to demonstrate your skills.</p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-purple-900 mb-2">🚀 Real Project, Real Impact</h4>
          <div className="text-purple-800 space-y-1 text-sm">
            <p>• Build something meaningful</p>
            <p>• Get professional feedback</p>
            <p>• Add to your portfolio</p>
            <p>• Showcase your skills</p>
          </div>
        </div>

        <Link
          href={`/student/projects/submit/${item.id}`}
          className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Submit Project
        </Link>
      </div>
    </div>
  );
}