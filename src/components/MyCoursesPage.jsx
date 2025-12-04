import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, ArrowLeft, Play, CheckCircle } from 'lucide-react';

const MyCoursesPage = () => {
    const navigate = useNavigate();

    const courses = [
        {
            id: 1,
            name: 'Data Structures',
            code: 'CS301',
            professor: 'Prof. Nishant Kumar',
            progress: 75,
            hours: 42,
            students: 65,
            color: 'blue'
        },
        {
            id: 2,
            name: 'Database Management',
            code: 'CS302',
            professor: 'Dr. Deepak Sharma',
            progress: 60,
            hours: 38,
            students: 58,
            color: 'green'
        },
        {
            id: 3,
            name: 'Operating Systems',
            code: 'CS303',
            professor: 'Prof. Rajesh Kumar',
            progress: 85,
            hours: 45,
            students: 62,
            color: 'purple'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins'] p-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`h-32 bg-${course.color}-600 flex items-center justify-center`}>
                            <BookOpen className="w-16 h-16 text-white" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{course.code} • {course.professor}</p>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Progress</span>
                                        <span className="font-semibold text-gray-900">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`bg-${course.color}-600 h-2 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.hours}h studied</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.students} students</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                                <Play className="w-4 h-4" />
                                <span>Continue Learning</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCoursesPage;
