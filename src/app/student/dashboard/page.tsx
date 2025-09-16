'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import StudentLayout from '@/components/student/StudentLayout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiClient, Class } from '@/lib/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch enrolled courses on component mount
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getMyClasses();
        setEnrolledCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Calculate dynamic stats based on enrolled courses
  const stats = {
    coursesEnrolled: enrolledCourses.length,
    coursesCompleted: 0, // You can implement progress tracking later
    totalPoints: 2450, // This would come from user profile or separate endpoint
    currentStreak: 7,
    totalLearningHours: 45,
    certificates: 0,
  };

  const recentAchievements = [
    {
      id: 1,
      title: 'First Course Completed',
      description: 'Completed your first course!',
      icon: '🎉',
      earnedAt: '2 days ago',
      points: 500
    },
    {
      id: 2,
      title: '7-Day Streak',
      description: 'Learned for 7 consecutive days',
      icon: '🔥',
      earnedAt: '1 day ago',
      points: 200
    },
    {
      id: 3,
      title: 'Quiz Master',
      description: 'Scored 100% on 5 quizzes',
      icon: '⭐',
      earnedAt: '3 days ago',
      points: 300
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'React Project Submission',
      course: 'React.js Fundamentals',
      dueDate: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Laravel Quiz 3',
      course: 'Laravel Backend Development',
      dueDate: '2024-01-18',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Python Data Analysis Assignment',
      course: 'Python for Data Science',
      dueDate: '2024-01-20',
      priority: 'low'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-dark-primary)] mb-2">
              Selamat datang kembali, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-[var(--color-text-dark-secondary)]">
              Mari lanjutkan perjalanan belajarmu hari ini
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Course Diikuti</p>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{stats.coursesEnrolled}</p>
                </div>
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Course Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{stats.coursesCompleted}</p>
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
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Total Poin</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalPoints.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)] mb-1">Streak Hari</p>
                  <p className="text-2xl font-bold text-red-600">{stats.currentStreak}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Courses & Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[var(--color-text-dark-primary)]">Lanjutkan Belajar</h2>
                  <Link href="/student/courses" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                    Lihat Semua
                  </Link>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-lg font-medium">Error Loading Courses</p>
                      <p className="text-sm text-gray-500 mt-1">{error}</p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-lg font-medium text-gray-700">Belum Ada Course</p>
                      <p className="text-sm text-gray-500 mt-1">Mulai dengan membeli course pertama Anda!</p>
                    </div>
                    <Link 
                      href="/course" 
                      className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                      Jelajahi Course
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 mr-4 overflow-hidden">
                          <img 
                            src={course.thumbnail ? `http://localhost:8080/${course.thumbnail}` : '/images/course.png'} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[var(--color-text-dark-primary)] mb-1 truncate">
                            {course.title}
                          </h3>
                          <p className="text-sm text-[var(--color-text-dark-secondary)] mb-2">
                            {course.category_name} • {course.level} • {course.member_count} students
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>0%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                                  style={{ width: '0%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link 
                            href={`/course/${course.id}`}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                          >
                            Lanjutkan
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[var(--color-text-dark-primary)]">Pencapaian Terbaru</h2>
                  <Link href="/student/points" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                    Lihat Semua
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center p-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-purple-50 rounded-xl">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mr-4 shadow-sm">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--color-text-dark-primary)] mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-dark-secondary)]">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[var(--color-primary)]">+{achievement.points}</p>
                        <p className="text-xs text-[var(--color-text-dark-tertiary)]">{achievement.earnedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--color-text-dark-primary)] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/student/learning-progress" className="flex items-center p-3 bg-[var(--color-primary)]/5 rounded-xl hover:bg-[var(--color-primary)]/10 transition-colors group">
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="font-medium text-[var(--color-text-dark-primary)] group-hover:text-[var(--color-primary)]">
                      Lihat Progress
                    </span>
                  </Link>

                  <Link href="/student/projects" className="flex items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="font-medium text-[var(--color-text-dark-primary)] group-hover:text-green-700">
                      My Projects
                    </span>
                  </Link>

                  <Link href="/student/points" className="flex items-center p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <span className="font-medium text-[var(--color-text-dark-primary)] group-hover:text-orange-700">
                      Tukar Poin
                    </span>
                  </Link>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--color-text-dark-primary)] mb-4">Deadline Mendatang</h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[var(--color-text-dark-primary)] text-sm mb-1 truncate">
                            {deadline.title}
                          </h4>
                          <p className="text-xs text-[var(--color-text-dark-secondary)] mb-2">
                            {deadline.course}
                          </p>
                          <p className="text-xs text-[var(--color-text-dark-tertiary)]">
                            Due: {new Date(deadline.dueDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ml-2 mt-1 ${
                          deadline.priority === 'high' ? 'bg-red-500' :
                          deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Stats */}
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Statistik Belajar</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Total Jam Belajar</span>
                    <span className="font-bold">{stats.totalLearningHours} jam</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Sertifikat</span>
                    <span className="font-bold">{stats.certificates}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Streak Terbaik</span>
                    <span className="font-bold">15 hari</span>
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