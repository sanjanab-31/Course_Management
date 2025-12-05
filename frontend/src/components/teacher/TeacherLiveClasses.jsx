import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Video, Calendar, Clock, Users, Plus, MoreVertical, Play, Link as LinkIcon, X, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, liveClassesApi } from '../../services/api';

const TeacherLiveClasses = () => {
    const { currentUser } = useAuth();
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledAt: '',
        duration: 60,
        meetingLink: '',
        courseId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(false);
            const allCourses = await coursesApi.getAll();
            const teacherCourses = allCourses.filter(
                course => course.instructorId === currentUser?.uid
            );
            setCourses(teacherCourses);

            // Fetch live classes for all teacher's courses
            const allClasses = [];
            for (const course of teacherCourses) {
                try {
                    const courseClasses = await liveClassesApi.getByCourse(course.id);
                    allClasses.push(...courseClasses.map(c => ({
                        ...c,
                        courseName: course.title
                    })));
                } catch (error) {
                    console.log(`No classes for course ${course.id}`);
                }
            }
            setClasses(allClasses);
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
            await liveClassesApi.create(formData.courseId, {
                title: formData.title,
                description: formData.description,
                scheduledAt: formData.scheduledAt,
                duration: parseInt(formData.duration),
                meetingLink: formData.meetingLink,
                instructor: currentUser?.displayName || 'Teacher'
            });

            showNotification('Live class scheduled successfully!');
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                scheduledAt: '',
                duration: 60,
                meetingLink: '',
                courseId: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error creating live class:', error);
            showNotification('Failed to schedule live class', 'error');
        } finally {
            setSaving(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getClassStatus = (classItem) => {
        const now = new Date();
        const scheduledAt = new Date(classItem.scheduledAt);
        const endTime = new Date(scheduledAt.getTime() + (classItem.duration || 60) * 60000);

        if (now < scheduledAt) return 'upcoming';
        if (now >= scheduledAt && now <= endTime) return 'live';
        return 'completed';
    };

    const filteredClasses = classes.filter(c => {
        const status = getClassStatus(c);
        if (activeTab === 'upcoming') return status === 'upcoming';
        if (activeTab === 'live') return status === 'live';
        return status === 'completed';
    });

    // Loading state removed - always show content

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
                    <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
                    <p className="text-gray-600 mt-1">Schedule and manage your live sessions</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={courses.length === 0}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Class</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                {['upcoming', 'live', 'completed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${activeTab === tab
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-gray-600 hover:text-purple-700'
                            }`}
                    >
                        {tab} ({classes.filter(c => getClassStatus(c) === tab).length})
                    </button>
                ))}
            </div>

            {/* Classes Grid */}
            {filteredClasses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} classes</h3>
                    <p className="text-gray-600 mb-4">
                        {courses.length === 0
                            ? 'Create a course first to schedule classes'
                            : 'Schedule a live class to get started'
                        }
                    </p>
                    {courses.length > 0 && activeTab === 'upcoming' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Schedule Class
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((classItem) => {
                        const status = getClassStatus(classItem);
                        return (
                            <div key={classItem.id} className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${status === 'live' ? 'bg-red-100' :
                                                status === 'upcoming' ? 'bg-purple-100' : 'bg-gray-100'
                                            }`}>
                                            <Video className={`w-5 h-5 ${status === 'live' ? 'text-red-600' :
                                                    status === 'upcoming' ? 'text-purple-600' : 'text-gray-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{classItem.title}</h3>
                                            <p className="text-sm text-gray-500">{classItem.courseName}</p>
                                        </div>
                                    </div>
                                    {status === 'live' && (
                                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            LIVE
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {classItem.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {formatDateTime(classItem.scheduledAt)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {classItem.duration || 60} minutes
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="w-4 h-4 mr-2" />
                                        {classItem.attendees || 0} attendees
                                    </div>
                                </div>

                                {status === 'live' ? (
                                    <a
                                        href={classItem.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        <Play className="w-4 h-4" />
                                        Join Session
                                    </a>
                                ) : status === 'upcoming' ? (
                                    <div className="flex gap-2">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                            <LinkIcon className="w-4 h-4" />
                                            Copy Link
                                        </button>
                                    </div>
                                ) : (
                                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg" disabled>
                                        Completed
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Schedule Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Schedule Live Class</h2>
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
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter class title"
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
                                    placeholder="What will be covered in this class?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Schedule Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="scheduledAt"
                                        value={formData.scheduledAt}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        min="15"
                                        max="300"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meeting Link *
                                </label>
                                <input
                                    type="url"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://meet.google.com/..."
                                />
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
                                    Schedule Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
};

export default TeacherLiveClasses;
