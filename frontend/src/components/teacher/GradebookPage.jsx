import React, { useState, useEffect } from 'react';
import TeacherLayout from './TeacherLayout';
import { Download, ChevronDown, TrendingUp, Users, FileText, Loader2, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, teacherApi } from '../../services/api';

const GradebookPage = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [gradebookData, setGradebookData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCell, setEditingCell] = useState(null); // { studentId, field }
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);

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
                setGradebookData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching gradebook:', err);
                setError('Failed to load gradebook');
            } finally {
                setLoading(false);
            }
        };

        fetchGradebook();
    }, [selectedCourseId]);

    const handleEditClick = (studentId, field, currentValue) => {
        setEditingCell({ studentId, field });
        setEditValue(currentValue || '');
    };

    const handleCancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    const handleSaveEdit = async (studentId) => {
        setSaving(true);
        try {
            const student = gradebookData.find(s => s.studentId === studentId);
            const marksData = {
                assignment1: editingCell.field === 'assignment1' ? parseFloat(editValue) : student.assignment1,
                assignment2: editingCell.field === 'assignment2' ? parseFloat(editValue) : student.assignment2
            };

            await teacherApi.updateAssignmentMarks(selectedCourseId, studentId, marksData);

            // Refresh gradebook data
            const updatedData = await teacherApi.getGradebook(selectedCourseId);
            setGradebookData(updatedData);
            setEditingCell(null);
            setEditValue('');
        } catch (err) {
            console.error('Error saving marks:', err);
            alert('Failed to save marks. Please try again.');
        } finally {
            setSaving(false);
        }
    };

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
        if (total >= 90) return 'text-green-600';
        if (total >= 80) return 'text-blue-600';
        if (total >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Calculate class stats
    const stats = {
        classAverage: gradebookData.length > 0
            ? Math.round(gradebookData.reduce((acc, curr) => acc + (curr.finalTotal || 0), 0) / gradebookData.length)
            : 0,
        highestGrade: gradebookData.length > 0
            ? Math.max(...gradebookData.map(s => s.finalTotal || 0))
            : 0,
        totalStudents: gradebookData.length,
        passingStudents: gradebookData.filter(s => (s.finalTotal || 0) >= 60).length
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
                                <p className="text-sm font-medium text-gray-500">Total Students</p>
                                <div className="bg-blue-100 p-1 rounded-full">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalStudents}</h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-500">Passing Students</p>
                                <div className="bg-purple-100 p-1 rounded-full">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.passingStudents}</h3>
                        </div>
                    </div>

                    {/* Gradebook Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Student Grades</h3>
                            <p className="text-sm text-gray-500 mt-1">Click on assignment cells to edit marks</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">Student Name</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Video Mark<br />(50)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment 1</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment 2</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">Assignment Total<br />(25)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz 1</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz 2</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz 3</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">Quiz Total<br />(25)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-purple-50">Final Total<br />(100)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {gradebookData.map((student, index) => (
                                        <tr key={student.studentId || `student-${index}`} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                                                {student.studentName}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {student.videoMark || 0}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {editingCell?.studentId === student.studentId && editingCell?.field === 'assignment1' ? (
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="w-16 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            autoFocus
                                                            min="0"
                                                            max="100"
                                                        />
                                                        <button
                                                            onClick={() => handleSaveEdit(student.studentId)}
                                                            disabled={saving}
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditClick(student.studentId, 'assignment1', student.assignment1)}
                                                        className="group flex items-center justify-center space-x-1 hover:text-blue-600 w-full"
                                                    >
                                                        <span>{student.assignment1 || 0}</span>
                                                        <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {editingCell?.studentId === student.studentId && editingCell?.field === 'assignment2' ? (
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="w-16 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            autoFocus
                                                            min="0"
                                                            max="100"
                                                        />
                                                        <button
                                                            onClick={() => handleSaveEdit(student.studentId)}
                                                            disabled={saving}
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditClick(student.studentId, 'assignment2', student.assignment2)}
                                                        className="group flex items-center justify-center space-x-1 hover:text-blue-600 w-full"
                                                    >
                                                        <span>{student.assignment2 || 0}</span>
                                                        <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-700 text-center bg-blue-50">
                                                {student.assignmentTotal || 0}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {student.quiz1 || 0}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {student.quiz2 || 0}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {student.quiz3 || 0}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-700 text-center bg-green-50">
                                                {student.quizTotal || 0}
                                            </td>
                                            <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold text-center bg-purple-50 ${getGradeColor(student.finalTotal || 0)}`}>
                                                {student.finalTotal || 0} ({getLetterGrade(student.finalTotal || 0)})
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
