import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { Book, TrendingUp, FileText, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/api';

const StudentGrades = () => {
    const { currentUser } = useAuth();
    const [gradesData, setGradesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                // Fetch enrollment data which includes grades
                const enrollments = await studentApi.getGrades(currentUser.uid);

                // Transform enrollment data to include course information
                const gradesWithCourses = enrollments.map(enrollment => ({
                    courseId: enrollment.courseId,
                    courseName: enrollment.courseData?.title || 'Unknown Course',
                    videoMark: enrollment.enrollmentData?.videoMarks || 0,
                    assignmentMarks: enrollment.enrollmentData?.assignmentMarks || 0,
                    quizMarks: enrollment.enrollmentData?.quizMarks || 0,
                    totalGrade: enrollment.enrollmentData?.totalGrade || 0,
                    progress: enrollment.enrollmentData?.progress || 0
                }));

                setGradesData(gradesWithCourses);
                setError(null);
            } catch (err) {
                console.error('Error fetching grades:', err);
                setError('Failed to load grades');
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, [currentUser]);

    const getLetterGrade = (total) => {
        if (total >= 97) return 'A+';
        if (total >= 93) return 'A';
        if (total >= 90) return 'A-';
        if (total >= 87) return 'B+';
        if (total >= 83) return 'B';
        if (total >= 80) return 'B-';
        if (total >= 77) return 'C+';
        if (total >= 73) return 'C';
        if (total >= 70) return 'C-';
        if (total >= 60) return 'D';
        return 'F';
    };

    const getGradeColor = (total) => {
        if (total >= 90) return 'text-green-600 bg-green-50 border-green-200';
        if (total >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (total >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    // Calculate overall stats
    const stats = {
        totalCourses: gradesData.length,
        averageGrade: gradesData.length > 0
            ? Math.round(gradesData.reduce((acc, curr) => acc + curr.totalGrade, 0) / gradesData.length)
            : 0,
        highestGrade: gradesData.length > 0
            ? Math.max(...gradesData.map(g => g.totalGrade))
            : 0,
        passingCourses: gradesData.filter(g => g.totalGrade >= 60).length
    };

    return (
        <StudentLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
                <p className="text-gray-600 mt-1">View your grades and performance across all enrolled courses</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            ) : gradesData.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
                    <p className="text-gray-600">Enroll in courses to see your grades here.</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                                <div className="bg-purple-100 p-1 rounded-full">
                                    <Book className="w-4 h-4 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalCourses}</h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Average Grade</p>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex items-baseline">
                                <h3 className="text-3xl font-bold text-gray-900">{stats.averageGrade}</h3>
                                <span className="text-lg font-semibold text-gray-500 ml-1">/100</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Highest Grade</p>
                                <div className="bg-green-100 px-2 py-0.5 rounded text-xs font-bold text-green-700">
                                    {getLetterGrade(stats.highestGrade)}
                                </div>
                            </div>
                            <div className="flex items-baseline">
                                <h3 className="text-3xl font-bold text-gray-900">{stats.highestGrade}</h3>
                                <span className="text-lg font-semibold text-gray-500 ml-1">/100</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Passing Courses</p>
                                <div className="bg-green-100 p-1 rounded-full">
                                    <Award className="w-4 h-4 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.passingCourses}/{stats.totalCourses}</h3>
                        </div>
                    </div>

                    {/* Grades Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Course Grades</h3>
                            <p className="text-sm text-gray-500 mt-1">Detailed breakdown of your grades by course</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Video Marks<br />(50)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">Assignment Marks<br />(25)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">Quiz Marks<br />(25)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-purple-50">Total<br />(100)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Letter Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {gradesData.map((grade, index) => (
                                        <tr key={grade.courseId || `course-${index}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {grade.courseName}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {grade.videoMark.toFixed(1)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-700 text-center bg-blue-50">
                                                {grade.assignmentMarks.toFixed(1)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-700 text-center bg-green-50">
                                                {grade.quizMarks.toFixed(1)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-purple-700 text-center bg-purple-50">
                                                {grade.totalGrade.toFixed(1)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 text-sm font-bold rounded-md border ${getGradeColor(grade.totalGrade)}`}>
                                                    {getLetterGrade(grade.totalGrade)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grade Legend */}
                    <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Grading Breakdown</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-start space-x-2">
                                <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">Video Marks (50 points)</p>
                                    <p className="text-gray-600">Awarded when all course videos are completed</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-2">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">Assignment Marks (25 points)</p>
                                    <p className="text-gray-600">Based on 2 assignments graded by your teacher</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-2">
                                <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">Quiz Marks (25 points)</p>
                                    <p className="text-gray-600">Average of your 3 quiz scores</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </StudentLayout>
    );
};

export default StudentGrades;
