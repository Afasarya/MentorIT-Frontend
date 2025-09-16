'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import StudentLayout from '@/components/student/StudentLayout';
import { useState } from 'react';

interface PointTransaction {
  id: number;
  type: 'earned' | 'spent';
  source: string;
  description: string;
  amount: number;
  date: string;
  category: 'course' | 'quiz' | 'project' | 'achievement' | 'daily' | 'reward';
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  points: number;
  dateEarned: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  type: 'discount' | 'certificate' | 'merchandise' | 'feature';
  available: boolean;
  image?: string;
}

export default function MyPointsPage() {
  const [currentPoints, setCurrentPoints] = useState(1850);
  const [totalEarned, setTotalEarned] = useState(2350);
  const [totalSpent, setTotalSpent] = useState(500);
  const [currentRank, setCurrentRank] = useState(12);
  const [nextRankPoints, setNextRankPoints] = useState(150);

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'rewards'>('overview');

  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([
    {
      id: 1,
      type: 'earned',
      source: 'React Basics Quiz',
      description: 'Completed with 85% score',
      amount: 50,
      date: '2025-09-15',
      category: 'quiz'
    },
    {
      id: 2,
      type: 'earned',
      source: 'JavaScript Fundamentals',
      description: 'Course completion bonus',
      amount: 200,
      date: '2025-09-14',
      category: 'course'
    },
    {
      id: 3,
      type: 'earned',
      source: 'Portfolio Website',
      description: 'Project submission',
      amount: 100,
      date: '2025-09-13',
      category: 'project'
    },
    {
      id: 4,
      type: 'spent',
      source: '20% Course Discount',
      description: 'Applied to Flutter course',
      amount: -100,
      date: '2025-09-12',
      category: 'reward'
    },
    {
      id: 5,
      type: 'earned',
      source: 'Daily Login Streak',
      description: '7 day streak bonus',
      amount: 25,
      date: '2025-09-11',
      category: 'daily'
    },
    {
      id: 6,
      type: 'earned',
      source: 'First Steps Achievement',
      description: 'Completed first course',
      amount: 75,
      date: '2025-09-10',
      category: 'achievement'
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first course',
      icon: '🎯',
      points: 75,
      dateEarned: '2025-09-10',
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Quiz Master',
      description: 'Score 90% or higher on 5 quizzes',
      icon: '🧠',
      points: 150,
      dateEarned: '2025-09-08',
      rarity: 'rare'
    },
    {
      id: 3,
      title: 'Streak Master',
      description: 'Maintain a 30-day learning streak',
      icon: '🔥',
      points: 300,
      dateEarned: '2025-09-01',
      rarity: 'epic'
    },
    {
      id: 4,
      title: 'Code Ninja',
      description: 'Complete 3 programming projects',
      icon: '⚔️',
      points: 250,
      dateEarned: '2025-08-28',
      rarity: 'epic'
    }
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 1,
      title: '10% Course Discount',
      description: 'Get 10% off any course purchase',
      cost: 50,
      type: 'discount',
      available: true
    },
    {
      id: 2,
      title: '20% Course Discount',
      description: 'Get 20% off any course purchase',
      cost: 100,
      type: 'discount',
      available: true
    },
    {
      id: 3,
      title: 'Premium Certificate',
      description: 'Upgrade to premium certificate design',
      cost: 150,
      type: 'certificate',
      available: true
    },
    {
      id: 4,
      title: 'MentorIT T-Shirt',
      description: 'Official MentorIT branded t-shirt',
      cost: 500,
      type: 'merchandise',
      available: true
    },
    {
      id: 5,
      title: 'Priority Support',
      description: '30 days of priority customer support',
      cost: 200,
      type: 'feature',
      available: true
    },
    {
      id: 6,
      title: '50% Course Discount',
      description: 'Get 50% off any course purchase',
      cost: 300,
      type: 'discount',
      available: false
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'course': return '📚';
      case 'quiz': return '🧩';
      case 'project': return '🛠️';
      case 'achievement': return '🏆';
      case 'daily': return '📅';
      case 'reward': return '🎁';
      default: return '📝';
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return '💰';
      case 'certificate': return '📜';
      case 'merchandise': return '👕';
      case 'feature': return '⚡';
      default: return '🎁';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-dark-primary)]">My Points</h1>
            <p className="text-[var(--color-text-dark-secondary)] mt-2">
              Earn points by learning and unlock amazing rewards
            </p>
          </div>

          {/* Points Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Current Points</p>
                  <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Total Earned</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Current Rank</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">#{currentRank}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-text-dark-secondary)]">Next Rank</p>
                  <p className="text-2xl font-bold text-[var(--color-text-dark-primary)]">{nextRankPoints}</p>
                  <p className="text-xs text-[var(--color-text-dark-tertiary)]">points needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'history', label: 'History', icon: '📝' },
                  { id: 'achievements', label: 'Achievements', icon: '🏆' },
                  { id: 'rewards', label: 'Rewards', icon: '🎁' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[var(--color-text-dark-secondary)] hover:text-[var(--color-text-dark-primary)]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Progress to Next Rank */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Rank Progress</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                            Rank #{currentRank}
                          </div>
                          <span className="text-[var(--color-text-dark-secondary)]">Next: Rank #{currentRank - 1}</span>
                        </div>
                        <span className="text-sm text-[var(--color-text-dark-secondary)]">
                          {nextRankPoints} points needed
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div 
                          className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${((currentPoints % 200) / 200) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Points Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Courses', points: 1200, icon: '📚' },
                        { label: 'Quizzes', points: 450, icon: '🧩' },
                        { label: 'Projects', points: 350, icon: '🛠️' },
                        { label: 'Achievements', points: 200, icon: '🏆' },
                        { label: 'Daily Bonus', points: 150, icon: '📅' }
                      ].map((item) => (
                        <div key={item.label} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl mb-2">{item.icon}</div>
                          <div className="text-lg font-semibold text-[var(--color-text-dark-primary)]">
                            {item.points.toLocaleString()}
                          </div>
                          <div className="text-sm text-[var(--color-text-dark-secondary)]">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Points History</h3>
                  <div className="space-y-4">
                    {pointHistory.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="text-2xl mr-4">{getCategoryIcon(transaction.category)}</div>
                          <div>
                            <h4 className="font-medium text-[var(--color-text-dark-primary)]">{transaction.source}</h4>
                            <p className="text-sm text-[var(--color-text-dark-secondary)]">{transaction.description}</p>
                            <p className="text-xs text-[var(--color-text-dark-tertiary)]">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className={`text-lg font-semibold ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">
                    Achievements ({achievements.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="text-4xl mr-4">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold text-[var(--color-text-dark-primary)]">{achievement.title}</h4>
                              <p className="text-sm text-[var(--color-text-dark-secondary)]">{achievement.description}</p>
                            </div>
                          </div>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-[var(--color-primary)]">
                            +{achievement.points} points
                          </div>
                          <div className="text-xs text-[var(--color-text-dark-tertiary)]">
                            {new Date(achievement.dateEarned).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-4">Available Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rewards.map((reward) => (
                      <div key={reward.id} className={`border border-gray-200 rounded-xl p-6 ${!reward.available ? 'opacity-60' : ''}`}>
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">{getRewardIcon(reward.type)}</div>
                          <h4 className="font-semibold text-[var(--color-text-dark-primary)]">{reward.title}</h4>
                          <p className="text-sm text-[var(--color-text-dark-secondary)] mt-2">{reward.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-[var(--color-primary)]">
                            {reward.cost} points
                          </div>
                          <button
                            disabled={!reward.available || currentPoints < reward.cost}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              reward.available && currentPoints >= reward.cost
                                ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {!reward.available ? 'Coming Soon' : currentPoints >= reward.cost ? 'Redeem' : 'Not Enough Points'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}