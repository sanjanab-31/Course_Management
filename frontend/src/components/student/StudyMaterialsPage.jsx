import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsApi, materialsApi } from '../../services/api';
import { Download, FileText, File, Loader2, BookOpen, AlertCircle } from 'lucide-react';

const StudyMaterialsPage = () => {
    const { currentUser } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch materials for enrolled courses
    useEffect(() => {
        fetchMaterials();
    }, [currentUser]);

    const fetchMaterials = async () => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // 1. Get enrolled courses
            const enrollments = await enrollmentsApi.getByUserId(currentUser.uid);

            if (enrollments.length === 0) {
                setMaterials([]);
                setLoading(false);
                return;
            }

            // 2. Fetch materials for all enrolled courses
            const allMaterials = [];
            await Promise.all(
                enrollments.map(async (enrollment) => {
                    try {
                        const courseMaterials = await materialsApi.getByCourse(enrollment.courseId);

                        courseMaterials.forEach(material => {
                            allMaterials.push({
                                ...material,
                                id: material._id || material.id,
                                courseId: enrollment.courseId,
                                courseName: enrollment.courseData?.title || 'Unknown Course',
                                uploadedOn: material.createdAt || material.uploadedAt || new Date().toISOString(),
                                type: material.type || 'PDF',
                                size: material.size || 'Unknown size'
                            });
                        });
                    } catch (err) {
                        console.error(`Error fetching materials for course ${enrollment.courseId}:`, err);
                    }
                })
            );

            // Sort by upload date (newest first)
            allMaterials.sort((a, b) => new Date(b.uploadedOn) - new Date(a.uploadedOn));

            setMaterials(allMaterials);
            setError(null);
        } catch (err) {
            console.error('Error fetching study materials:', err);
            setError('Failed to load study materials');
        } finally {
            setLoading(false);
        }
    };

    // Handle download
    const handleDownload = (material) => {
        if (material.fileUrl || material.url) {
            window.open(material.fileUrl || material.url, '_blank');
        } else {
            alert('Download URL not available for this material');
        }
    };

    // Get file icon based on type
    const getFileIcon = (type) => {
        const upperType = type?.toUpperCase() || '';
        if (upperType.includes('PDF') || upperType.includes('DOC')) {
            return <FileText className="w-6 h-6 text-blue-600" />;
        }
        return <File className="w-6 h-6 text-blue-600" />;
    };

    const formatUploadDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <StudentLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials</h1>
                    <p className="text-gray-600">Access learning resources for your enrolled courses</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                        <span className="text-gray-600">Loading materials...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {materials.length === 0 ? (
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
                                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
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
                                                        {material.courseName}
                                                    </p>
                                                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                                        <span className="uppercase">{material.type}</span>
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
                    </>
                )}
            </div>
        </StudentLayout>
    );
};

export default StudyMaterialsPage;
