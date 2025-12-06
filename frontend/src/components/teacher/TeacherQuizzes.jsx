import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Plus, FileText, Clock, Users, Calendar, Edit, Eye, Trash2, X, Loader2, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, quizzesApi } from '../../services/api';

const TeacherQuizzes = () => {
    const { currentUser } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeLimit: 30,
        passingScore: 60,
        dueDate: '',
        courseId: '',
        totalQuestions: 10 // Simplified for now
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(false);
            // Fetch teacher's courses
            const allCourses = await coursesApi.getAll();
            const teacherCourses = allCourses.filter(
                course => course.instructorId === currentUser?.uid
            );
            setCourses(teacherCourses);

            // Fetch quizzes for all teacher's courses
            const allQuizzes = [];
            for (const course of teacherCourses) {
                try {
                    const courseQuizzes = await quizzesApi.getByCourse(course._id);
                    allQuizzes.push(...courseQuizzes.map(q => ({
                        ...q,
                        courseName: course.title
                    })));
                } catch (error) {
                    console.log(`No quizzes for course ${course._id}`);
                }
            }
            setQuizzes(allQuizzes);
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.courseId) {
            showNotification('Please select a course', 'error');
            return;
        }

        setSaving(true);
        try {
            // In a real app, we would have a question editor here
            // For now, we'll create a quiz with placeholder questions or just metadata
            await quizzesApi.create(formData.courseId, {
                title: formData.title,
                description: formData.description,
                timeLimit: parseInt(formData.timeLimit),
                passingScore: parseInt(formData.passingScore),
                dueDate: formData.dueDate,
                totalQuestions: parseInt(formData.totalQuestions),
                questions: [] // Placeholder
            });

            showNotification('Quiz created successfully!');
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                timeLimit: 30,
                passingScore: 60,
                dueDate: '',
                courseId: '',
                totalQuestions: 10
            });
            fetchData();
        } catch (error) {
            console.error('Error creating quiz:', error);
            showNotification('Failed to create quiz', 'error');
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return date;
        }
    };

    return (
        <TeacherLayout>
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    } text-white`}>
                    {notification.message}
                </div>
            )}

            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
                    <p className="text-gray-600 mt-1">Create and manage course quizzes and tests</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={courses.length === 0}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Quiz</span>
                </button>
            </div>

            {/* Empty State */}
            {quizzes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
                    <p className="text-gray-600 mb-4">
                        {courses.length === 0
                            ? 'Create a course first to add quizzes'
                            : 'Create your first quiz to test student knowledge'
                        }
                    </p>
                    {courses.length > 0 && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Create Quiz
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{quiz.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">{quiz.courseName}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(quiz.status)}`}>
                                    {quiz.status || 'active'}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                {quiz.description}
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Due:</span>
                                    <span className="font-medium text-gray-900">{formatDate(quiz.dueDate)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Time Limit:</span>
                                    <span className="font-medium text-gray-900">{quiz.timeLimit} mins</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Passing Score:</span>
                                    <span className="font-medium text-gray-900">{quiz.passingScore}%</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Eye className="w-4 h-4" />
                                    <span>View</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Create New Quiz</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course *
                                </label>
                                <select
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quiz Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter quiz title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter quiz description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time Limit (mins)
                                    </label>
                                    <input
                                        type="number"
                                        name="timeLimit"
                                        value={formData.timeLimit}
                                        onChange={handleInputChange}
                                        min="5"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passing Score (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="passingScore"
                                        value={formData.passingScore}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Questions
                                    </label>
                                    <input
                                        type="number"
                                        name="totalQuestions"
                                        value={formData.totalQuestions}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Create Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
};

export default TeacherQuizzes;
