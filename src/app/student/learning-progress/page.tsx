'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import StudentLayout from '@/components/student/StudentLayout';
import { useState } from 'react';

export default function LearningProgressPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  
  // Mock data for learning progress
  const overallStats = {
    totalHours: 45.5,
    coursesCompleted: 3,
    currentStreak: 12,
    averageScore: 87,
    totalQuizzes: 25,
    totalProjects: 8
  };

  const coursesProgress = [
    {
      id: 1,
      title: 'React.js Fundamentals',
      category: 'Frontend Development',
      progress: 85,
      totalModules: 12,
      completedModules: 10,
      totalHours: 24,
      completedHours: 20.4,
      lastAccessed: '2024-01-10',
      status: 'in-progress',
      nextLesson: 'Advanced Hooks',
      quizScore: 92,
      projectsCompleted: 3,
      projectsTotal: 4
    },
    {
      id: 2,
      title: 'Laravel Backend Development',
      category: 'Backend Development',
      progress: 60,
      totalModules: 15,
      completedModules: 9,
      totalHours: 30,
      completedHours: 18,
      lastAccessed: '2024-01-09',
      status: 'in-progress',
      nextLesson: 'Database Migrations',
      quizScore: 88,
      projectsCompleted: 2,
      projectsTotal: 5
    },
    {
      id: 3,
      title: 'Python for Data Science',
      category: 'Data Science',
      progress: 100,
      totalModules: 10,
      completedModules: 10,
      totalHours: 20,
      completedHours: 20,
      lastAccessed: '2024-01-08',
      status: 'completed',
      nextLesson: 'Course Completed',
      quizScore: 95,
      projectsCompleted: 3,
      projectsTotal: 3
    }
  ];

  const weeklyProgress = [
    { week: 'Week 1', hours: 8.5, courses: 1 },
    { week: 'Week 2', hours: 12.0, courses: 2 },
    { week: 'Week 3', hours: 9.5, courses: 2 },
    { week: 'Week 4', hours: 15.5, courses: 3 }
  ];

  const skillsProgress = [
    { skill: 'JavaScript', level: 85, category: 'Programming Languages' },
    { skill: 'React.js', level: 90, category: 'Frontend Frameworks' },
    { skill: 'PHP', level: 75, category: 'Programming Languages' },
    { skill: 'Laravel', level: 70, category: 'Backend Frameworks' },
    { skill: 'Python', level: 88, category: 'Programming Languages' },
    { skill: 'Data Analysis', level: 82, category: 'Data Science' },
    { skill: 'MySQL', level: 80, category: 'Databases' },
    { skill: 'Git', level: 85, category: 'Tools' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'lesson_completed',
      title: 'Completed "Advanced React Hooks"',
      course: 'React.js Fundamentals',
      timestamp: '2024-01-10T14:30:00',
      points: 50
    },
    {
      id: 2,
      type: 'quiz_completed',
      title: 'Quiz: React State Management',
      course: 'React.js Fundamentals',
      timestamp: '2024-01-10T13:15:00',
      score: 95,
      points: 100
    },
    {
      id: 3,
      type: 'project_submitted',
      title: 'Submitted Todo App Project',
      course: 'React.js Fundamentals',
      timestamp: '2024-01-09T16:45:00',
      points: 200
    },
    {
      id: 4,
      type: 'lesson_completed',
      title: 'Completed "Laravel Eloquent ORM"',
      course: 'Laravel Backend Development',
      timestamp: '2024-01-09T10:20:00',
      points: 50
    }
  ];

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'quiz_completed':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
      case 'project_submitted':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-dark-primary)] mb-2">
              Learning Progress
            </h1>
            <p className="text-[var(--color-text-dark-secondary)]">
              Track your learning journey and achievements
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Total Hours</p>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{overallStats.totalHours}</p>
                </div>
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Completed Courses</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.coursesCompleted}</p>
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
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{overallStats.currentStreak} days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-purple-600">{overallStats.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Courses Progress */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[var(--color-text-dark-primary)]">Course Progress</h2>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent">
                    <option value="all">All Courses</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-6">
                  {coursesProgress.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">
                            {course.category}
                          </p>
                          {getStatusBadge(course.status)}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[var(--color-primary)] mb-1">
                            {course.progress}%
                          </p>
                          <p className="text-xs text-[var(--color-text-dark-tertiary)]">
                            Last: {new Date(course.lastAccessed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-[var(--color-text-dark-secondary)]">Modules</p>
                          <p className="font-semibold">{course.completedModules}/{course.totalModules}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-[var(--color-text-dark-secondary)]">Hours</p>
                          <p className="font-semibold">{course.completedHours}/{course.totalHours}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-[var(--color-text-dark-secondary)]">Quiz Score</p>
                          <p className="font-semibold">{course.quizScore}%</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-[var(--color-text-dark-secondary)]">Projects</p>
                          <p className="font-semibold">{course.projectsCompleted}/{course.projectsTotal}</p>
                        </div>
                      </div>

                      {/* Next Lesson */}
                      {course.status === 'in-progress' && (
                        <div className="mt-4 p-3 bg-[var(--color-primary)]/5 rounded-lg">
                          <p className="text-sm text-[var(--color-text-dark-secondary)] mb-1">Next Lesson:</p>
                          <p className="font-medium text-[var(--color-primary)]">{course.nextLesson}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Progress */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[var(--color-text-dark-primary)] mb-6">Skills Development</h2>
                
                <div className="space-y-4">
                  {skillsProgress.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-[var(--color-text-dark-primary)]">{skill.skill}</h3>
                          <span className="text-sm font-semibold text-[var(--color-primary)]">{skill.level}%</span>
                        </div>
                        <p className="text-xs text-[var(--color-text-dark-secondary)] mb-2">{skill.category}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Stats */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--color-text-dark-primary)] mb-4">Recent Activity</h3>
                
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-dark-primary)] mb-1">
                          {activity.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-dark-secondary)] mb-1">
                          {activity.course}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[var(--color-text-dark-tertiary)]">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                          {activity.points && (
                            <span className="text-xs font-medium text-[var(--color-primary)]">
                              +{activity.points} pts
                            </span>
                          )}
                          {activity.score && (
                            <span className="text-xs font-medium text-green-600">
                              {activity.score}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Progress Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--color-text-dark-primary)] mb-4">Weekly Progress</h3>
                
                <div className="space-y-4">
                  {weeklyProgress.map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[var(--color-text-dark-primary)]">{week.week}</span>
                          <span className="text-sm text-[var(--color-text-dark-secondary)]">{week.hours}h</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[var(--color-primary)] to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(week.hours / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Goals */}
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Learning Goals</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">Weekly Goal</span>
                    <span className="font-bold">12/15 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">Monthly Goal</span>
                    <span className="font-bold">45/60 hours</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-white/90 text-sm">You're 75% towards your monthly goal!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}