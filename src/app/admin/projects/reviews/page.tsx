'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient, ProjectSubmission, ReviewProjectSubmissionRequest } from '@/lib/api';

export default function ProjectReviewsPage() {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewingSubmission, setReviewingSubmission] = useState<ProjectSubmission | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    status: 'pending' as 'approved' | 'rejected' | 'under_review',
    review_note: '',
    grade: '',
    points: 0
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [selectedStatus, currentPage]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      const response = await apiClient.getAllSubmissions(status, currentPage, 10);
      
      if (response.data) {
        setSubmissions(response.data.submissions);
        setTotalPages(response.data.pagination.total_pages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewingSubmission) return;

    try {
      setReviewLoading(true);
      const reviewData: ReviewProjectSubmissionRequest = {
        status: reviewFormData.status,
        review_note: reviewFormData.review_note,
        grade: reviewFormData.grade,
        points: reviewFormData.points
      };

      await apiClient.reviewSubmission(reviewingSubmission.id, reviewData);
      
      // Refresh submissions list
      await fetchSubmissions();
      
      // Close modal
      setReviewingSubmission(null);
      setReviewFormData({ status: 'pending', review_note: '', grade: '', points: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

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

  if (loading && submissions.length === 0) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <AdminLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading submissions...</p>
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Project Submissions Review</h1>
            <p className="text-gray-600 mt-1">Review and grade student project submissions</p>
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
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="all">All Submissions</option>
                  <option value="pending">Pending Review</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Project Submissions</h2>
                <span className="text-sm text-gray-600">
                  {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600">
                  {selectedStatus === 'all' 
                    ? 'No project submissions have been made yet.'
                    : `No ${selectedStatus} submissions found.`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{submission.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)} {submission.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Student</p>
                            <p className="text-sm text-gray-900">{submission.user.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Project</p>
                            <p className="text-sm text-gray-900">{submission.project_page.title}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Submitted</p>
                            <p className="text-sm text-gray-900">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {submission.grade && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Grade</p>
                              <p className="text-sm text-gray-900">{submission.grade}</p>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{submission.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {submission.github_link && (
                            <a
                              href={submission.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                              </svg>
                              GitHub
                            </a>
                          )}
                          {submission.deploy_link && (
                            <a
                              href={submission.deploy_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition-colors"
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
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Proposal
                            </a>
                          )}
                        </div>

                        {submission.review_note && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-900 mb-1">Review Notes</p>
                            <p className="text-sm text-blue-800">{submission.review_note}</p>
                            {submission.reviewer && (
                              <p className="text-xs text-blue-600 mt-2">
                                Reviewed by {submission.reviewer.name}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => {
                            setReviewingSubmission(submission);
                            setReviewFormData({
                              status: submission.status as 'approved' | 'rejected' | 'under_review',
                              review_note: submission.review_note || '',
                              grade: submission.grade || '',
                              points: submission.points || 0
                            });
                          }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Review Modal */}
          {reviewingSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Review Submission</h3>
                  <button
                    onClick={() => setReviewingSubmission(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Submission Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{reviewingSubmission.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">by {reviewingSubmission.user.name}</p>
                    <p className="text-sm text-gray-700">{reviewingSubmission.description}</p>
                  </div>

                  {/* Review Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={reviewFormData.status}
                      onChange={(e) => setReviewFormData(prev => ({ 
                        ...prev, 
                        status: e.target.value as 'approved' | 'rejected' | 'under_review' 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                    <input
                      type="text"
                      value={reviewFormData.grade}
                      onChange={(e) => setReviewFormData(prev => ({ ...prev, grade: e.target.value }))}
                      placeholder="e.g. A, B+, 85/100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Points */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points (EXP)</label>
                    <input
                      type="number"
                      value={reviewFormData.points}
                      onChange={(e) => setReviewFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                      min="0"
                      max="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                    <p className="text-sm text-gray-600 mt-1">Points will be added to student's experience if approved</p>
                  </div>

                  {/* Review Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                    <textarea
                      value={reviewFormData.review_note}
                      onChange={(e) => setReviewFormData(prev => ({ ...prev, review_note: e.target.value }))}
                      rows={4}
                      placeholder="Provide feedback and suggestions for the student..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setReviewingSubmission(null)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewLoading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                  >
                    {reviewLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Review'
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