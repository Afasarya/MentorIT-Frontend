'use client';

import React, { useState, useEffect, use } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient, ModuleItem, SubModule, Quiz, ProjectPage } from '@/lib/api';

interface LearningItemPageProps {
  params: Promise<{ courseId: string; itemId: string }>;
}

export default function LearningItemPage({ params }: LearningItemPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [item, setItem] = useState<ModuleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Video states for SubModule
  const [videoCompleted, setVideoCompleted] = useState(false);

  useEffect(() => {
    fetchItemDetail();
  }, [resolvedParams.itemId]);

  const fetchItemDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getModuleItem(resolvedParams.itemId);
      if (response.data) {
        setItem(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch item detail');
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleVideoEnd = () => {
    setVideoCompleted(true);
  };

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    const quiz = item?.data as Quiz;
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    const quiz = item?.data as Quiz;
    if (!quiz?.questions) return;

    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correct++;
      }
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizCompleted(true);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
    setShowResults(false);
  };

  const isQuizComplete = () => {
    const quiz = item?.data as Quiz;
    if (!quiz?.questions) return false;
    
    return quiz.questions.every((_, index) => selectedAnswers[index] !== undefined);
  };

  const renderSubModule = (subModule: SubModule) => {
    const youtubeId = subModule.youtube_url ? extractYouTubeId(subModule.youtube_url) : null;
    
    return (
      <div className="space-y-8">
        {/* Video Section */}
        {youtubeId && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Pembelajaran</h3>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&modestbranding=1&rel=0`}
                title={subModule.title}
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => {
                  // You can add video tracking logic here
                  setTimeout(() => setVideoCompleted(true), 5000); // Simulate video completion after 5s
                }}
              />
            </div>
            {videoCompleted && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium">Video pembelajaran selesai ditonton!</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Materi Pembelajaran</h3>
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-line">{subModule.content}</div>
          </div>
        </div>

        {/* Completion Button */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Tandai sebagai selesai</h4>
              <p className="text-sm text-gray-600">Klik tombol ini setelah Anda selesai mempelajari materi</p>
            </div>
            <button
              onClick={() => {
                // Mark as completed logic
                alert('Pembelajaran ditandai sebagai selesai!');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-colors"
              disabled={!videoCompleted && !!youtubeId}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = (quiz: Quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      return (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz Belum Tersedia</h3>
          <p className="text-gray-600">Quiz ini belum memiliki pertanyaan.</p>
        </div>
      );
    }

    if (showResults) {
      return (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              quizScore >= 70 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {quizScore >= 70 ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${quizScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {quizScore >= 70 ? 'Selamat!' : 'Belum Lulus'}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">{quizScore}/100</p>
            <p className="text-gray-600 mb-6">
              {quizScore >= 70 
                ? 'Anda telah lulus quiz dengan nilai di atas 70!' 
                : 'Nilai Anda belum mencapai batas kelulusan (70). Silakan coba lagi.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Coba Lagi
              </button>
              {quizScore >= 70 && (
                <Link
                  href={`/student/learning/${resolvedParams.courseId}`}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-colors"
                >
                  Lanjutkan
                </Link>
              )}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Review Jawaban</h4>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.answer;
                
                return (
                  <div key={index} className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Pertanyaan {index + 1}</h5>
                      {isCorrect ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <p className="text-gray-800 mb-3">{question.question}</p>
                    <div className="space-y-2">
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        <strong>Jawaban Anda:</strong> {userAnswer || 'Tidak dijawab'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700">
                          <strong>Jawaban Benar:</strong> {question.answer}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const userAnswer = selectedAnswers[currentQuestionIndex];
    
    return (
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quiz: {quiz.title}</h3>
            <span className="text-sm text-gray-600">
              Pertanyaan {currentQuestionIndex + 1} dari {quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.question}</h4>
          <div className="space-y-3">
            {(typeof currentQuestion.options === 'string' ? JSON.parse(currentQuestion.options) : currentQuestion.options).map((option: string, optIndex: number) => (
              <label
                key={optIndex}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  userAnswer === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleQuizAnswer(currentQuestionIndex, e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  userAnswer === option
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                  {userAnswer === option && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Sebelumnya
            </button>
            
            <div className="flex gap-3">
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  disabled={!isQuizComplete()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-xl transition-colors"
                >
                  Selesai Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={!userAnswer}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-xl transition-colors"
                >
                  Selanjutnya →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProject = (project: ProjectPage) => {
    return (
      <div className="space-y-8">
        {/* Project Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2-2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Project Akhir
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Real Project, Real Impact
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Guide */}
        {project.guide && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-medium text-blue-900 mb-4">Panduan Project</h4>
            <div className="text-blue-800 whitespace-pre-line">{project.guide}</div>
          </div>
        )}

        {/* Submission Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Submit Project Anda</h4>
          <p className="text-gray-600 mb-6">
            Setelah menyelesaikan project, submit hasil karya Anda untuk direview oleh mentor. 
            Project yang telah disetujui akan menandai penyelesaian course ini.
          </p>
          <Link
            href={`/student/projects/submit/${project.id}`}
            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit Project
          </Link>
        </div>

        {/* Tips Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h4 className="font-medium text-yellow-900 mb-3">💡 Tips untuk Project yang Baik</h4>
          <ul className="text-yellow-800 space-y-2 text-sm">
            <li>• Pastikan project Anda menyelesaikan masalah nyata</li>
            <li>• Gunakan teknologi dan konsep yang telah dipelajari di course</li>
            <li>• Dokumentasikan project dengan baik di README</li>
            <li>• Deploy project Anda agar dapat diakses secara online</li>
            <li>• Sertakan screenshot dan penjelasan fitur utama</li>
          </ul>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading content...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !item) {
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Content Not Found</h3>
              <p className="text-gray-600 mb-6">{error || 'The learning content you\'re trying to access doesn\'t exist.'}</p>
              <Link
                href={`/student/learning/${resolvedParams.courseId}`}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const itemData = item.data as SubModule | Quiz | ProjectPage;

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/student/learning/${resolvedParams.courseId}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{(itemData as any)?.title || 'Learning Content'}</h1>
              <p className="text-gray-600 mt-1">
                {item.item_type === 'submodule' && 'Pembelajaran'}
                {item.item_type === 'quiz' && 'Quiz'}
                {item.item_type === 'project' && 'Project Akhir'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {item.item_type === 'submodule' && renderSubModule(itemData as SubModule)}
            {item.item_type === 'quiz' && renderQuiz(itemData as Quiz)}
            {item.item_type === 'project' && renderProject(itemData as ProjectPage)}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}