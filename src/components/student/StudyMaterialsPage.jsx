import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { getAllStudentEnrollments, subscribeToStudentEnrollments } from '../../services/courseService';
import {
    getMaterialsForEnrolledCourses,
    subscribeToEnrolledMaterials,
    formatUploadDate
} from '../../services/materialService';
import { Download, FileText, File, Loader2, BookOpen, AlertCircle } from 'lucide-react';

const StudyMaterialsPage = () => {
    const { currentUser } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch enrolled courses and materials
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            setError('Please log in to view study materials');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(false);
                setError(null);

                // Get student's enrolled courses
                const enrollments = await getAllStudentEnrollments(currentUser.uid);
                const courseIds = enrollments.map(enrollment => enrollment.courseId);
                setEnrolledCourseIds(courseIds);

                // Fetch materials for enrolled courses
                if (courseIds.length > 0) {
                    const materialsData = await getMaterialsForEnrolledCourses(courseIds);
                    setMaterials(materialsData);
                } else {
                    setMaterials([]);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load study materials');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Subscribe to real-time enrollment updates
        const unsubscribeEnrollments = subscribeToStudentEnrollments(
            currentUser.uid,
            (enrollmentsData) => {
                const courseIds = enrollmentsData.map(enrollment => enrollment.courseId);
                setEnrolledCourseIds(courseIds);
            }
        );

        return () => {
            unsubscribeEnrollments();
        };
    }, [currentUser]);

    // Subscribe to real-time materials updates
    useEffect(() => {
        if (enrolledCourseIds.length === 0) {
            setMaterials([]);
            return;
        }

        const unsubscribeMaterials = subscribeToEnrolledMaterials(
            enrolledCourseIds,
            (materialsData) => {
                setMaterials(materialsData);
            }
        );

        return () => {
            unsubscribeMaterials();
        };
    }, [enrolledCourseIds]);

    // Handle download
    const handleDownload = (material) => {
        if (material.fileUrl) {
            window.open(material.fileUrl, '_blank');
        } else {
            alert('Download URL not available for this material');
        }
    };

    // Get file icon based on type
    const getFileIcon = (type) => {
        const upperType = type?.toUpperCase();
        if (upperType === 'PDF' || upperType === 'DOC' || upperType === 'DOCX') {
            return <FileText className="w-6 h-6 text-blue-600" />;
        }
        return <File className="w-6 h-6 text-blue-600" />;
    };

    return (
        <StudentLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access learning resources for your enrolled courses</h1>
                </div>

                {/* Loading State - Removed */}
                {error ? (
                    /* Error State */
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <p className="text-gray-600">{error}</p>
                        </div>
                    </div>
                ) : enrolledCourseIds.length === 0 ? (
                    /* No Enrollments State */
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Enrolled Courses
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You need to enroll in courses to access study materials
                        </p>
                        <a
                            href="/my-courses"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Browse Available Courses
                        </a>
                    </div>
                ) : materials.length === 0 ? (
                    /* No Materials State */
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Study Materials Available
                        </h3>
                        <p className="text-gray-600">
                            Your instructors haven't uploaded any materials yet
                        </p>
                    </div>
                ) : (
                    /* Materials List */
                    <div className="space-y-4">
                        {materials.map((material) => (
                            <div
                                key={material.id}
                                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            {getFileIcon(material.type)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {material.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {material.courseName || 'Course'}
                                            </p>
                                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                                <span>{material.type}</span>
                                                <span>•</span>
                                                <span>{material.size}</span>
                                                <span>•</span>
                                                <span>Uploaded {formatUploadDate(material.uploadedOn)}</span>
                                            </div>
                                            {material.description && (
                                                <p className="text-sm text-gray-500 mt-2">
                                                    {material.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(material)}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default StudyMaterialsPage;
