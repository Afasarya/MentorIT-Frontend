'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import StudentLayout from '@/components/student/StudentLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for assignments
  const assignments = [
    {
      id: 1,
      title: 'Build a Todo Application',
      course: 'React.js Fundamentals',
      instructor: 'John Doe',
      type: 'project',
      status: 'submitted',
      dueDate: '2024-01-15',
      submittedDate: '2024-01-14',
      points: 100,
      earnedPoints: 85,
      description: 'Create a fully functional todo application using React hooks and local storage.',
      requirements: [
        'Use React functional components',
        'Implement CRUD operations',
        'Add local storage persistence',
        'Include responsive design'
      ],
      attachments: ['todo-app.zip'],
      feedback: 'Great work! The application meets all requirements. Consider adding error handling for edge cases.',
      grade: 'A-'
    },
    {
      id: 2,
      title: 'Database Design Assignment',
      course: 'Laravel Backend Development',
      instructor: 'Jane Smith',
      type: 'assignment',
      status: 'in-review',
      dueDate: '2024-01-18',
      submittedDate: '2024-01-17',
      points: 75,
      earnedPoints: null,
      description: 'Design a database schema for an e-commerce platform with proper relationships and constraints.',
      requirements: [
        'Create ER diagram',
        'Define all entities and relationships',
        'Include proper constraints',
        'Write migration files'
      ],
      attachments: ['database-schema.sql', 'er-diagram.pdf'],
      feedback: null,
      grade: null
    },
    {
      id: 3,
      title: 'Data Analysis Report',
      course: 'Python for Data Science',
      instructor: 'Mike Johnson',
      type: 'report',
      status: 'completed',
      dueDate: '2024-01-10',
      submittedDate: '2024-01-09',
      points: 120,
      earnedPoints: 115,
      description: 'Analyze the provided dataset and create visualizations to identify trends and patterns.',
      requirements: [
        'Load and clean the dataset',
        'Perform exploratory data analysis',
        'Create meaningful visualizations',
        'Write conclusions and insights'
      ],
      attachments: ['analysis-report.pdf', 'code.ipynb'],
      feedback: 'Excellent analysis with clear insights. Minor improvements needed in data visualization labels.',
      grade: 'A'
    },
    {
      id: 4,
      title: 'Mobile UI Prototype',
      course: 'Mobile App Development with Flutter',
      instructor: 'Sarah Wilson',
      type: 'project',
      status: 'pending',
      dueDate: '2024-01-25',
      submittedDate: null,
      points: 90,
      earnedPoints: null,
      description: 'Create a mobile app prototype with at least 5 screens and navigation.',
      requirements: [
        'Design 5+ screens',
        'Implement navigation',
        'Use Flutter widgets effectively',
        'Follow Material Design guidelines'
      ],
      attachments: [],
      feedback: null,
      grade: null
    },
    {
      id: 5,
      title: 'API Integration Quiz',
      course: 'Laravel Backend Development',
      instructor: 'Jane Smith',
      type: 'quiz',
      status: 'overdue',
      dueDate: '2024-01-12',
      submittedDate: null,
      points: 50,
      earnedPoints: null,
      description: 'Multiple choice quiz covering API development concepts and Laravel implementation.',
      requirements: [
        'Complete all 20 questions',
        'Time limit: 60 minutes',
        'One attempt only'
      ],
      attachments: [],
      feedback: null,
      grade: null
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Assignments', count: assignments.length },
    { id: 'pending', label: 'Pending', count: assignments.filter(a => a.status === 'pending').length },
    { id: 'submitted', label: 'Submitted', count: assignments.filter(a => ['submitted', 'in-review'].includes(a.status)).length },
    { id: 'completed', label: 'Completed', count: assignments.filter(a => a.status === 'completed').length },
    { id: 'overdue', label: 'Overdue', count: assignments.filter(a => a.status === 'overdue').length }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesTab = selectedTab === 'all' || assignment.status === selectedTab || 
                       (selectedTab === 'submitted' && ['submitted', 'in-review'].includes(assignment.status));
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status === 'pending';
    
    if (isOverdue) {
      return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Overdue</span>;
    }
    
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'submitted':
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Submitted</span>;
      case 'in-review':
        return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">In Review</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Pending</span>;
      case 'overdue':
        return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Overdue</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
      case 'assignment':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'quiz':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
      case 'report':
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    const date = new Date(dueDate).toLocaleDateString();
    
    if (daysUntil < 0) {
      return `${Math.abs(daysUntil)} days overdue`;
    } else if (daysUntil === 0) {
      return 'Due today';
    } else if (daysUntil === 1) {
      return 'Due tomorrow';
    } else if (daysUntil <= 7) {
      return `Due in ${daysUntil} days`;
    } else {
      return `Due ${date}`;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-dark-primary)] mb-2">
              Assignments
            </h1>
            <p className="text-[var(--color-text-dark-secondary)]">
              View and manage your course assignments and projects
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent">
                  <option value="">All Courses</option>
                  <option value="react">React.js Fundamentals</option>
                  <option value="laravel">Laravel Backend Development</option>
                  <option value="python">Python for Data Science</option>
                  <option value="flutter">Mobile App Development</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent">
                  <option value="">All Types</option>
                  <option value="project">Projects</option>
                  <option value="assignment">Assignments</option>
                  <option value="quiz">Quizzes</option>
                  <option value="report">Reports</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Assignments List */}
          <div className="space-y-6">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Assignment Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {getTypeIcon(assignment.type)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-[var(--color-text-dark-primary)]">
                              {assignment.title}
                            </h3>
                            {getStatusBadge(assignment.status, assignment.dueDate)}
                          </div>
                          <p className="text-[var(--color-text-dark-secondary)] mb-1">
                            {assignment.course} • {assignment.instructor}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-[var(--color-text-dark-tertiary)]">
                            <span className="capitalize">{assignment.type}</span>
                            <span>•</span>
                            <span>{assignment.points} points</span>
                            <span>•</span>
                            <span className={getDaysUntilDue(assignment.dueDate) < 0 ? 'text-red-600' : ''}>
                              {formatDueDate(assignment.dueDate)}
                            </span>
                          </div>
                        </div>

                        {/* Grade Display */}
                        {assignment.grade && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">
                              {assignment.grade}
                            </div>
                            <div className="text-sm text-[var(--color-text-dark-secondary)]">
                              {assignment.earnedPoints}/{assignment.points} pts
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[var(--color-text-dark-secondary)] mb-4">
                        {assignment.description}
                      </p>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[var(--color-text-dark-primary)] mb-2">
                          Requirements:
                        </h4>
                        <ul className="space-y-1">
                          {assignment.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-text-dark-secondary)]">
                              <svg className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Submission Info */}
                      {assignment.submittedDate && (
                        <div className="p-4 bg-blue-50 rounded-lg mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-blue-800">
                              Submitted on {new Date(assignment.submittedDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {assignment.attachments.length > 0 && (
                            <div>
                              <p className="text-xs text-blue-600 mb-2">Submitted files:</p>
                              <div className="flex flex-wrap gap-2">
                                {assignment.attachments.map((file, index) => (
                                  <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    {file}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Feedback */}
                      {assignment.feedback && (
                        <div className="p-4 bg-green-50 rounded-lg mb-4">
                          <h4 className="text-sm font-semibold text-green-800 mb-2">Instructor Feedback:</h4>
                          <p className="text-sm text-green-700">{assignment.feedback}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {assignment.status === 'pending' && (
                          <Link 
                            href={`/student/assignments/${assignment.id}/submit`}
                            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                          >
                            {assignment.type === 'quiz' ? 'Take Quiz' : 'Submit Assignment'}
                          </Link>
                        )}
                        
                        {assignment.status === 'overdue' && (
                          <Link 
                            href={`/student/assignments/${assignment.id}/submit`}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                          >
                            Submit Late
                          </Link>
                        )}

                        <Link 
                          href={`/student/assignments/${assignment.id}`}
                          className="bg-gray-100 text-[var(--color-text-dark-primary)] px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>

                        {assignment.attachments.length > 0 && assignment.status !== 'pending' && (
                          <button className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                            Download Files
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Overdue Items */}
                {assignment.status === 'overdue' && (
                  <div className="px-6 pb-4">
                    <div className="w-full bg-red-200 rounded-full h-1">
                      <div className="bg-red-600 h-1 rounded-full w-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text-dark-primary)] mb-2">
                No assignments found
              </h3>
              <p className="text-[var(--color-text-dark-secondary)]">
                {searchQuery ? 'Try adjusting your search criteria.' : 'You don\'t have any assignments at the moment.'}
              </p>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}