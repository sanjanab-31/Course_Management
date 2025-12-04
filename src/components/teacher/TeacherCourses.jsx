import React from 'react';
import TeacherLayout from './TeacherLayout';
import { Plus, Users, Calendar, BookOpen, Edit, Eye } from 'lucide-react';

const TeacherCourses = () => {
    const courses = [
        {
            id: 1,
            title: 'Advanced Mathematics',
            code: 'MATH-301',
            status: 'active',
            description: 'Advanced calculus and linear algebra concepts',
            students: 28,
            startDate: '1/15/2024',
            endDate: '5/15/2024'
        },
        {
            id: 2,
            title: 'Introduction to Physics',
            code: 'PHYS-101',
            status: 'active',
            description: 'Fundamental physics principles and mechanics',
            students: 35,
            startDate: '1/15/2024',
            endDate: '5/15/2024'
        },
        {
            id: 3,
            title: 'Chemistry Fundamentals',
            code: 'CHEM-101',
            status: 'upcoming',
            description: 'Basic chemistry concepts and laboratory work',
            students: 22,
            startDate: '2/1/2024',
            endDate: '6/1/2024'
        },
        {
            id: 4,
            title: 'Biology Basics',
            code: 'BIO-101',
            status: 'completed',
            description: 'Introduction to biological systems and processes',
            students: 31,
            startDate: '9/1/2023',
            endDate: '12/15/2023'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <TeacherLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                    <p className="text-gray-600 mt-1">Manage your courses and curriculum</p>
                </div>
                <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>New Course</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">{course.code}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(course.status)}`}>
                                {course.status}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                            {course.description}
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-gray-500">
                                <Users className="w-4 h-4 mr-2" />
                                <span>{course.students} students</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{course.startDate} - {course.endDate}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <BookOpen className="w-4 h-4" />
                                <span>View</span>
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

export default TeacherCourses;
