import React, { useState, useEffect } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import { Clock, Trophy, Circle, Target, Play, CheckCircle, TrendingUp, Award, Users, Loader2 } from 'lucide-react';
import QuizTakingModal from './QuizTakingModal';
import { useAuth } from '../../context/AuthContext';
import { getAllStudentEnrollments } from '../../services/courseService';
import { subscribeToCourseQuizzes, subscribeToQuizAttempts, submitQuizAttempt } from '../../services/quizService';

const QuizzesTestsPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('available');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // Fetch enrolled courses and set up listeners
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        let quizUnsubscribes = [];
        let attemptUnsubscribes = [];

        const fetchEnrollmentsAndSetupListeners = async () => {
            try {
                setLoading(false);
                // 1. Get enrolled courses
                const enrollments = await getAllStudentEnrollments(currentUser.uid);
                const courses = enrollments.map(e => ({
                    id: e.courseId,
                    name: e.courseData.name,
                    professor: e.courseData.professor,
                    ...e.courseData
                }));
                setEnrolledCourses(courses);

                // 2. For each course, subscribe to quizzes
                courses.forEach(course => {
                    const unsubQuiz = subscribeToCourseQuizzes(course.id, (courseQuizzes) => {
                        // Update quizzes state
                        setQuizzes(prevQuizzes => {
                            // Remove existing quizzes for this course to avoid duplicates/stale data
                            const otherQuizzes = prevQuizzes.filter(q => q.courseId !== course.id);

                            // Process new quizzes
                            const newQuizzes = courseQuizzes.map(quiz => ({
                                ...quiz,
                                courseName: course.name,
                                professor: course.professor,
                                status: 'available', // Default, will be updated by attempts listener
                                score: 0,
                                attempts: quiz.attempts || 3, // Default max attempts
                                questionsCount: quiz.questions ? quiz.questions.length : (quiz.questionsData ? quiz.questionsData.length : 0),
                                questionsData: quiz.questionsData || [],
                                duration: quiz.duration || 30
                            }));

                            // Setup attempt listeners for these quizzes
                            newQuizzes.forEach(quiz => {
                                const unsubAttempt = subscribeToQuizAttempts(course.id, quiz.id, currentUser.uid, (attempts) => {
                                    setQuizzes(currentQuizzes => {
                                        return currentQuizzes.map(q => {
                                            if (q.id === quiz.id) {
                                                const lastAttempt = attempts.length > 0 ? attempts[0] : null;
                                                const bestScore = attempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);

                                                return {
                                                    ...q,
                                                    status: attempts.length > 0 ? 'completed' : 'available',
                                                    score: lastAttempt ? lastAttempt.score : 0,
                                                    bestScore: bestScore,
                                                    completedDate: lastAttempt ? new Date(lastAttempt.submittedAt?.toDate()).toLocaleDateString() : null,
                                                    attemptsUsed: attempts.length
                                                };
                                            }
                                            return q;
                                        });
                                    });
                                });
                                attemptUnsubscribes.push(unsubAttempt);
                            });

                            return [...otherQuizzes, ...newQuizzes];
                        });
                    });
                    quizUnsubscribes.push(unsubQuiz);
                });

                setLoading(false);
            } catch (error) {
                console.error("Error setting up quiz listeners:", error);
                setLoading(false);
            }
        };

        fetchEnrollmentsAndSetupListeners();

        return () => {
            quizUnsubscribes.forEach(unsub => unsub());
            attemptUnsubscribes.forEach(unsub => unsub());
        };
    }, [currentUser]);

    const availableQuizzes = quizzes.filter(q => q.status === 'available');
    const completedQuizzes = quizzes.filter(q => q.status === 'completed');

    const avgScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((acc, q) => acc + q.score, 0) / completedQuizzes.length)
        : 0;

    const handleStartQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setIsQuizModalOpen(true);
    };

    const handleQuizComplete = async (quizId, score, totalScore) => {
        try {
            if (!selectedQuiz) return;

            const attemptData = {
                score: (score / totalScore) * 100, // Store as percentage
                rawScore: score,
                totalScore: totalScore,
                answers: [] // You might want to pass answers here if available
            };

            await submitQuizAttempt(selectedQuiz.courseId, quizId, currentUser.uid, attemptData);

            setIsQuizModalOpen(false);
            setSelectedQuiz(null);
            setActiveTab('completed');
        } catch (error) {
            console.error("Error submitting quiz:", error);
            // Handle error (show notification)
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'hard':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };



    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Test your knowledge and track your progress</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{availableQuizzes.length}</p>
                        <p className="text-sm text-gray-600">Available</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{avgScore}%</p>
                        <p className="text-sm text-gray-600">Avg Score</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'available'
                            ? 'text-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Available ({availableQuizzes.length})
                        {activeTab === 'available' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'completed'
                            ? 'text-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Completed ({completedQuizzes.length})
                        {activeTab === 'completed' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'analytics'
                            ? 'text-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Performance Analytics
                        {activeTab === 'analytics' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'available' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableQuizzes.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No available quizzes found. Enroll in courses to see quizzes here.
                        </div>
                    ) : availableQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex-1">{quiz.title}</h3>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                                    {quiz.difficulty}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-1">{quiz.courseName}: <span className="font-medium">{quiz.professor}</span></p>
                            <p className="text-sm text-gray-600 mb-4">Due: {quiz.dueDate}</p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Duration</p>
                                        <p className="text-sm font-semibold text-gray-900">{quiz.duration} mins</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Points</p>
                                        <p className="text-sm font-semibold text-gray-900">{quiz.points} points</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Questions</p>
                                        <p className="text-sm font-semibold text-gray-900">{quiz.questionsCount} questions</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Attempts</p>
                                        <p className="text-sm font-semibold text-gray-900">{quiz.attempts} attempts</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleStartQuiz(quiz)}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Play className="w-4 h-4" />
                                Start Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'completed' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedQuizzes.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No completed quizzes yet.
                        </div>
                    ) : completedQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex-1">{quiz.title}</h3>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Completed
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-1">{quiz.courseName}: <span className="font-medium">{quiz.professor}</span></p>
                            <p className="text-sm text-gray-600 mb-4">Completed: {quiz.completedDate}</p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Your Score</span>
                                    <span className="text-2xl font-bold text-green-600">{Math.round(quiz.score)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all"
                                        style={{ width: `${quiz.score}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Duration</p>
                                        <p className="text-sm font-semibold text-gray-900">{quiz.duration} mins</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Points</p>
                                        <p className="text-sm font-semibold text-gray-900">{quiz.points} points</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-colors">
                                View Results
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{avgScore}%</h3>
                            <p className="text-sm text-gray-600">Average Score</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{completedQuizzes.length}</h3>
                            <p className="text-sm text-gray-600">Quizzes Completed</p>
                            <p className="text-xs text-gray-500 mt-1">Total</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">--</h3>
                            <p className="text-sm text-gray-600">Class Ranking</p>
                            <p className="text-xs text-gray-500 mt-1">Not available yet</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Performance</h3>
                        <div className="space-y-3">
                            {completedQuizzes.length === 0 ? (
                                <p className="text-gray-500 text-sm">No quizzes completed yet.</p>
                            ) : (
                                completedQuizzes.slice(0, 5).map((quiz) => (
                                    <div key={quiz.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 text-sm">{quiz.title}</p>
                                            <p className="text-xs text-gray-600">{quiz.courseName} • {quiz.completedDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${quiz.score >= 90 ? 'text-green-600' : quiz.score >= 75 ? 'text-blue-600' : 'text-yellow-600'}`}>
                                                {Math.round(quiz.score)}%
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Quiz Taking Modal */}
            {isQuizModalOpen && selectedQuiz && (
                <QuizTakingModal
                    quiz={selectedQuiz}
                    onClose={() => {
                        setIsQuizModalOpen(false);
                        setSelectedQuiz(null);
                    }}
                    onComplete={handleQuizComplete}
                />
            )}
        </DashboardLayout>
    );
};

export default QuizzesTestsPage;
