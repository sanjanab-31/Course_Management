import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Clock, Trophy, Circle, Target, Play, CheckCircle, TrendingUp, Award, Users } from 'lucide-react';
import QuizTakingModal from './QuizTakingModal';

const QuizzesTestsPage = () => {
    const [activeTab, setActiveTab] = useState('available');
    const [quizzes, setQuizzes] = useState([
        {
            id: 1,
            title: 'Data Structures Quiz - Trees',
            course: 'Data Structures',
            professor: 'Prof. Nishant Kumar',
            difficulty: 'Medium',
            duration: 30,
            points: 50,
            questions: 15,
            attempts: 3,
            dueDate: '9/26/2024',
            status: 'available',
            questionsData: [
                {
                    id: 1,
                    question: 'What is the time complexity of searching in a balanced BST?',
                    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
                    correctAnswer: 1
                },
                {
                    id: 2,
                    question: 'Which traversal visits the root node first?',
                    options: ['Inorder', 'Preorder', 'Postorder', 'Level order'],
                    correctAnswer: 1
                },
                {
                    id: 3,
                    question: 'What is the maximum number of children a binary tree node can have?',
                    options: ['1', '2', '3', 'Unlimited'],
                    correctAnswer: 1
                },
                {
                    id: 4,
                    question: 'Which data structure is used for BFS traversal?',
                    options: ['Stack', 'Queue', 'Array', 'Linked List'],
                    correctAnswer: 1
                },
                {
                    id: 5,
                    question: 'What is the height of a tree with only one node?',
                    options: ['-1', '0', '1', '2'],
                    correctAnswer: 1
                },
                {
                    id: 6,
                    question: 'In which tree traversal is the left subtree visited first?',
                    options: ['Preorder only', 'Inorder only', 'Both Preorder and Inorder', 'Postorder only'],
                    correctAnswer: 2
                },
                {
                    id: 7,
                    question: 'What is a complete binary tree?',
                    options: ['All levels are filled', 'All levels except last are filled', 'Only root exists', 'Tree with one child'],
                    correctAnswer: 1
                },
                {
                    id: 8,
                    question: 'Which tree is always balanced?',
                    options: ['Binary Tree', 'BST', 'AVL Tree', 'General Tree'],
                    correctAnswer: 2
                },
                {
                    id: 9,
                    question: 'What is the space complexity of DFS?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                    correctAnswer: 2
                },
                {
                    id: 10,
                    question: 'Which node has no children?',
                    options: ['Root', 'Internal', 'Leaf', 'Parent'],
                    correctAnswer: 2
                },
                {
                    id: 11,
                    question: 'What is the minimum number of nodes in a binary tree of height h?',
                    options: ['h', 'h+1', '2^h', '2^h - 1'],
                    correctAnswer: 1
                },
                {
                    id: 12,
                    question: 'Which traversal gives sorted order in BST?',
                    options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
                    correctAnswer: 1
                },
                {
                    id: 13,
                    question: 'What is a binary search tree?',
                    options: ['Left < Root < Right', 'Left > Root > Right', 'No order', 'Random order'],
                    correctAnswer: 0
                },
                {
                    id: 14,
                    question: 'Which operation is NOT O(log n) in balanced BST?',
                    options: ['Search', 'Insert', 'Delete', 'Traversal'],
                    correctAnswer: 3
                },
                {
                    id: 15,
                    question: 'What is the degree of a leaf node?',
                    options: ['0', '1', '2', 'Variable'],
                    correctAnswer: 0
                }
            ]
        },
        {
            id: 2,
            title: 'DBMS Mid-Term Test',
            course: 'Database Management',
            professor: 'Dr. Deepak Sharma',
            difficulty: 'Hard',
            duration: 60,
            points: 100,
            questions: 25,
            attempts: 1,
            dueDate: '9/28/2024',
            status: 'available',
            questionsData: []
        },
        {
            id: 3,
            title: 'Operating Systems Quick Quiz',
            course: 'Operating Systems',
            professor: 'Prof. Satyam Singh',
            difficulty: 'Easy',
            duration: 20,
            points: 30,
            questions: 10,
            attempts: 3,
            dueDate: '9/25/2024',
            status: 'available',
            questionsData: []
        },
        {
            id: 4,
            title: 'Data Structures Mid-Term Quiz',
            course: 'Data Structures',
            professor: 'Prof. Nishant Kumar',
            difficulty: 'Medium',
            duration: 30,
            points: 50,
            questions: 20,
            attempts: 3,
            dueDate: '9/20/2024',
            status: 'completed',
            score: 95,
            totalScore: 100,
            completedDate: '9/19/2024'
        },
        {
            id: 5,
            title: 'DBMS Chapter 5 Quiz',
            course: 'Database Management',
            professor: 'Dr. Deepak Sharma',
            difficulty: 'Easy',
            duration: 20,
            points: 25,
            questions: 15,
            attempts: 2,
            dueDate: '9/15/2024',
            status: 'completed',
            score: 88,
            totalScore: 100,
            completedDate: '9/14/2024'
        },
        {
            id: 6,
            title: 'OS Theory Test',
            course: 'Operating Systems',
            professor: 'Prof. Satyam Singh',
            difficulty: 'Hard',
            duration: 45,
            points: 75,
            questions: 25,
            attempts: 1,
            dueDate: '9/10/2024',
            status: 'completed',
            score: 81,
            totalScore: 100,
            completedDate: '9/9/2024'
        }
    ]);

    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const availableQuizzes = quizzes.filter(q => q.status === 'available');
    const completedQuizzes = quizzes.filter(q => q.status === 'completed');

    const avgScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((acc, q) => acc + q.score, 0) / completedQuizzes.length)
        : 0;

    const handleStartQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setIsQuizModalOpen(true);
    };

    const handleQuizComplete = (quizId, score, totalScore) => {
        setQuizzes(prevQuizzes => prevQuizzes.map(quiz => {
            if (quiz.id === quizId) {
                return {
                    ...quiz,
                    status: 'completed',
                    score: score,
                    totalScore: totalScore,
                    completedDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
                };
            }
            return quiz;
        }));
        setIsQuizModalOpen(false);
        setSelectedQuiz(null);
        setActiveTab('completed');
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
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

    const getCurrentDate = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const now = new Date();
        return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quizzes & Tests</h1>
                    <p className="text-sm text-gray-600 mt-1">Test your knowledge and track your progress</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600 mb-3">{getCurrentDate()}</p>
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
                    {availableQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex-1">{quiz.title}</h3>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                                    {quiz.difficulty}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-1">{quiz.course}: <span className="font-medium">{quiz.professor}</span></p>
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
                                        <p className="text-sm font-semibold text-gray-900">{quiz.questions} questions</p>
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
                    {completedQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex-1">{quiz.title}</h3>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Completed
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-1">{quiz.course}: <span className="font-medium">{quiz.professor}</span></p>
                            <p className="text-sm text-gray-600 mb-4">Completed: {quiz.completedDate}</p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Your Score</span>
                                    <span className="text-2xl font-bold text-green-600">{quiz.score}%</span>
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
                            <p className="text-xs text-gray-500 mt-1">This Semester</p>
                            <p className="text-xs text-green-600 font-semibold mt-1">+3 this week</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">#5</h3>
                            <p className="text-sm text-gray-600">Class Ranking</p>
                            <p className="text-xs text-gray-500 mt-1">Out of 45 students</p>
                            <p className="text-xs text-purple-600 font-semibold mt-1">Top 11%</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Performance</h3>
                        <div className="space-y-3">
                            {completedQuizzes.slice(0, 5).map((quiz) => (
                                <div key={quiz.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">{quiz.title}</p>
                                        <p className="text-xs text-gray-600">{quiz.course} • {quiz.completedDate}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${quiz.score >= 90 ? 'text-green-600' : quiz.score >= 75 ? 'text-blue-600' : 'text-yellow-600'}`}>
                                            {quiz.score}%
                                        </p>
                                    </div>
                                </div>
                            ))}
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
