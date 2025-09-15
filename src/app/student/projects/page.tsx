'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient, ProjectSubmission } from '@/lib/api';

export default function StudentProjectsPage() {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  useEffect(() => {
    // Check if user just submitted a project
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
      // Show success message or toast
      console.log('Project submitted successfully!');
    }
  }, []);

  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMySubmissions();
      if (response.data) {
        setSubmissions(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = selectedStatus === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'under_review':
        return '👀';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your submissions...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Project Submissions</h1>
            <p className="text-gray-600 mt-2">Track your project submissions and reviews</p>
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

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="all">All Submissions</option>
                  <option value="pending">Pending Review</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex gap-4 text-sm">
                {(['pending', 'under_review', 'approved', 'rejected'] as const).map(status => {
                  const count = submissions.filter(s => s.status === status).length;
                  return (
                    <div key={status} className="text-center">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                        {getStatusIcon(status)} {count}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 capitalize">{status.replace('_', ' ')}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-6">
            {filteredSubmissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus === 'all' 
                    ? "You haven't submitted any projects yet."
                    : `No ${selectedStatus.replace('_', ' ')} submissions found.`
                  }
                </p>
                <Link
                  href="/student/courses"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Browse Courses
                </Link>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900">{submission.title}</h2>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)} {submission.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Project Assignment</p>
                            <p className="text-gray-900">{submission.project_page.title}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Submitted</p>
                            <p className="text-gray-900">{new Date(submission.created_at).toLocaleDateString()}</p>
                          </div>
                          {submission.grade && (
                            <div>
                              <p className="font-medium text-gray-700">Grade</p>
                              <p className="text-gray-900 font-semibold">{submission.grade}</p>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{submission.description}</p>

                        {/* Links */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {submission.github_link && (
                            <a
                              href={submission.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                              </svg>
                              GitHub Repository
                            </a>
                          )}
                          {submission.deploy_link && (
                            <a
                              href={submission.deploy_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Live Demo
                            </a>
                          )}
                          {submission.proposal_file && (
                            <a
                              href={`http://localhost:8080/${submission.proposal_file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download Proposal
                            </a>
                          )}
                        </div>

                        {/* Points Display */}
                        {submission.status === 'approved' && submission.points > 0 && (
                          <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            +{submission.points} EXP Earned
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Notes */}
                    {submission.review_note && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-blue-100 rounded-full">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6m-6 4h6" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900 mb-1">
                              Review Notes
                              {submission.reviewer && (
                                <span className="text-sm font-normal text-blue-700"> by {submission.reviewer.name}</span>
                              )}
                            </h4>
                            <p className="text-blue-800 text-sm whitespace-pre-line">{submission.review_note}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status-specific messages */}
                    {submission.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          <span className="font-medium">⏳ Pending Review:</span> Your submission is waiting to be reviewed by instructors.
                        </p>
                      </div>
                    )}
                    
                    {submission.status === 'under_review' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          <span className="font-medium">👀 Under Review:</span> Your submission is currently being reviewed. Check back soon for feedback!
                        </p>
                      </div>
                    )}
                    
                    {submission.status === 'rejected' && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">
                          <span className="font-medium">❌ Needs Improvement:</span> Please review the feedback above and consider resubmitting your project.
                        </p>
                      </div>
                    )}
                    
                    {submission.status === 'approved' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">
                          <span className="font-medium">✅ Approved:</span> Congratulations! Your project has been approved.
                          {submission.points > 0 && ` You've earned ${submission.points} EXP points!`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}