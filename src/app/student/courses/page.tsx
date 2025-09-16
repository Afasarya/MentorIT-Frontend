'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import StudentLayout from '@/components/student/StudentLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function MyCoursesPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for enrolled courses
  const courses = [
    {
      id: 1,
      title: 'React.js Fundamentals',
      instructor: 'John Doe',
      category: 'Frontend Development',
      thumbnail: '/images/course.png',
      progress: 85,
      totalModules: 12,
      completedModules: 10,
      duration: '24 hours',
      difficulty: 'Intermediate',
      status: 'in-progress',
      enrolledDate: '2023-12-01',
      lastAccessed: '2024-01-10',
      nextLesson: 'Advanced React Hooks',
      rating: 4.8,
      studentsEnrolled: 1250,
      certificates: 1,
      description: 'Master React.js fundamentals and build dynamic web applications with confidence.',
      skills: ['React', 'JavaScript', 'JSX', 'State Management'],
      upcomingDeadline: {
        title: 'Final Project Submission',
        date: '2024-01-15'
      }
    },
    {
      id: 2,
      title: 'Laravel Backend Development',
      instructor: 'Jane Smith',
      category: 'Backend Development',
      thumbnail: '/images/course.png',
      progress: 60,
      totalModules: 15,
      completedModules: 9,
      duration: '30 hours',
      difficulty: 'Advanced',
      status: 'in-progress',
      enrolledDate: '2023-11-15',
      lastAccessed: '2024-01-09',
      nextLesson: 'Database Migrations',
      rating: 4.7,
      studentsEnrolled: 890,
      certificates: 0,
      description: 'Build robust web applications with Laravel, the elegant PHP framework.',
      skills: ['Laravel', 'PHP', 'MySQL', 'API Development'],
      upcomingDeadline: {
        title: 'Mid-term Quiz',
        date: '2024-01-18'
      }
    },
    {
      id: 3,
      title: 'Python for Data Science',
      instructor: 'Mike Johnson',
      category: 'Data Science',
      thumbnail: '/images/course.png',
      progress: 100,
      totalModules: 10,
      completedModules: 10,
      duration: '20 hours',
      difficulty: 'Beginner',
      status: 'completed',
      enrolledDate: '2023-10-01',
      lastAccessed: '2024-01-08',
      nextLesson: 'Course Completed',
      rating: 4.9,
      studentsEnrolled: 2100,
      certificates: 1,
      description: 'Learn Python fundamentals and data analysis techniques for data science.',
      skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization'],
      completedDate: '2024-01-08'
    },
    {
      id: 4,
      title: 'Mobile App Development with Flutter',
      instructor: 'Sarah Wilson',
      category: 'Mobile Development',
      thumbnail: '/images/course.png',
      progress: 25,
      totalModules: 18,
      completedModules: 5,
      duration: '35 hours',
      difficulty: 'Intermediate',
      status: 'in-progress',
      enrolledDate: '2024-01-05',
      lastAccessed: '2024-01-07',
      nextLesson: 'Widget Lifecycle',
      rating: 4.6,
      studentsEnrolled: 750,
      certificates: 0,
      description: 'Create beautiful cross-platform mobile applications using Flutter and Dart.',
      skills: ['Flutter', 'Dart', 'Mobile Development', 'UI/UX'],
      upcomingDeadline: {
        title: 'First App Prototype',
        date: '2024-01-25'
      }
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Courses', count: courses.length },
    { id: 'in-progress', label: 'In Progress', count: courses.filter(c => c.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: courses.filter(c => c.status === 'completed').length }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesTab = selectedTab === 'all' || course.status === selectedTab;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'in-progress':
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">In Progress</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Not Started</span>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-dark-primary)] mb-2">
              My Courses
            </h1>
            <p className="text-[var(--color-text-dark-secondary)]">
              Manage and continue your learning journey
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>

              {/* Filter Dropdown */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent">
                <option value="">All Categories</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="data-science">Data Science</option>
              </select>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-white text-[var(--color-primary)] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Course Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[var(--color-text-dark-primary)]">
                          {course.title}
                        </h3>
                        {getStatusBadge(course.status)}
                      </div>
                      <p className="text-[var(--color-text-dark-secondary)] mb-1">
                        by {course.instructor}
                      </p>
                      <p className="text-sm text-[var(--color-text-dark-tertiary)]">
                        {course.category}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--color-text-dark-primary)]">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-primary)]">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-[var(--color-text-dark-tertiary)] mt-1">
                      {course.completedModules} of {course.totalModules} modules completed
                    </p>
                  </div>

                  {/* Course Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-[var(--color-text-dark-secondary)]">Duration</p>
                      <p className="text-sm font-semibold">{course.duration}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-[var(--color-text-dark-secondary)]">Difficulty</p>
                      <span className={`text-sm font-semibold px-2 py-1 rounded ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[var(--color-text-dark-primary)] mb-2">Skills you'll learn:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Next Lesson or Completed Info */}
                  {course.status === 'in-progress' && (
                    <div className="p-3 bg-[var(--color-primary)]/5 rounded-lg mb-4">
                      <p className="text-sm text-[var(--color-text-dark-secondary)] mb-1">Next Lesson:</p>
                      <p className="font-medium text-[var(--color-primary)]">{course.nextLesson}</p>
                    </div>
                  )}

                  {course.status === 'completed' && (
                    <div className="p-3 bg-green-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">
                          Course completed on {new Date(course.completedDate!).toLocaleDateString()}
                        </p>
                      </div>
                      {course.certificates > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          🎉 Certificate earned!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Upcoming Deadline */}
                  {course.upcomingDeadline && (
                    <div className="p-3 bg-orange-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-orange-800">{course.upcomingDeadline.title}</p>
                          <p className="text-xs text-orange-600">Due: {new Date(course.upcomingDeadline.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {course.status === 'in-progress' && (
                      <Link 
                        href={`/course/${course.id}`}
                        className="flex-1 bg-[var(--color-primary)] text-white px-4 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors text-center"
                      >
                        Continue Learning
                      </Link>
                    )}
                    {course.status === 'completed' && (
                      <>
                        <Link 
                          href={`/course/${course.id}`}
                          className="flex-1 bg-gray-100 text-[var(--color-text-dark-primary)] px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                        >
                          Review Course
                        </Link>
                        {course.certificates > 0 && (
                          <Link 
                            href={`/student/certificates/${course.id}`}
                            className="flex-1 bg-green-100 text-green-800 px-4 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors text-center"
                          >
                            View Certificate
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Course Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-[var(--color-text-dark-secondary)]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{course.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{course.studentsEnrolled.toLocaleString()} students</span>
                    </div>
                    <span>
                      Enrolled {new Date(course.enrolledDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text-dark-primary)] mb-2">
                No courses found
              </h3>
              <p className="text-[var(--color-text-dark-secondary)] mb-6">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Start your learning journey by exploring available courses.'}
              </p>
              <Link 
                href="/course"
                className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}