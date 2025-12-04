import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, BookOpen, Clock } from 'lucide-react';

const MyProgressPage = () => {
    const navigate = useNavigate();

    const courseProgress = [
        { name: 'Data Structures', progress: 75, color: 'blue' },
        { name: 'Database Management', progress: 60, color: 'green' },
        { name: 'Operating Systems', progress: 85, color: 'purple' },
        { name: 'Computer Networks', progress: 45, color: 'orange' }
    ];

    const stats = [
        { label: 'Overall CGPA', value: '8.7', icon: Award, color: 'blue' },
        { label: 'Courses Completed', value: '24', icon: BookOpen, color: 'green' },
        { label: 'Total Study Hours', value: '342h', icon: Clock, color: 'purple' },
        { label: 'Assignments Submitted', value: '48', icon: TrendingUp, color: 'orange' }
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

            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Progress</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Course Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Current Semester Progress</h2>
                <div className="space-y-6">
                    {courseProgress.map((course, index) => (
                        <div key={index}>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-900">{course.name}</span>
                                <span className="font-bold text-gray-900">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`bg-${course.color}-600 h-3 rounded-full transition-all duration-300`}
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyProgressPage;
