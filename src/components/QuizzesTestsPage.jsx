import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Clock, CheckCircle, XCircle } from 'lucide-react';

const QuizzesTestsPage = () => {
    const navigate = useNavigate();

    const quizzes = [
        {
            id: 1,
            title: 'Data Structures Mid-Term Quiz',
            course: 'Data Structures',
            questions: 20,
            duration: '30 min',
            status: 'completed',
            score: 95,
            totalScore: 100
        },
        {
            id: 2,
            title: 'DBMS Chapter 5 Quiz',
            course: 'Database Management',
            questions: 15,
            duration: '20 min',
            status: 'available',
            dueDate: 'Dec 7, 2025'
        },
        {
            id: 3,
            title: 'OS Theory Test',
            course: 'Operating Systems',
            questions: 25,
            duration: '45 min',
            status: 'upcoming',
            availableOn: 'Dec 10, 2025'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins'] p-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Quizzes & Tests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <Award className="w-8 h-8 text-blue-600" />
                            {quiz.status === 'completed' && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>COMPLETED</span>
                                </span>
                            )}
                            {quiz.status === 'available' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                    AVAILABLE
                                </span>
                            )}
                            {quiz.status === 'upcoming' && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                    UPCOMING
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{quiz.course}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Questions</span>
                                <span className="font-semibold text-gray-900">{quiz.questions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Duration</span>
                                <span className="font-semibold text-gray-900">{quiz.duration}</span>
                            </div>
                            {quiz.status === 'completed' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Score</span>
                                    <span className="font-semibold text-green-600">{quiz.score}/{quiz.totalScore}</span>
                                </div>
                            )}
                            {quiz.status === 'available' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Due Date</span>
                                    <span className="font-semibold text-orange-600">{quiz.dueDate}</span>
                                </div>
                            )}
                            {quiz.status === 'upcoming' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Available On</span>
                                    <span className="font-semibold text-gray-900">{quiz.availableOn}</span>
                                </div>
                            )}
                        </div>

                        <button className={`w-full px-4 py-2 rounded-lg font-semibold ${quiz.status === 'completed'
                                ? 'bg-gray-100 text-gray-600'
                                : quiz.status === 'available'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}>
                            {quiz.status === 'completed' ? 'View Results' : quiz.status === 'available' ? 'Start Quiz' : 'Not Available'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizzesTestsPage;
