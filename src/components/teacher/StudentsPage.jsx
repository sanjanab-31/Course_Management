import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Search, Users, BookOpen, Loader2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teacherApi } from '../../services/api';

const StudentsPage = () => {
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, [currentUser]);

    const fetchStudents = async () => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(false);
            const studentsData = await teacherApi.getStudents(currentUser.uid);
            setStudents(studentsData);
            setError(null);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        (student.userId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.courseName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate statistics
    const totalEnrollments = students.length;
    const uniqueStudents = new Set(students.map(s => s.userId)).size;
    const avgProgress = students.length > 0
        ? Math.round(students.reduce((sum, s) => sum + (s.progress || 0), 0) / students.length)
        : 0;

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'text-green-600';
        if (progress >= 50) return 'text-blue-600';
        if (progress >= 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'enrolled': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'inactive': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <TeacherLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Students</h1>
                    <p className="text-gray-600 mt-1">View students enrolled in your courses</p>
                </div>
            </div>

            {/* Search and Stats Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by student ID or course name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-w-[120px]">
                        <span className="text-2xl font-bold text-gray-900">{uniqueStudents}</span>
                        <span className="text-xs text-gray-500">Unique Students</span>
                    </div>
                    <div className="bg-white px-6 py-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-w-[120px]">
                        <span className="text-2xl font-bold text-gray-900">{totalEnrollments}</span>
                        <span className="text-xs text-gray-500">Total Enrollments</span>
                    </div>
                    <div className="bg-white px-6 py-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-w-[120px]">
                        <span className="text-2xl font-bold text-gray-900">{avgProgress}%</span>
                        <span className="text-xs text-gray-500">Avg Progress</span>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <span className="ml-3 text-gray-600">Loading students...</span>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    {error}
                </div>
            )}

            {/* Student List */}
            {!loading && !error && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Student Enrollments ({filteredStudents.length})
                        </h3>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {students.length === 0 ? 'No students enrolled yet' : 'No students found'}
                            </h3>
                            <p className="text-gray-600">
                                {searchQuery
                                    ? 'Try adjusting your search'
                                    : 'Students will appear here when they enroll in your courses'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Lectures</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={`${student.userId}-${student.courseId}-${index}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <UserCheck className="w-5 h-5 text-gray-400 mr-2" />
                                                    <div className="text-sm font-medium text-gray-900">{student.userId}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{student.courseName}</div>
                                                        <div className="text-xs text-gray-500">ID: {student.courseId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2 mr-2">
                                                        <div
                                                            className="bg-purple-600 h-2 rounded-full"
                                                            style={{ width: `${student.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-sm font-bold ${getProgressColor(student.progress || 0)}`}>
                                                        {student.progress || 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.completedLectures || 0} lectures</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(student.status)}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </TeacherLayout>
    );
};

export default StudentsPage;
