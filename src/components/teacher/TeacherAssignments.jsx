import React from 'react';
import TeacherLayout from './TeacherLayout';
import { Plus, FileText, Clock, Users, Calendar, Edit, Eye } from 'lucide-react';

const TeacherAssignments = () => {
    const assignments = [
        {
            id: 1,
            title: 'Calculus Problem Set 5',
            course: 'MATH-301',
            status: 'active',
            description: 'Solve integration problems and show all work',
            dueDate: '2/15/2024',
            points: 100,
            submissions: 24,
            totalStudents: 28,
            isOverdue: true
        },
        {
            id: 2,
            title: 'Physics Lab Report',
            course: 'PHYS-101',
            status: 'active',
            description: 'Analyze pendulum motion experiment data',
            dueDate: '2/20/2024',
            points: 75,
            submissions: 31,
            totalStudents: 35,
            isOverdue: true
        },
        {
            id: 3,
            title: 'Chemical Equations Quiz',
            course: 'CHEM-101',
            status: 'closed',
            description: 'Balance equations and identify reaction types',
            dueDate: '2/10/2024',
            points: 50,
            submissions: 22,
            totalStudents: 22,
            isOverdue: true
        },
        {
            id: 4,
            title: 'Cell Biology Essay',
            course: 'BIO-101',
            status: 'draft',
            description: 'Write about mitosis and meiosis processes',
            dueDate: '-',
            points: 100,
            submissions: 0,
            totalStudents: 31,
            isOverdue: false
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <TeacherLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                    <p className="text-gray-600 mt-1">Create and manage course assignments</p>
                </div>
                <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>New Assignment</span>
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">4</h3>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Review</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Avg Submission Rate</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">92%</h3>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{assignment.title}</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">{assignment.course}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(assignment.status)}`}>
                                {assignment.status}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                            {assignment.description}
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Due:</span>
                                <span className="font-medium text-gray-900">{assignment.dueDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Points:</span>
                                <span className="font-medium text-gray-900">{assignment.points}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Submissions:</span>
                                <span className="font-medium text-gray-900">{assignment.submissions}/{assignment.totalStudents}</span>
                            </div>
                            {assignment.isOverdue && assignment.status !== 'draft' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="font-medium text-red-600">Overdue</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <Eye className="w-4 h-4" />
                                <span>View Submissions</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </TeacherLayout>
    );
};

export default TeacherAssignments;
