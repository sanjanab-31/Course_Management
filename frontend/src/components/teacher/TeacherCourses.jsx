import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Plus, Users, Calendar, BookOpen, Edit, Eye, Trash2, X, Loader2, Video, PlayCircle, GripVertical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, lecturesApi } from '../../services/api';

const TeacherCourses = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    // Lecture management state
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [lectureFormData, setLectureFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: 1
    });
    const [editingLecture, setEditingLecture] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Computer Science',
        level: 'Beginner',
        duration: '',
        image: '',
        totalLectures: 0
    });

    const categories = [
        'Computer Science',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Engineering',
        'Business',
        'Design'
    ];

    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(false);
            const allCourses = await coursesApi.getAll();
            // Filter courses by current teacher
            const teacherCourses = allCourses.filter(
                course => course.instructorId === currentUser?.uid
            );
            setCourses(teacherCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showNotification('Failed to load courses', 'error');
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
        setSaving(true);

        try {
            const courseData = {
                ...formData,
                instructor: currentUser?.displayName || 'Teacher',
                instructorId: currentUser?.uid,
                totalLectures: parseInt(formData.totalLectures) || 0
            };

            if (editingCourse) {
                const courseId = editingCourse.id || editingCourse._id;
                await coursesApi.update(courseId, courseData);
                showNotification('Course updated successfully!');
            } else {
                await coursesApi.create(courseData);
                showNotification('Course created successfully!');
            }

            setShowModal(false);
            setEditingCourse(null);
            setFormData({
                title: '',
                description: '',
                category: 'Computer Science',
                level: 'Beginner',
                duration: '',
                image: '',
                totalLectures: 0
            });
            fetchCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            showNotification('Failed to save course', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title || '',
            description: course.description || '',
            category: course.category || 'Computer Science',
            level: course.level || 'Beginner',
            duration: course.duration || '',
            image: course.image || '',
            totalLectures: course.totalLectures || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await coursesApi.delete(courseId);
            showNotification('Course deleted successfully!');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            showNotification('Failed to delete course', 'error');
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({
            title: '',
            description: '',
            category: 'Computer Science',
            level: 'Beginner',
            duration: '',
            image: '',
            totalLectures: 0
        });
        setShowModal(true);
    };

    // ==================== LECTURE MANAGEMENT FUNCTIONS ====================

    const openLectureManager = async (course) => {
        setSelectedCourse(course);
        setShowLectureModal(true);
        await fetchLectures(course.id || course._id);
    };

    const fetchLectures = async (courseId) => {
        try {
            const lecturesData = await lecturesApi.getByCourse(courseId);
            setLectures(lecturesData.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Error fetching lectures:', error);
            showNotification('Failed to load lectures', 'error');
        }
    };

    const handleLectureInputChange = (e) => {
        const { name, value } = e.target;
        setLectureFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLectureSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const courseId = selectedCourse.id || selectedCourse._id;

            if (editingLecture) {
                await lecturesApi.update(courseId, editingLecture.id || editingLecture._id, lectureFormData);
                showNotification('Lecture updated successfully!');
            } else {
                await lecturesApi.create(courseId, lectureFormData);
                showNotification('Lecture created successfully!');
            }

            resetLectureForm();
            await fetchLectures(courseId);
            await fetchCourses(); // Refresh courses to update totalLectures count
        } catch (error) {
            console.error('Error saving lecture:', error);
            showNotification('Failed to save lecture', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleLectureEdit = (lecture) => {
        setEditingLecture(lecture);
        setLectureFormData({
            title: lecture.title,
            description: lecture.description || '',
            videoUrl: lecture.videoUrl,
            duration: lecture.duration,
            order: lecture.order
        });
    };

    const handleLectureDelete = async (lectureId) => {
        if (!window.confirm('Are you sure you want to delete this lecture?')) return;

        try {
            const courseId = selectedCourse.id || selectedCourse._id;
            await lecturesApi.delete(courseId, lectureId);
            showNotification('Lecture deleted successfully!');
            await fetchLectures(courseId);
            await fetchCourses(); // Refresh courses to update totalLectures count
        } catch (error) {
            console.error('Error deleting lecture:', error);
            showNotification('Failed to delete lecture', 'error');
        }
    };

    const resetLectureForm = () => {
        setEditingLecture(null);
        setLectureFormData({
            title: '',
            description: '',
            videoUrl: '',
            duration: '',
            order: lectures.length + 1
        });
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                    <p className="text-gray-600 mt-1">Manage and create courses for your students</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Course
                </button>
            </div>

            {/* Courses Grid */}
            {courses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">Create your first course to get started</p>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Create Course
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <img
                                src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                                alt={course.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                        {course.category}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                        {course.level}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.students || 0} students</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{course.totalLectures || 0} lectures</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => openLectureManager(course)}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        <Video className="w-4 h-4" />
                                        Manage Lectures ({course.totalLectures || 0})
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="flex items-center justify-center gap-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">
                                {editingCourse ? 'Edit Course' : 'Create New Course'}
                            </h2>
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
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter course title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter course description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Level
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        {levels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="e.g., 8 hours"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Lectures
                                    </label>
                                    <input
                                        type="number"
                                        name="totalLectures"
                                        value={formData.totalLectures}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
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
                                    {editingCourse ? 'Update Course' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lecture Management Modal */}
            {showLectureModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-semibold">Manage Lectures</h2>
                                <p className="text-sm text-gray-600 mt-1">{selectedCourse?.title}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowLectureModal(false);
                                    resetLectureForm();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Add/Edit Lecture Form */}
                            <form onSubmit={handleLectureSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-4">
                                    {editingLecture ? 'Edit Lecture' : 'Add New Lecture'}
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lecture Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={lectureFormData.title}
                                            onChange={handleLectureInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="e.g., Introduction to React Hooks"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Video URL * (YouTube, Vimeo, or Direct Link)
                                        </label>
                                        <input
                                            type="url"
                                            name="videoUrl"
                                            value={lectureFormData.videoUrl}
                                            onChange={handleLectureInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            ✓ YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID<br />
                                            ✓ Vimeo: https://vimeo.com/VIDEO_ID<br />
                                            ✓ Direct: https://example.com/video.mp4
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Duration (e.g., 15:30)
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={lectureFormData.duration}
                                            onChange={handleLectureInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="15:30"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Order (Part #)
                                        </label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={lectureFormData.order}
                                            onChange={handleLectureInputChange}
                                            min="1"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            name="description"
                                            value={lectureFormData.description}
                                            onChange={handleLectureInputChange}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Brief description of this lecture..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    {editingLecture && (
                                        <button
                                            type="button"
                                            onClick={resetLectureForm}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {editingLecture ? 'Update Lecture' : 'Add Lecture'}
                                    </button>
                                </div>
                            </form>

                            {/* Lectures List */}
                            <div>
                                <h3 className="font-semibold mb-4">
                                    Course Lectures ({lectures.length})
                                </h3>

                                {lectures.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Video className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No lectures added yet</p>
                                        <p className="text-sm">Add your first lecture using the form above</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {lectures.map((lecture, index) => (
                                            <div
                                                key={lecture.id || lecture._id}
                                                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <GripVertical className="w-5 h-5" />
                                                    <span className="font-semibold text-gray-600">#{lecture.order}</span>
                                                </div>

                                                <PlayCircle className="w-5 h-5 text-purple-600" />

                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{lecture.title}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                        <span>{lecture.duration || 'N/A'}</span>
                                                        <span className="text-xs text-gray-400 truncate max-w-md">
                                                            {lecture.videoUrl}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleLectureEdit(lecture)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                        title="Edit lecture"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleLectureDelete(lecture.id || lecture._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Delete lecture"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </TeacherLayout >
    );
};

export default TeacherCourses;
