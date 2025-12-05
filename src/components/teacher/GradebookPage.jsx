import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Download, ChevronDown, TrendingUp, Users, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, teacherApi } from '../../services/api';

const GradebookPage = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [gradebookData, setGradebookData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch teacher's courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await coursesApi.getAll();
                const teacherCourses = allCourses.filter(
                    course => course.instructorId === currentUser?.uid
                );
                setCourses(teacherCourses);
                if (teacherCourses.length > 0) {
                    setSelectedCourseId(teacherCourses[0].id || teacherCourses[0]._id);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchCourses();
        }
    }, [currentUser]);

    // Fetch gradebook data when course changes
    useEffect(() => {
        if (!selectedCourseId) return;

        const fetchGradebook = async () => {
            setLoading(true);
            try {
                const data = await teacherApi.getGradebook(selectedCourseId);
                // Enhance data with mock names if student details aren't fully populated
                // In a real app, we'd fetch student details or populate them in the backend
                // For now, we'll assume the backend returns what we need or we map it

                // The backend returns an array of studentGrades objects
                // We need to fetch student names separately if not included
                // But let's assume for now we might need to fetch student list to map names

                const students = await teacherApi.getStudents(currentUser.uid);

                const enhancedData = data.map(record => {
                    const student = students.find(s => s.id === record.studentId || s.userId === record.studentId);
                    return {
                        ...record,
                        name: student ? (student.name || student.email || 'Unknown Student') : 'Unknown Student',
                        // Calculate average if not provided
                        average: calculateAverage(record)
                    };
                });

                setGradebookData(enhancedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching gradebook:', err);
                setError('Failed to load gradebook');
            } finally {
                setLoading(false);
            }
        };

        fetchGradebook();
    }, [selectedCourseId, currentUser]);

    const calculateAverage = (record) => {
        let totalScore = 0;
        let maxTotal = 0;

        record.assignments.forEach(a => {
            if (a.grade !== null) {
                totalScore += a.grade;
                maxTotal += a.maxScore || 100;
            }
        });

        record.quizzes.forEach(q => {
            if (q.score !== null) {
                totalScore += q.score;
                // Assuming quizzes are out of 100 or passingScore? 
                // Let's assume 100 for simplicity or use a standard weight
                maxTotal += 100;
            }
        });

        if (maxTotal === 0) return 0;
        return Math.round((totalScore / maxTotal) * 100);
    };

    const getGradeColor = (grade) => {
        if (grade >= 90) return 'text-green-600';
        if (grade >= 80) return 'text-blue-600';
        if (grade >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getLetter = (grade) => {
        if (grade >= 97) return 'A+';
        if (grade >= 93) return 'A';
        if (grade >= 90) return 'A-';
        if (grade >= 87) return 'B+';
        if (grade >= 83) return 'B';
        if (grade >= 80) return 'B-';
        if (grade >= 77) return 'C+';
        if (grade >= 73) return 'C';
        if (grade >= 70) return 'C-';
        if (grade >= 60) return 'D';
        return 'F';
    };

    // Calculate class stats
    const stats = {
        classAverage: gradebookData.length > 0
            ? Math.round(gradebookData.reduce((acc, curr) => acc + curr.average, 0) / gradebookData.length)
            : 0,
        highestGrade: gradebookData.length > 0
            ? Math.max(...gradebookData.map(s => s.average))
            : 0,
        totalStudents: gradebookData.length,
        totalAssignments: gradebookData.length > 0
            ? (gradebookData[0].assignments.length + gradebookData[0].quizzes.length)
            : 0
    };

    return (
        <TeacherLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gradebook</h1>
                    <p className="text-gray-600 mt-1">Track and manage student grades</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            disabled={loading && courses.length === 0}
                            className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 min-w-[200px]"
                        >
                            {courses.length === 0 && <option>No courses found</option>}
                            {courses.map(course => (
                                <option key={course.id || course._id} value={course.id || course._id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
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
            ) : gradebookData.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No students enrolled</h3>
                    <p className="text-gray-600">Share your course code to invite students.</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Class Average</p>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex items-baseline">
                                <h3 className="text-3xl font-bold text-gray-900">{stats.classAverage}</h3>
                                <span className="text-lg font-semibold text-gray-500 ml-1">%</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Highest Grade</p>
                                <div className="bg-green-100 px-2 py-0.5 rounded text-xs font-bold text-green-700">
                                    {getLetter(stats.highestGrade)}
                                </div>
                            </div>
                            <div className="flex items-baseline">
                                <h3 className="text-3xl font-bold text-gray-900">{stats.highestGrade}</h3>
                                <span className="text-lg font-semibold text-gray-500 ml-1">%</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Total Students</p>
                                <div className="bg-blue-100 p-1 rounded-full">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalStudents}</h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Assessments</p>
                                <div className="bg-purple-100 p-1 rounded-full">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalAssignments}</h3>
                        </div>
                    </div>

                    {/* Grade Matrix Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Grade Matrix</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        {/* Dynamic Headers for Assignments */}
                                        {gradebookData[0]?.assignments.map((a, i) => (
                                            <th key={`h-a-${i}`} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {a.title.substring(0, 10)}...
                                            </th>
                                        ))}
                                        {/* Dynamic Headers for Quizzes */}
                                        {gradebookData[0]?.quizzes.map((q, i) => (
                                            <th key={`h-q-${i}`} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {q.title.substring(0, 10)}...
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Letter</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {gradebookData.map((student) => (
                                        <tr key={student.studentId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {student.name}
                                            </td>
                                            {/* Assignment Grades */}
                                            {student.assignments.map((a, i) => (
                                                <td key={`a-${i}`} className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {a.grade !== null ? a.grade : '-'}
                                                </td>
                                            ))}
                                            {/* Quiz Grades */}
                                            {student.quizzes.map((q, i) => (
                                                <td key={`q-${i}`} className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {q.score !== null ? q.score : '-'}
                                                </td>
                                            ))}
                                            <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold text-center ${getGradeColor(student.average)}`}>
                                                {student.average}%
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-800 border border-gray-200">
                                                    {getLetter(student.average)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </TeacherLayout>
    );
};

export default GradebookPage;
