import React, { useState } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import { Search, Plus, Mail, Phone, MoreHorizontal } from 'lucide-react';

const StudentsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data based on the image
    const students = [
        {
            id: 1,
            name: 'Satyam Singh',
            email: 'satyam.singh@email.com',
            phone: '+91 98765 43210',
            enrolledCourses: ['MATH-301', 'PHYS-101'],
            avgGrade: 92,
            status: 'active'
        },
        {
            id: 2,
            name: 'Deepak Sharma',
            email: 'deepak.sharma@email.com',
            phone: '+91 87654 32109',
            enrolledCourses: ['PHYS-101', 'CHEM-101'],
            avgGrade: 88,
            status: 'active'
        },
        {
            id: 3,
            name: 'Nishant Kumar',
            email: 'emma.davis@email.com', // Keeping email from image even if name mismatches slightly
            phone: '+1 (555) 345-6789',
            enrolledCourses: ['CHEM-101', 'BIO-101'],
            avgGrade: 95,
            status: 'active'
        },
        {
            id: 4,
            name: 'Tom Wilson',
            email: 'tom.wilson@email.com',
            phone: '+1 (555) 456-7890',
            enrolledCourses: ['MATH-301', 'BIO-101'],
            avgGrade: 78,
            status: 'inactive'
        }
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getGradeColor = (grade) => {
        if (grade >= 90) return 'text-green-600';
        if (grade >= 80) return 'text-blue-600';
        if (grade >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <DashboardLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Students</h1>
                    <p className="text-gray-600 mt-1">Manage student enrollment and information</p>
                </div>
                <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Search and Stats Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-w-[120px]">
                        <span className="text-2xl font-bold text-gray-900">142</span>
                        <span className="text-xs text-gray-500">Total Students</span>
                    </div>
                    <div className="bg-white px-6 py-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-w-[120px]">
                        <span className="text-2xl font-bold text-gray-900">87%</span>
                        <span className="text-xs text-gray-500">Avg Grade</span>
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Grade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-xs text-gray-500">ID: {student.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="w-3 h-3 mr-2" />
                                                {student.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-3 h-3 mr-2" />
                                                {student.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-2">
                                            {student.enrolledCourses.map((course, index) => (
                                                <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-bold ${getGradeColor(student.avgGrade)}`}>
                                            {student.avgGrade}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                                                View
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentsPage;
