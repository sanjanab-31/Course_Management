import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Plus, FileText, Download, Trash2, X, Loader2, Book } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, materialsApi } from '../../services/api';

const TeacherStudyMaterials = () => {
    const { currentUser } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'document',
        fileUrl: '',
        fileName: '',
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

            // Fetch materials for all teacher's courses
            const allMaterials = [];
            for (const course of teacherCourses) {
                try {
                    const courseMaterials = await materialsApi.getByCourse(course._id);
                    allMaterials.push(...courseMaterials.map(m => ({
                        ...m,
                        courseName: course.title
                    })));
                } catch (error) {
                    console.log(`No materials for course ${course._id}`);
                }
            }
            setMaterials(allMaterials);
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
            // In a real app, we would handle file upload here
            // For now, we assume fileUrl is provided (e.g. from a cloud storage)
            await materialsApi.upload(formData.courseId, {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                fileUrl: formData.fileUrl,
                fileName: formData.fileName || 'Document',
                fileSize: 1024 * 1024 // Mock size 1MB
            });

            showNotification('Material added successfully!');
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                type: 'document',
                fileUrl: '',
                fileName: '',
                courseId: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error adding material:', error);
            showNotification('Failed to add material', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (courseId, materialId) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;

        try {
            await materialsApi.delete(courseId, materialId);
            showNotification('Material deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting material:', error);
            showNotification('Failed to delete material', 'error');
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
                    <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
                    <p className="text-gray-600 mt-1">Upload and manage course resources</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={courses.length === 0}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Material</span>
                </button>
            </div>

            {/* Empty State */}
            {materials.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
                    <p className="text-gray-600 mb-4">
                        {courses.length === 0
                            ? 'Create a course first to add materials'
                            : 'Upload your first study material'
                        }
                    </p>
                    {courses.length > 0 && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Add Material
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((material) => (
                        <div key={material._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">{material.title}</h3>
                                        <p className="text-sm text-gray-500">{material.courseName}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                {material.description}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span>{formatDate(material.createdAt)}</span>
                                <span className="uppercase">{material.type}</span>
                            </div>

                            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                                <a
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                </a>
                                <button
                                    onClick={() => handleDelete(material.courseId || formData.courseId, material._id)}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
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
                            <h2 className="text-xl font-semibold">Add Study Material</h2>
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
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter material title"
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
                                    placeholder="Enter description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="document">Document</option>
                                        <option value="video">Video</option>
                                        <option value="link">Link</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        File Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fileName"
                                        value={formData.fileName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="e.g. Lecture Notes.pdf"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    File/Resource URL *
                                </label>
                                <input
                                    type="url"
                                    name="fileUrl"
                                    value={formData.fileUrl}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://..."
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
                                    Add Material
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
};

export default TeacherStudyMaterials;
