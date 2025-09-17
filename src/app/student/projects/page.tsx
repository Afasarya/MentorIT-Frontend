'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import StudentLayout from '@/components/student/StudentLayout';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface ProjectSubmission {
  id: number;
  title: string;
  description: string;
  project_url?: string;
  github_url?: string;
  demo_url?: string;
  status: 'pending' | 'approved' | 'revision_needed' | 'rejected';
  score?: number;
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
  course_name: string;
  module_name: string;
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // const response = await apiClient.getMyProjects();
      
      // Mock data for now
      const mockProjects: ProjectSubmission[] = [
        {
          id: 1,
          title: 'E-commerce Website with React',
          description: 'A full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.',
          project_url: 'https://my-ecommerce-site.netlify.app',
          github_url: 'https://github.com/user/ecommerce-react',
          demo_url: 'https://my-ecommerce-site.netlify.app',
          status: 'approved',
          score: 92,
          feedback: 'Excellent work! The UI is clean and the functionality is well-implemented. Great use of React hooks and state management.',
          submitted_at: '2024-01-10T10:30:00Z',
          reviewed_at: '2024-01-12T14:20:00Z',
          course_name: 'React.js Fundamentals',
          module_name: 'Final Project'
        },
        {
          id: 2,
          title: 'Laravel REST API for Blog System',
          description: 'A RESTful API built with Laravel featuring authentication, CRUD operations for posts, comments, and user management.',
          github_url: 'https://github.com/user/laravel-blog-api',
          status: 'revision_needed',
          score: 78,
          feedback: 'Good foundation but needs improvement in error handling and API documentation. Please add input validation for all endpoints.',
          submitted_at: '2024-01-08T16:45:00Z',
          reviewed_at: '2024-01-11T09:15:00Z',
          course_name: 'Laravel Backend Development',
          module_name: 'API Development'
        },
        {
          id: 3,
          title: 'Data Visualization Dashboard',
          description: 'Interactive dashboard using Python, Pandas, and Plotly to visualize sales data with various charts and filters.',
          github_url: 'https://github.com/user/data-viz-dashboard',
          status: 'pending',
          submitted_at: '2024-01-15T11:20:00Z',
          course_name: 'Python for Data Science',
          module_name: 'Data Visualization Project'
        },
        {
          id: 4,
          title: 'Mobile Task Manager App',
          description: 'Flutter mobile application for task management with local storage, push notifications, and material design.',
          github_url: 'https://github.com/user/flutter-task-app',
          status: 'rejected',
          score: 65,
          feedback: 'The app has good basic functionality but lacks proper state management and the UI needs significant improvement. Please review Flutter best practices.',
          submitted_at: '2024-01-05T14:10:00Z',
          reviewed_at: '2024-01-07T16:30:00Z',
          course_name: 'Flutter Mobile Development',
          module_name: 'Task Manager Project'
        }
      ];
      
      setProjects(mockProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">✓ Approved</span>;
      case 'revision_needed':
        return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">⚠ Needs Revision</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">✗ Rejected</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">⏳ Under Review</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProjects = projects.filter(project => 
    filterStatus === 'all' || project.status === filterStatus
  );

  const projectStats = {
    total: projects.length,
    approved: projects.filter(p => p.status === 'approved').length,
    pending: projects.filter(p => p.status === 'pending').length,
    needsRevision: projects.filter(p => p.status === 'revision_needed').length,
    avgScore: projects.filter(p => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / projects.filter(p => p.score).length || 0
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <StudentLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your projects...</p>
              </div>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
            <p className="text-gray-600">Track your project submissions and feedback</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projectStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{projectStats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Under Review</p>
                  <p className="text-2xl font-bold text-blue-600">{projectStats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(projectStats.avgScore)}`}>
                    {projectStats.avgScore > 0 ? Math.round(projectStats.avgScore) : '--'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Projects' },
                { key: 'approved', label: 'Approved' },
                { key: 'pending', label: 'Under Review' },
                { key: 'revision_needed', label: 'Needs Revision' },
                { key: 'rejected', label: 'Rejected' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filterStatus === tab.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects List */}
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? 'You haven\'t submitted any projects yet. Start your first project to showcase your skills!'
                  : `No projects with status "${filterStatus}" found.`
                }
              </p>
              <Link
                href="/student/courses"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{project.course_name}</span>
                            <span>•</span>
                            <span>{project.module_name}</span>
                          </div>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Project Links */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            GitHub
                          </a>
                        )}
                        {project.project_url && project.project_url !== project.demo_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-200 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Project Link
                          </a>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Submitted: {new Date(project.submitted_at).toLocaleDateString()}</span>
                        {project.reviewed_at && (
                          <>
                            <span>•</span>
                            <span>Reviewed: {new Date(project.reviewed_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Score & Feedback */}
                    <div className="lg:w-80 space-y-4">
                      {project.score !== undefined && (
                        <div className="text-center lg:text-right">
                          <div className={`text-3xl font-bold mb-1 ${getScoreColor(project.score)}`}>
                            {project.score}
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      )}

                      {project.feedback && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Instructor Feedback:</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{project.feedback}</p>
                        </div>
                      )}

                      {project.status === 'revision_needed' && (
                        <button className="w-full px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                          Submit Revision
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}