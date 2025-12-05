import React, { useState } from 'react';
import TeacherLayout from './TeacherLayout';
import { Download, ChevronDown, TrendingUp, Award, Users, FileText } from 'lucide-react';

const GradebookPage = () => {
    const [selectedCourse, setSelectedCourse] = useState('MATH-301');

    // Mock Data
    const stats = {
        classAverage: 88.6,
        highestGrade: 95.8,
        totalStudents: 5,
        totalAssignments: 6
    };

    const gradeDistribution = [
        { label: 'A (90-100)', count: 2, height: '100%' },
        { label: 'B (80-89)', count: 2, height: '100%' },
        { label: 'C (70-79)', count: 1, height: '50%' },
        { label: 'F (0-59)', count: 0, height: '0%' }
    ];

    const studentGrades = [
        {
            id: 1,
            name: 'Sarah Johnson',
            quiz1: 95,
            quiz2: 88,
            midterm: 92,
            assign1: 94,
            assign2: 89,
            final: null,
            average: 91.6,
            letter: 'A-'
        },
        {
            id: 2,
            name: 'Mike Chen',
            quiz1: 87,
            quiz2: 92,
            midterm: 85,
            assign1: 88,
            assign2: 91,
            final: null,
            average: 88.6,
            letter: 'B+'
        },
        {
            id: 3,
            name: 'Emma Davis',
            quiz1: 98,
            quiz2: 95,
            midterm: 97,
            assign1: 96,
            assign2: 93,
            final: null,
            average: 95.8,
            letter: 'A'
        },
        {
            id: 4,
            name: 'Tom Wilson',
            quiz1: 76,
            quiz2: 82,
            midterm: 74,
            assign1: 79,
            assign2: 77,
            final: null,
            average: 77.6,
            letter: 'C+'
        },
        {
            id: 5,
            name: 'Lisa Park',
            quiz1: 89,
            quiz2: 91,
            midterm: 87,
            assign1: 92,
            assign2: 88,
            final: null,
            average: 89.4,
            letter: 'B+'
        }
    ];

    const getGradeColor = (grade) => {
        if (grade >= 90) return 'text-green-600';
        if (grade >= 80) return 'text-blue-600';
        if (grade >= 70) return 'text-yellow-600';
        return 'text-red-600';
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
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                            <option value="MATH-301">MATH-301</option>
                            <option value="PHYS-101">PHYS-101</option>
                            <option value="CHEM-101">CHEM-101</option>
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
                        <div className="bg-green-100 px-2 py-0.5 rounded text-xs font-bold text-green-700">A+</div>
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
                        <p className="text-sm font-medium text-gray-500">Assignments</p>
                        <div className="bg-purple-100 p-1 rounded-full">
                            <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalAssignments}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Grade Distribution Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Grade Distribution</h3>
                    <div className="h-64 flex items-end justify-between space-x-4 px-2">
                        {gradeDistribution.map((item, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex items-end justify-center h-48 bg-gray-50 rounded-t-lg overflow-hidden">
                                    <div
                                        className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-500 rounded-t-md"
                                        style={{ height: item.height }}
                                    ></div>
                                    <span className="absolute bottom-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.count}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 mt-3 font-medium text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grade Matrix Table */}
                <div className="bg-white rounded-xl border border-gray-200 lg:col-span-2 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Grade Matrix</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz 1</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz 2</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Midterm</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assgn 1</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assgn 2</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Final</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Letter</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {studentGrades.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center bg-gray-50/50">{student.quiz1}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{student.quiz2}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center bg-gray-50/50">{student.midterm}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{student.assign1}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center bg-gray-50/50">{student.assign2}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 text-center">-</td>
                                        <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold text-center ${getGradeColor(student.average)}`}>
                                            {student.average}%
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-800 border border-gray-200">
                                                {student.letter}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default GradebookPage;
