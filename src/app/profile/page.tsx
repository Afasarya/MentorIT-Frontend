'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  totalLearningTime: number;
  streak: number;
}

interface Course {
  id: number;
  title: string;
  progress: number;
  category: string;
  thumbnail: string;
}

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchUserStats();
    fetchEnrolledCourses();
  }, [user, router]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/user/stats');
      setUserStats(response.data.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get('/user/enrolled-courses');
      setEnrolledCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/user/profile', formData);
      updateUser(response.data.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.put('/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully!');
    } catch (error: any) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete('/user/account');
      await logout();
      router.push('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(error.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'courses', label: 'My Courses', icon: '📚' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name || 'User'}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              {userStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-primary)]">{userStats.coursesEnrolled}</div>
                    <div className="text-sm text-gray-600">Courses Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userStats.coursesCompleted}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.floor(userStats.totalLearningTime / 60)}h</div>
                    <div className="text-sm text-gray-600">Learning Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-gray-50"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
                
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-6">Start learning by enrolling in your first course</p>
                    <button
                      onClick={() => router.push('/course')}
                      className="px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <img
                          src={course.thumbnail || '/images/course.png'}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="text-xs text-[var(--color-primary)] font-medium mb-2">
                            {course.category}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                            {course.title}
                          </h3>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[var(--color-primary)] h-2 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => router.push(`/course/${course.id}`)}
                            className="w-full px-4 py-2 text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                          >
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-8">
                {/* Change Password */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>

                {/* Account Actions */}
                <div className="border-t pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h3>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                    <p className="text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}