'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient, ProjectPage, CreateProjectSubmissionRequest } from '@/lib/api';

interface SubmitProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default function SubmitProjectPage({ params }: SubmitProjectPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [projectPage, setProjectPage] = useState<ProjectPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_link: '',
    deploy_link: '',
    proposal_file: null as File | null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchProjectData();
  }, [resolvedParams.projectId]);

  const fetchProjectData = async () => {
    try {
      setInitialLoading(true);
      // Note: We need to get project page data from module items API
      // This is a simplified example - you might need to adjust based on your routing
      const response = await apiClient.getModuleItem(resolvedParams.projectId);
      if (response.data?.data) {
        setProjectPage(response.data.data as ProjectPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExt)) {
        setErrors(prev => ({ ...prev, proposal_file: 'Only PDF, DOC, and DOCX files are allowed' }));
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, proposal_file: 'File size must be less than 10MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, proposal_file: file }));
      setErrors(prev => ({ ...prev, proposal_file: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (formData.github_link && !isValidUrl(formData.github_link)) {
      newErrors.github_link = 'Please enter a valid GitHub URL';
    }

    if (formData.deploy_link && !isValidUrl(formData.deploy_link)) {
      newErrors.deploy_link = 'Please enter a valid deployment URL';
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
    
    if (!validateForm() || !projectPage) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submissionData: CreateProjectSubmissionRequest = {
        project_page_id: projectPage.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        github_link: formData.github_link.trim() || undefined,
        deploy_link: formData.deploy_link.trim() || undefined,
        proposal_file: formData.proposal_file || undefined
      };

      await apiClient.submitProject(submissionData);
      
      // Show success message and redirect
      router.push('/student/projects?submitted=true');
    } catch (err) {
      console.error('Submit project error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading project data...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!projectPage) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-6">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
              <p className="text-gray-600 mb-6">The project you&apos;re trying to submit doesn&apos;t exist.</p>
              <Link
                href="/student/projects"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Back to Projects
              </Link>
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
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/student/projects"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Submit Project Akhir</h1>
              <p className="text-gray-600 mt-1">Submit your final project for review</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Project Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{projectPage.title}</h2>
                  <p className="text-gray-600 mb-4">{projectPage.description}</p>
                  {projectPage.guide && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Project Guidelines</h3>
                      <div className="text-blue-800 whitespace-pre-line">{projectPage.guide}</div>
                    </div>
                  )}
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

            {/* Submission Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Project Submission</h2>
                <p className="text-gray-600 mt-1">Fill out the form below to submit your project</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Project Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                      Judul Projek <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                        errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="e.g. E-Commerce Website with React & Node.js"
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Project Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                      Deskripsi Singkat Projek <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Describe your project, features, technologies used, and what problems it solves..."
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Maks 200 kata. Jelaskan teknologi yang digunakan dan fitur utama projek Anda.
                    </p>
                  </div>

                  {/* Links Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GitHub Link */}
                    <div>
                      <label htmlFor="github_link" className="block text-sm font-medium text-gray-900 mb-2">
                        Link Repository Github
                      </label>
                      <input
                        type="url"
                        id="github_link"
                        name="github_link"
                        value={formData.github_link}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                          errors.github_link ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="https://github.com/username/repository"
                      />
                      {errors.github_link && (
                        <p className="text-red-600 text-sm mt-1">{errors.github_link}</p>
                      )}
                    </div>

                    {/* Deploy Link */}
                    <div>
                      <label htmlFor="deploy_link" className="block text-sm font-medium text-gray-900 mb-2">
                        Link Deploy Aplikasi/Website
                      </label>
                      <input
                        type="url"
                        id="deploy_link"
                        name="deploy_link"
                        value={formData.deploy_link}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                          errors.deploy_link ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="https://your-project.vercel.app"
                      />
                      {errors.deploy_link && (
                        <p className="text-red-600 text-sm mt-1">{errors.deploy_link}</p>
                      )}
                    </div>
                  </div>

                  {/* Proposal File Upload */}
                  <div>
                    <label htmlFor="proposal_file" className="block text-sm font-medium text-gray-900 mb-2">
                      Proposal (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="proposal_file"
                        name="proposal_file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      {errors.proposal_file && (
                        <p className="text-red-600 text-sm mt-1">{errors.proposal_file}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Upload proposal file (PDF, DOC, DOCX) up to 10MB. Optional but recommended.
                      </p>
                    </div>
                  </div>

                  {/* File Preview */}
                  {formData.proposal_file && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1">
                          <p className="font-medium text-blue-900">{formData.proposal_file.name}</p>
                          <p className="text-sm text-blue-700">
                            {(formData.proposal_file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, proposal_file: null }))}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 pt-6">
                    <Link
                      href="/student/projects"
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Submit Projek
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}