'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import StudentLayout from '@/components/student/StudentLayout';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LearningProgress {
  courseId: number;
  courseTitle: string;
  instructor: string;
  thumbnail: string;
  category: string;
  totalModules: number;
  completedModules: number;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageQuizScore: number;
  totalHours: number;
  completedHours: number;
  progress: number;
  lastAccessed: string;
  estimatedCompletion: string;
  streak: number;
}

interface WeeklyActivity {
  week: string;
  hoursSpent: number;
  lessonsCompleted: number;
  quizzesTaken: number;
}

export default function LearningProgressPage() {
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([
    {
      courseId: 1,
      courseTitle: 'Website Development dengan Laravel dan React JS',
      instructor: 'Jane Cooper',
      thumbnail: '/images/course.png',
      category: 'Web Development',
      totalModules: 8,
      completedModules: 5,
      totalLessons: 32,
      completedLessons: 21,
      totalQuizzes: 8,
      completedQuizzes: 5,
      averageQuizScore: 85,
      totalHours: 40,
      completedHours: 26,
      progress: 65,
      lastAccessed: '2025-09-15',
      estimatedCompletion: '2025-10-20',
      streak: 7
    },
    {
      courseId: 2,
      courseTitle: 'Mobile App Development with Flutter',
      instructor: 'John Smith',
      thumbnail: '/images/course.png',
      category: 'Mobile Development',
      totalModules: 10,
      completedModules: 3,
      totalLessons: 45,
      completedLessons: 14,
      totalQuizzes: 10,
      completedQuizzes: 3,
      averageQuizScore: 78,
      totalHours: 60,
      completedHours: 18,
      progress: 30,
      lastAccessed: '2025-09-14',
      estimatedCompletion: '2025-12-15',
      streak: 3
    },
    {
      courseId: 3,
      courseTitle: 'Data Science with Python',
      instructor: 'Sarah Wilson',
      thumbnail: '/images/course.png',
      category: 'Data Science',
      totalModules: 12,
      completedModules: 2,
      totalLessons: 50,
      completedLessons: 8,
      totalQuizzes: 12,
      completedQuizzes: 2,
      averageQuizScore: 92,
      totalHours: 80,
      completedHours: 12,
      progress: 15,
      lastAccessed: '2025-09-13',
      estimatedCompletion: '2026-02-10',
      streak: 1
    }
  ]);

  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([
    { week: 'Sept 9-15', hoursSpent: 8, lessonsCompleted: 6, quizzesTaken: 2 },
    { week: 'Sept 2-8', hoursSpent: 12, lessonsCompleted: 8, quizzesTaken: 3 },
    { week: 'Aug 26-Sep 1', hoursSpent: 6, lessonsCompleted: 4, quizzesTaken: 1 },
    { week: 'Aug 19-25', hoursSpent: 10, lessonsCompleted: 7, quizzesTaken: 2 },
    { week: 'Aug 12-18', hoursSpent: 14, lessonsCompleted: 9, quizzesTaken: 4 },
    { week: 'Aug 5-11', hoursSpent: 5, lessonsCompleted: 3, quizzesTaken: 1 },
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const totalProgress = Math.round(
    learningProgress.reduce((sum, course) => sum + course.progress, 0) / learningProgress.length
  );

  const totalHoursThisWeek = weeklyActivity[0].hoursSpent;
  const totalLessonsThisWeek = weeklyActivity[0].lessonsCompleted;
  const averageQuizScore = Math.round(
    learningProgress.reduce((sum, course) => sum + course.averageQuizScore, 0) / learningProgress.length
  );

  const maxHours = Math.max(...weeklyActivity.map(w => w.hoursSpent));

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text-dark-primary)]">Learning Progress</h1>
                <p className="text-[var(--color-text-dark-secondary)] mt-2">
                  Track your learning journey and achievements
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none text-sm"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-[var(--color-primary)]/10">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Overall Progress</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{totalProgress}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Hours This Week</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{totalHoursThisWeek}h</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Lessons Completed</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{totalLessonsThisWeek}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Avg Quiz Score</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{averageQuizScore}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Progress Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-[var(--color-text-dark-primary)]">Course Progress</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {learningProgress.map((course) => (
                      <div key={course.courseId} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={course.thumbnail}
                                alt={course.courseTitle}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <h3 className="font-semibold text-[var(--color-text-dark-primary)] mb-1">{course.courseTitle}</h3>
                              <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">by {course.instructor}</p>
                              <div className="flex items-center gap-4 text-xs text-[var(--color-text-dark-tertiary)]">
                                <span className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  🔥 {course.streak} day streak
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[var(--color-primary)]">{course.progress}%</div>
                            <div className="text-xs text-[var(--color-text-dark-secondary)]">Complete</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                          <div 
                            className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>

                        {/* Detailed Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-semibold text-blue-600">{course.completedModules}/{course.totalModules}</div>
                            <div className="text-xs text-blue-600">Modules</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-semibold text-green-600">{course.completedLessons}/{course.totalLessons}</div>
                            <div className="text-xs text-green-600">Lessons</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-lg font-semibold text-yellow-600">{course.completedQuizzes}/{course.totalQuizzes}</div>
                            <div className="text-xs text-yellow-600">Quizzes</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-semibold text-purple-600">{course.completedHours}h/{course.totalHours}h</div>
                            <div className="text-xs text-purple-600">Hours</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-[var(--color-text-dark-secondary)]">
                            Avg Quiz Score: <span className="font-semibold text-[var(--color-text-dark-primary)]">{course.averageQuizScore}%</span>
                          </div>
                          <div className="text-sm text-[var(--color-text-dark-secondary)]">
                            Est. Completion: <span className="font-semibold text-[var(--color-text-dark-primary)]">{new Date(course.estimatedCompletion).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-[var(--color-text-dark-primary)]">Weekly Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {weeklyActivity.map((week, index) => (
                      <div key={week.week} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[var(--color-text-dark-primary)]">{week.week}</div>
                          <div className="flex items-center mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-[var(--color-primary)] h-2 rounded-full" 
                                style={{ width: `${(week.hoursSpent / maxHours) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-[var(--color-text-dark-secondary)]">{week.hoursSpent}h</div>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-[var(--color-text-dark-tertiary)]">
                            <span>{week.lessonsCompleted} lessons</span>
                            <span>{week.quizzesTaken} quizzes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-[var(--color-text-dark-primary)]">Learning Streak</h2>
                </div>
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">7 Days</div>
                  <div className="text-sm text-[var(--color-text-dark-secondary)] mb-4">Keep it up!</div>
                  
                  {/* Calendar visualization */}
                  <div className="grid grid-cols-7 gap-1 max-w-xs mx-auto">
                    {Array.from({ length: 21 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-sm ${
                          i >= 14 
                            ? 'bg-[var(--color-primary)]' 
                            : i >= 7 
                            ? 'bg-[var(--color-primary)]/30' 
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-[var(--color-text-dark-tertiary)] mt-3">
                    Last 3 weeks activity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}