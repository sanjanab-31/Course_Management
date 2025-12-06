import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { gradebookApi } from '../../services/api';
import { Award, Loader2, BookOpen } from 'lucide-react';

const StudentGrades = () => {
    const { currentUser } = useAuth();
    const [gradesData, setGradesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGrades();
    }, [currentUser]);

    const fetchGrades = async () => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await gradebookApi.getStudentGrades(currentUser.uid);
            setGradesData(data.courses || []);
        } catch (err) {
            console.error('Error fetching grades:', err);
            setError('Failed to load grades');
        } finally {
            setLoading(false);
        }
    };

    const formatScore = (score, maxScore) => {
        if (score === null || score === undefined) return '-';
        return `${score}/${maxScore}`;
    };

    const formatDecimal = (value) => {
        if (value === null || value === undefined) return '-';
        return typeof value === 'number' ? value.toFixed(2) : value;
    };

    const getGradeColor = (finalTotal) => {
        if (finalTotal >= 90) return 'text-green-600';
        if (finalTotal >= 80) return 'text-blue-600';
        if (finalTotal >= 70) return 'text-yellow-600';
        if (finalTotal >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <StudentLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Award className="w-8 h-8 text-purple-600" />
                        My Grades
                    </h1>
                    <p className="text-gray-600 mt-1">View your grades across all enrolled courses</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                        <span className="text-gray-600">Loading grades...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        {error}
                    </div>
                )}

                {/* Grades Display */}
                {!loading && !error && (
                    <>
                        {gradesData.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {gradesData.map((course) => (
                                    <div key={course.courseId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        {/* Course Header */}
                                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                                            <h2 className="text-xl font-bold text-white">{course.courseName}</h2>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-white/90 text-sm">Final Grade:</span>
                                                <span className={`text-2xl font-bold text-white`}>
                                                    {formatDecimal(course.finalTotal)}/100
                                                </span>
                                            </div>
                                        </div>

                                        {/* Grades Table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Category
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Score
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Weight
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {/* Video Mark */}
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            Video Completion
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                            {formatDecimal(course.videoMark)}/50
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            50%
                                                        </td>
                                                    </tr>

                                                    {/* Assignments */}
                                                    <tr className="bg-green-50/30">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900" colSpan="3">
                                                            <div className="font-semibold text-green-700">Assignments</div>
                                                        </td>
                                                    </tr>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-700 pl-8">
                                                            Assignment 1
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                            {formatScore(course.assignment1, course.assignment1MaxScore)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            -
                                                        </td>
                                                    </tr>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-700 pl-8">
                                                            Assignment 2
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                            {formatScore(course.assignment2, course.assignment2MaxScore)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            -
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-green-50 font-medium">
                                                        <td className="px-4 py-3 text-sm text-gray-900 pl-8">
                                                            Assignment Total
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-900">
                                                            {formatDecimal(course.assignmentTotal)}/25
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            25%
                                                        </td>
                                                    </tr>

                                                    {/* Quizzes */}
                                                    <tr className="bg-blue-50/30">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900" colSpan="3">
                                                            <div className="font-semibold text-blue-700">Quizzes</div>
                                                        </td>
                                                    </tr>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-700 pl-8">
                                                            Quiz 1
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                            {formatScore(course.quiz1, course.quiz1MaxScore)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            -
                                                        </td>
                                                    </tr>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-700 pl-8">
                                                            Quiz 2
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                            {formatScore(course.quiz2, course.quiz2MaxScore)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            -
                                                        </td>
                                                    </tr>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-700 pl-8">
                                                            Quiz 3
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                            {formatScore(course.quiz3, course.quiz3MaxScore)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            -
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-blue-50 font-medium">
                                                        <td className="px-4 py-3 text-sm text-gray-900 pl-8">
                                                            Quiz Total
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-900">
                                                            {formatDecimal(course.quizTotal)}/25
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                            25%
                                                        </td>
                                                    </tr>

                                                    {/* Final Total */}
                                                    <tr className="bg-purple-50 font-bold">
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            FINAL GRADE
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-center">
                                                            <span className={`text-lg ${getGradeColor(course.finalTotal)}`}>
                                                                {formatDecimal(course.finalTotal)}/100
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-center text-gray-500">
                                                            100%
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
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

export default StudentGrades;
