import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, gradebookApi } from '../../services/api';
import TeacherLayout from './TeacherLayout';
import { BookOpen, Loader2, Save, Edit2, X } from 'lucide-react';

const TeacherGradebook = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [gradebookData, setGradebookData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);

    // Fetch teacher's courses
    useEffect(() => {
        fetchCourses();
    }, [currentUser]);

    const fetchCourses = async () => {
        try {
            const allCourses = await coursesApi.getAll();
            const teacherCourses = allCourses.filter(c => c.instructor === currentUser?.uid);
            setCourses(teacherCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchGradebook = async (courseId) => {
        try {
            setLoading(true);
            const data = await gradebookApi.getCourseGradebook(courseId);
            setGradebookData(data);
        } catch (error) {
            console.error('Error fetching gradebook:', error);
            alert('Failed to load gradebook');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        if (courseId) {
            fetchGradebook(courseId);
        } else {
            setGradebookData(null);
        }
    };

    const startEdit = (studentIndex, field, currentValue, maxScore) => {
        setEditingCell({ studentIndex, field });
        setEditValue(currentValue !== null ? currentValue.toString() : '');
    };

    const cancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    const saveEdit = async (student, field) => {
        try {
            setSaving(true);
            const score = editValue === '' ? null : parseFloat(editValue);

            // Validate score
            if (score !== null) {
                if (isNaN(score) || score < 0) {
                    alert('Please enter a valid score (0 or higher)');
                    return;
                }

                const maxScore = field === 'assignment1' ? student.assignment1MaxScore : student.assignment2MaxScore;
                if (score > maxScore) {
                    alert(`Score cannot exceed ${maxScore}`);
                    return;
                }
            }

            // Prepare update data
            const updateData = {};
            if (field === 'assignment1') {
                updateData.assignment1Score = score;
                updateData.assignment1Id = gradebookData.assignments[0]?.id;
            } else if (field === 'assignment2') {
                updateData.assignment2Score = score;
                updateData.assignment2Id = gradebookData.assignments[1]?.id;
            }

            // Update on backend
            await gradebookApi.updateAssignmentMarks(student.enrollmentId, updateData);

            // Refresh gradebook
            await fetchGradebook(selectedCourse);

            setEditingCell(null);
            setEditValue('');
        } catch (error) {
            console.error('Error saving grade:', error);
            alert('Failed to save grade');
        } finally {
            setSaving(false);
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

    return (
        <TeacherLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-purple-600" />
                        Gradebook
                    </h1>
                    <p className="text-gray-600 mt-2">View and manage student grades</p>
                </div>

                {/* Course Selector */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Course
                    </label>
                    <select
                        value={selectedCourse || ''}
                        onChange={handleCourseChange}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">-- Choose a course --</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                        <span className="text-gray-600">Loading gradebook...</span>
                    </div>
                )}

                {/* Gradebook Table */}
                {!loading && gradebookData && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50">
                                            Student Name
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Video Mark<br />(50)
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider bg-green-50">
                                            Assignment 1<br />✏️ Editable
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider bg-green-50">
                                            Assignment 2<br />✏️ Editable
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Assignment Total<br />(25)
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Quiz 1
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Quiz 2
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Quiz 3
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Quiz Total<br />(25)
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-purple-700 uppercase tracking-wider bg-purple-50">
                                            Final Total<br />(100)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {gradebookData.students.map((student, index) => (
                                        <tr key={student.studentId} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                                                {student.studentName}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                {formatDecimal(student.videoMark)}
                                            </td>

                                            {/* Assignment 1 - Editable */}
                                            <td className="px-4 py-3 text-sm text-center bg-green-50">
                                                {editingCell?.studentIndex === index && editingCell?.field === 'assignment1' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                                            min="0"
                                                            max={student.assignment1MaxScore}
                                                            step="0.01"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => saveEdit(student, 'assignment1')}
                                                            disabled={saving}
                                                            className="p-1 text-green-600 hover:text-green-700"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="p-1 text-gray-600 hover:text-gray-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(index, 'assignment1', student.assignment1, student.assignment1MaxScore)}
                                                        className="text-gray-700 hover:text-green-600 flex items-center justify-center gap-1 mx-auto"
                                                    >
                                                        {formatScore(student.assignment1, student.assignment1MaxScore)}
                                                        <Edit2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </td>

                                            {/* Assignment 2 - Editable */}
                                            <td className="px-4 py-3 text-sm text-center bg-green-50">
                                                {editingCell?.studentIndex === index && editingCell?.field === 'assignment2' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                                            min="0"
                                                            max={student.assignment2MaxScore}
                                                            step="0.01"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => saveEdit(student, 'assignment2')}
                                                            disabled={saving}
                                                            className="p-1 text-green-600 hover:text-green-700"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="p-1 text-gray-600 hover:text-gray-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(index, 'assignment2', student.assignment2, student.assignment2MaxScore)}
                                                        className="text-gray-700 hover:text-green-600 flex items-center justify-center gap-1 mx-auto"
                                                    >
                                                        {formatScore(student.assignment2, student.assignment2MaxScore)}
                                                        <Edit2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">
                                                {formatDecimal(student.assignmentTotal)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                {formatScore(student.quiz1, student.quiz1MaxScore)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                {formatScore(student.quiz2, student.quiz2MaxScore)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                {formatScore(student.quiz3, student.quiz3MaxScore)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">
                                                {formatDecimal(student.quizTotal)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center font-bold text-purple-700 bg-purple-50">
                                                {formatDecimal(student.finalTotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {gradebookData.students.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No students enrolled in this course yet.
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !gradebookData && selectedCourse === null && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Select a course to view the gradebook</p>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
};

export default TeacherGradebook;
