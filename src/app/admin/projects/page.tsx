'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

export default function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const projects = [
    { 
      id: 1, 
      title: 'E-Commerce Website with React & Node.js', 
      course: 'React Development', 
      student: 'John Doe', 
      instructor: 'Jane Smith',
      status: 'completed', 
      submissionDate: '2024-01-20',
      grade: 85,
      feedback: 'Great work on the UI design and functionality implementation.'
    },
    { 
      id: 2, 
      title: 'Restaurant Management System', 
      course: 'Laravel Backend', 
      student: 'Sarah Wilson', 
      instructor: 'John Doe',
      status: 'in_review', 
      submissionDate: '2024-01-22',
      grade: null,
      feedback: null
    },
    { 
      id: 3, 
      title: 'Mobile Expense Tracker App', 
      course: 'Mobile Development', 
      student: 'Mike Johnson', 
      instructor: 'Sarah Wilson',
      status: 'in_progress', 
      submissionDate: null,
      grade: null,
      feedback: null
    },
    { 
      id: 4, 
      title: 'Data Analysis Dashboard', 
      course: 'Data Science', 
      student: 'Emily Davis', 
      instructor: 'Mike Johnson',
      status: 'completed', 
      submissionDate: '2024-01-18',
      grade: 92,
      feedback: 'Excellent data visualization and insights. Well documented code.'
    },
    { 
      id: 5, 
      title: 'Personal Portfolio Website', 
      course: 'React Development', 
      student: 'David Brown', 
      instructor: 'Jane Smith',
      status: 'needs_revision', 
      submissionDate: '2024-01-21',
      grade: 70,
      feedback: 'Good start but needs improvement in responsive design and performance optimization.'
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesCourse = selectedCourse === 'all' || project.course === selectedCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[var(--color-text-dark-primary)]/10 text-[var(--color-text-dark-primary)]';
      case 'in_review':
        return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]';
      case 'in_progress':
        return 'bg-[var(--color-text-dark-secondary)]/10 text-[var(--color-text-dark-secondary)]';
      case 'needs_revision':
        return 'bg-[var(--color-text-dark-tertiary)]/10 text-[var(--color-text-dark-tertiary)]';
      default:
        return 'bg-gray-100 text-[var(--color-text-dark-tertiary)]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_review':
        return 'In Review';
      case 'in_progress':
        return 'In Progress';
      case 'needs_revision':
        return 'Needs Revision';
      default:
        return status;
    }
  };

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inReviewProjects = projects.filter(p => p.status === 'in_review').length;
  const averageGrade = projects.filter(p => p.grade !== null).reduce((sum, p) => sum + (p.grade || 0), 0) / projects.filter(p => p.grade !== null).length;

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-dark-primary)]">Project Management</h1>
              <p className="text-[var(--color-text-dark-secondary)] mt-1">Monitor student projects and final assignments</p>
            </div>
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Export Projects
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Projects</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{totalProjects}</p>
                  <p className="text-sm text-[var(--color-text-dark-tertiary)] mt-1">All courses</p>
                </div>
                <div className="bg-[var(--color-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Completed</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{completedProjects}</p>
                  <p className="text-sm text-[var(--color-text-dark-secondary)] mt-1">
                    {Math.round((completedProjects / totalProjects) * 100)}% completion rate
                  </p>
                </div>
                <div className="bg-[var(--color-text-dark-primary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Awaiting Review</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{inReviewProjects}</p>
                  <p className="text-sm text-[var(--color-text-dark-secondary)] mt-1">Needs grading</p>
                </div>
                <div className="bg-[var(--color-text-dark-secondary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Average Grade</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{Math.round(averageGrade)}</p>
                  <p className="text-sm text-[var(--color-text-dark-secondary)] mt-1">Out of 100</p>
                </div>
                <div className="bg-[var(--color-text-dark-tertiary)] p-3 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search projects by title, student, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
              >
                <option value="all">All Courses</option>
                <option value="React Development">React Development</option>
                <option value="Laravel Backend">Laravel Backend</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
              >
                <option value="all">All Status</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
                <option value="needs_revision">Needs Revision</option>
              </select>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Project</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Course</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Student</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Instructor</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Grade</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Submitted</th>
                    <th className="text-left py-4 px-6 font-medium text-[var(--color-text-dark-primary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-[var(--color-text-dark-primary)]">{project.title}</p>
                          {project.feedback && (
                            <p className="text-sm text-[var(--color-text-dark-secondary)] mt-1 truncate max-w-xs">
                              {project.feedback}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                          {project.course}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {project.student.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-[var(--color-text-dark-primary)]">{project.student}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-dark-secondary)]">{project.instructor}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {project.grade ? (
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              project.grade >= 85 ? 'text-[var(--color-primary)]' :
                              project.grade >= 70 ? 'text-[var(--color-text-dark-primary)]' : 'text-[var(--color-text-dark-tertiary)]'
                            }`}>
                              {project.grade}/100
                            </span>
                          </div>
                        ) : (
                          <span className="text-[var(--color-text-dark-tertiary)]">Not graded</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-dark-secondary)]">
                        {project.submissionDate || 'Not submitted'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm">
                            View
                          </button>
                          {project.status === 'in_review' && (
                            <button className="text-[var(--color-text-dark-primary)] hover:text-black font-medium text-sm">
                              Grade
                            </button>
                          )}
                          <button className="text-[var(--color-text-dark-tertiary)] hover:text-[var(--color-text-dark-primary)] font-medium text-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-[var(--color-text-dark-secondary)]">Showing {filteredProjects.length} of {projects.length} projects</p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-[var(--color-primary)] text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}