import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { Clock, Trophy, Circle, Target, Play, CheckCircle, TrendingUp, Award, Users, Loader2, AlertCircle } from 'lucide-react';
import QuizTakingModal from './QuizTakingModal';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsApi, quizzesApi } from '../../services/api';

const QuizzesTestsPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('available');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, [currentUser]);

    const fetchQuizzes = async () => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // 1. Get enrolled courses
            const enrollments = await enrollmentsApi.getByUserId(currentUser.uid);

            if (enrollments.length === 0) {
                setQuizzes([]);
                setLoading(false);
                return;
            }

            // 2. Fetch quizzes for all enrolled courses
            const allQuizzes = [];
            await Promise.all(
                enrollments.map(async (enrollment) => {
                    try {
                        const courseQuizzes = await quizzesApi.getByCourse(enrollment.courseId);

                        courseQuizzes.forEach(quiz => {
                            // Check if student has attempted this quiz (logic would need backend support for attempts)
                            // For now, we'll assume available unless we have attempt data
                            // In a real app, we'd fetch attempts here too

                            allQuizzes.push({
                                ...quiz,
                                id: quiz._id || quiz.id,
                                courseId: enrollment.courseId,
                                courseName: enrollment.courseData?.title || 'Unknown Course',
                                professor: enrollment.courseData?.instructor || 'Unknown',
                                status: quiz.status || 'available', // Default
                                score: 0, // Placeholder until attempts are fetched
                                attempts: quiz.attempts || 0,
                                questionsCount: quiz.questions ? quiz.questions.length : (quiz.totalQuestions || 0),
                                duration: quiz.timeLimit || 30,
                                points: quiz.passingScore || 100,
                                difficulty: 'medium', // Default
                                dueDate: quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : 'No due date'
                            });
                        });
                    } catch (err) {
                        console.error(`Error fetching quizzes for course ${enrollment.courseId}:`, err);
                    }
                })
            );

            setQuizzes(allQuizzes);
            setError(null);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
            setError("Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };

    const availableQuizzes = quizzes.filter(q => q.status === 'available' || q.status === 'active');
    const completedQuizzes = quizzes.filter(q => q.status === 'completed'); // This logic needs backend 'attempts' integration to be accurate

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
                userId: currentUser.uid,
                score: (score / totalScore) * 100,
                timeTaken: 0, // You might want to track actual time
                answers: [] // Pass answers if needed
            };

            await quizzesApi.submitAttempt(selectedQuiz.courseId, quizId, attemptData);

            setIsQuizModalOpen(false);
            setSelectedQuiz(null);

            // Refresh quizzes to update status/score
            fetchQuizzes();
            setActiveTab('completed');
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Failed to submit quiz result");
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <StudentLayout>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quizzes & Tests</h1>
                    <p className="text-gray-600 mt-1">Test your knowledge and track your progress</p>
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

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                    <span className="text-gray-600">Loading quizzes...</span>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex gap-8">
                            {['available', 'completed', 'analytics'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-1 font-medium text-sm transition-colors relative capitalize ${activeTab === tab ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab} {tab !== 'analytics' && `(${tab === 'available' ? availableQuizzes.length : completedQuizzes.length})`}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'available' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableQuizzes.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No available quizzes found.</p>
                                    <p className="text-sm text-gray-400 mt-1">Quizzes created by your teachers will appear here.</p>
                                </div>
                            ) : availableQuizzes.map((quiz) => (
                                <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-gray-900 flex-1">{quiz.title}</h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-1">{quiz.courseName}</p>
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
                                                <p className="text-sm font-semibold text-gray-900">{quiz.points}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Circle className="w-4 h-4 text-green-600" />
                                            <div>
                                                <p className="text-xs text-gray-600">Questions</p>
                                                <p className="text-sm font-semibold text-gray-900">{quiz.questionsCount}</p>
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

                    {/* Placeholder for other tabs */}
                    {activeTab !== 'available' && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500">This section is being updated to reflect real-time data.</p>
                        </div>
                    )}
                </>
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
        </StudentLayout>
    );
};

export default QuizzesTestsPage;
