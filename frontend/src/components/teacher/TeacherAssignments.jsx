import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Plus, FileText, Clock, Users, Calendar, Edit, Eye, Trash2, X, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, assignmentsApi } from '../../services/api';

const TeacherAssignments = () => {
    const { currentUser } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');

    // View Submissions State
    const [viewingAssignment, setViewingAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ score: '', feedback: '' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxScore: 100,
        courseId: ''
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

            // Fetch assignments for all teacher's courses
            const allAssignments = [];
            for (const course of teacherCourses) {
                try {
                    const courseAssignments = await assignmentsApi.getByCourse(course.id);
                    allAssignments.push(...courseAssignments.map(a => ({
                        ...a,
                        id: a._id || a.id,
                        courseName: course.title
                    })));
                } catch (error) {
                    console.log(`No assignments for course ${course.id}`);
                }
            }
            setAssignments(allAssignments);
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

        // Check assignment limit for selected course
        const courseAssignments = assignments.filter(a => a.courseId === formData.courseId);
        if (courseAssignments.length >= 2) {
            showNotification('Maximum 2 assignments per course allowed', 'error');
            return;
        }

        setSaving(true);
        try {
            await assignmentsApi.create(formData.courseId, {
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate,
                maxScore: parseInt(formData.maxScore)
            });

            showNotification('Assignment created successfully!');
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                maxScore: 100,
                courseId: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error creating assignment:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to create assignment';
            showNotification(errorMsg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleViewSubmissions = async (assignment) => {
        setViewingAssignment(assignment);
        setLoadingSubmissions(true);
        try {
            const data = await assignmentsApi.getSubmissions(assignment.courseId, assignment.id);
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            showNotification('Failed to load submissions', 'error');
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleGradeSubmission = async (e) => {
        e.preventDefault();
        if (!gradingSubmission) return;

        setSaving(true);
        try {
            await assignmentsApi.gradeSubmission(gradingSubmission._id, {
                score: parseFloat(gradeData.score),
                feedback: gradeData.feedback,
                gradedBy: currentUser?.uid
            });

            showNotification('Assignment graded successfully!');
            setGradingSubmission(null);
            setGradeData({ score: '', feedback: '' });
            // Refresh submissions
            handleViewSubmissions(viewingAssignment);
        } catch (error) {
            console.error('Error grading assignment:', error);
            showNotification('Failed to grade assignment', 'error');
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return date;
        }
    };

    const stats = {
        total: assignments.length,
        active: assignments.filter(a => a.status === 'active').length,
        pending: assignments.reduce((acc, a) => acc + (a.submissions || 0), 0),
        avgRate: assignments.length > 0
            ? Math.round(assignments.reduce((acc, a) => acc + ((a.submissions || 0) / Math.max(a.totalStudents || 1, 1)), 0) / assignments.length * 100)
            : 0
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
                    <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                    <p className="text-gray-600 mt-1">Create and manage course assignments</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={courses.length === 0}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Assignment</span>
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</h3>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Courses</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{courses.length}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {assignments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                    <p className="text-gray-600 mb-4">
                        {courses.length === 0
                            ? 'Create a course first to add assignments'
                            : 'Create your first assignment to get started'
                        }
                    </p>
                    {courses.length > 0 && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Create Assignment
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{assignment.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">{assignment.courseName}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(assignment.status)}`}>
                                    {assignment.status || 'active'}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                {assignment.description}
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Due:</span>
                                    <span className="font-medium text-gray-900">{formatDate(assignment.dueDate)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Points:</span>
                                    <span className="font-medium text-gray-900">{assignment.maxScore || 100}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Submissions:</span>
                                    <span className="font-medium text-gray-900">{assignment.submissions || 0}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleViewSubmissions(assignment)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
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
                            <h2 className="text-xl font-semibold">Create New Assignment</h2>
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
                                    {courses.map(course => {
                                        const courseAssignmentCount = assignments.filter(a => a.courseId === course.id).length;
                                        const isLimitReached = courseAssignmentCount >= 2;
                                        return (
                                            <option
                                                key={course.id}
                                                value={course.id}
                                                disabled={isLimitReached}
                                            >
                                                {course.title} {isLimitReached ? '(2/2 assignments)' : `(${courseAssignmentCount}/2)`}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Maximum 2 assignments per course
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assignment Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter assignment title"
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
                                    placeholder="Enter assignment description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Score
                                    </label>
                                    <input
                                        type="number"
                                        name="maxScore"
                                        value={formData.maxScore}
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
                                    Create Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Submissions Modal */}
            {viewingAssignment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-semibold">Submissions: {viewingAssignment.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {submissions.length} submissions received
                                </p>
                            </div>
                            <button
                                onClick={() => setViewingAssignment(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingSubmissions ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                </div>
                            ) : submissions.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                                    <p className="text-gray-600">
                                        Students have not submitted this assignment yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {submissions.map((submission) => (
                                        <div key={submission._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Student ID: {submission.userId}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Submitted: {formatDate(submission.submittedAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {submission.driveLink && (
                                                        <a
                                                            href={submission.driveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            <span>View</span>
                                                        </a>
                                                    )}
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {submission.status === 'graded' ? `${submission.score}/${viewingAssignment.maxScore}` : 'Not Graded'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Grading Form */}
                                            {gradingSubmission?._id === submission._id ? (
                                                <form onSubmit={handleGradeSubmission} className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Score (out of {viewingAssignment.maxScore})
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={gradeData.score}
                                                                onChange={(e) => setGradeData(prev => ({ ...prev, score: e.target.value }))}
                                                                max={viewingAssignment.maxScore}
                                                                min="0"
                                                                step="0.5"
                                                                required
                                                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Feedback (Optional)
                                                        </label>
                                                        <textarea
                                                            value={gradeData.feedback}
                                                            onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                                                            rows={2}
                                                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                                            placeholder="Add feedback for student..."
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setGradingSubmission(null);
                                                                setGradeData({ score: '', feedback: '' });
                                                            }}
                                                            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={saving}
                                                            className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                                                        >
                                                            {saving ? 'Saving...' : 'Submit Grade'}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="mt-3 flex items-center justify-between">
                                                    {submission.feedback && (
                                                        <p className="text-sm text-gray-600 italic">"{submission.feedback}"</p>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setGradingSubmission(submission);
                                                            setGradeData({
                                                                score: submission.score || '',
                                                                feedback: submission.feedback || ''
                                                            });
                                                        }}
                                                        className="ml-auto px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                                                    >
                                                        {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
};

export default TeacherAssignments;
