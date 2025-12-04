import React, { useState } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import { Video, Calendar, Clock, Users, Plus, MoreVertical, Play, Link as LinkIcon } from 'lucide-react';

const TeacherLiveClasses = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    const upcomingClasses = [
        {
            id: 1,
            title: 'Advanced Calculus: Integration Techniques',
            course: 'MATH-301',
            date: 'Today',
            time: '10:00 AM - 11:30 AM',
            students: 45,
            status: 'starting_soon'
        },
        {
            id: 2,
            title: 'Physics Lab: Pendulum Experiments',
            course: 'PHYS-101',
            date: 'Tomorrow',
            time: '2:00 PM - 3:30 PM',
            students: 38,
            status: 'scheduled'
        },
        {
            id: 3,
            title: 'Organic Chemistry: Reaction Mechanisms',
            course: 'CHEM-101',
            date: 'Feb 15, 2024',
            time: '11:00 AM - 12:30 PM',
            students: 42,
            status: 'scheduled'
        }
    ];

    const pastClasses = [
        {
            id: 101,
            title: 'Introduction to Calculus',
            course: 'MATH-301',
            date: 'Feb 10, 2024',
            duration: '1h 30m',
            attendees: 40,
            recording: true
        },
        {
            id: 102,
            title: 'Newton\'s Laws of Motion',
            course: 'PHYS-101',
            date: 'Feb 8, 2024',
            duration: '1h 15m',
            attendees: 35,
            recording: true
        }
    ];

    return (
        <DashboardLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
                    <p className="text-gray-600 mt-1">Schedule and manage your live sessions</p>
                </div>
                <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Schedule Class</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Past Classes
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'upcoming' ? (
                    upcomingClasses.map((cls) => (
                        <div key={cls.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-lg ${cls.status === 'starting_soon' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <Video className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{cls.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium mb-2">{cls.course}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{cls.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{cls.time}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{cls.students} enrolled</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {cls.status === 'starting_soon' ? (
                                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
                                        <Video className="w-4 h-4" />
                                        <span>Start Now</span>
                                    </button>
                                ) : (
                                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        Edit Details
                                    </button>
                                )}
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    pastClasses.map((cls) => (
                        <div key={cls.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                                    <Play className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{cls.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium mb-2">{cls.course}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{cls.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{cls.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{cls.attendees} attended</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                                    <Play className="w-4 h-4" />
                                    <span>View Recording</span>
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" title="Copy Link">
                                    <LinkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
};

export default TeacherLiveClasses;
