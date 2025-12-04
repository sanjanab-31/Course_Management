import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Video, Calendar, Users, Play } from 'lucide-react';

const LiveClassesPage = () => {
    const liveClasses = [
        {
            id: 1,
            course: 'Data Structures',
            topic: 'Binary Search Trees - Advanced Operations',
            time: '10:00 AM - 11:30 AM',
            professor: 'Prof. Nishant Kumar',
            status: 'live',
            participants: 45
        },
        {
            id: 2,
            course: 'DBMS Lab',
            topic: 'SQL Joins and Subqueries Practice',
            time: '2:00 PM - 4:00 PM',
            professor: 'Dr. Deepak Sharma',
            status: 'upcoming',
            participants: 38
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-4">
                {liveClasses.map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{classItem.course}</h3>
                                    {classItem.status === 'live' ? (
                                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center space-x-1">
                                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                            <span>LIVE</span>
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                            UPCOMING
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-700 mb-4">{classItem.topic}</p>
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{classItem.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Video className="w-4 h-4" />
                                        <span>{classItem.professor}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4" />
                                        <span>{classItem.participants} participants</span>
                                    </div>
                                </div>
                            </div>
                            <button className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 ${classItem.status === 'live'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}>
                                <Play className="w-5 h-5" />
                                <span>{classItem.status === 'live' ? 'Join Now' : 'Set Reminder'}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default LiveClassesPage;

