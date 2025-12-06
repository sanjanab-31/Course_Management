import React, { useState, useEffect } from 'react';
import { X, Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from 'lucide-react';

const QuizTakingModal = ({ quiz, onClose, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(quiz.duration * 60); // Convert minutes to seconds
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId, answerIndex) => {
        setAnswers({
            ...answers,
            [questionId]: answerIndex
        });
    };

    const toggleFlag = (questionIndex) => {
        const newFlagged = new Set(flaggedQuestions);
        if (newFlagged.has(questionIndex)) {
            newFlagged.delete(questionIndex);
        } else {
            newFlagged.add(questionIndex);
        }
        setFlaggedQuestions(newFlagged);
    };

    const calculateScore = () => {
        if (!quiz?.questionsData || quiz.questionsData.length === 0) {
            return 0;
        }
        let correct = 0;
        quiz.questionsData.forEach((question) => {
            if (answers[question.id] === question.correctAnswer) {
                correct++;
            }
        });
        return Math.round((correct / quiz.questionsData.length) * 100);
    };

    const handleSubmit = () => {
        const score = calculateScore();
        onComplete(quiz.id, score, 100);
    };

    const handleAutoSubmit = () => {
        const score = calculateScore();
        onComplete(quiz.id, score, 100);
    };

    const getQuestionStatus = (index) => {
        if (!quiz?.questionsData || !quiz.questionsData[index]) {
            return 'unanswered';
        }
        const question = quiz.questionsData[index];
        if (answers[question.id] !== undefined) {
            return 'answered';
        }
        return 'unanswered';
    };

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = quiz?.questionsData?.length || 0;

    if (!quiz?.questionsData || quiz.questionsData.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Not Available</h3>
                        <p className="text-gray-600 mb-6">This quiz doesn't have questions configured yet.</p>
                        <button
                            onClick={onClose}
                            className="bg-[#0277bd] hover:bg-[#0277bd] text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestionData = quiz.questionsData[currentQuestion];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{quiz.title}</h2>
                        <p className="text-sm text-gray-300">Question {currentQuestion + 1} of {totalQuestions}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span className={`text-lg font-bold ${timeRemaining < 60 ? 'text-red-400' : ''}`}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="hover:bg-gray-800 p-2 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 h-2">
                    <div
                        className="bg-blue-600 h-2 transition-all duration-300"
                        style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                    ></div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Main Content */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        {/* Question */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 flex-1">
                                    {currentQuestion + 1}. {currentQuestionData.question}
                                </h3>
                                <button
                                    onClick={() => toggleFlag(currentQuestion)}
                                    className={`ml-4 p-2 rounded-lg transition-colors ${flaggedQuestions.has(currentQuestion)
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <Flag className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQuestionData.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(currentQuestionData.id, index)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestionData.id] === index
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestionData.id] === index
                                                ? 'border-blue-600 bg-blue-600'
                                                : 'border-gray-300'
                                                }`}>
                                                {answers[currentQuestionData.id] === index && (
                                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className="text-gray-900 font-medium">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${currentQuestion === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous
                            </button>

                            {currentQuestion === totalQuestions - 1 ? (
                                <button
                                    onClick={() => setShowSubmitConfirm(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Submit Quiz
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Question Palette Sidebar */}
                    <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
                        <h4 className="font-bold text-gray-900 mb-4">Questions</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {quiz.questionsData.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all relative ${currentQuestion === index
                                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                                        : getQuestionStatus(index) === 'answered'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {index + 1}
                                    {flaggedQuestions.has(index) && (
                                        <Flag className="w-3 h-3 text-yellow-600 absolute top-0 right-0" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-100 rounded"></div>
                                <span className="text-gray-600">Answered ({answeredCount})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                                <span className="text-gray-600">Not Answered ({totalQuestions - answeredCount})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                                <span className="text-gray-600">Current</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Quiz?</h3>
                        <p className="text-gray-600 mb-2">
                            You have answered <span className="font-bold text-gray-900">{answeredCount}</span> out of{' '}
                            <span className="font-bold text-gray-900">{totalQuestions}</span> questions.
                        </p>
                        {answeredCount < totalQuestions && (
                            <p className="text-yellow-600 text-sm mb-6">
                                ⚠️ You have {totalQuestions - answeredCount} unanswered question(s).
                            </p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitConfirm(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Review
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizTakingModal;
