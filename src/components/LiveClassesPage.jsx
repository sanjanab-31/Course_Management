import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { User, Clock, Users, Video } from 'lucide-react';

const LiveClassesPage = () => {
    const [activeTab, setActiveTab] = useState('today');
    const [currentDate, setCurrentDate] = useState('');

    // Update date in real-time
    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            setCurrentDate(now.toLocaleDateString('en-US', options));
        };

        updateDate();
        const interval = setInterval(updateDate, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Sample data for different categories
    const todayClasses = [
        {
            id: 1,
            course: 'Data Structures - Trees and Graphs',
            professor: 'Prof. Nishant Kumar',
            time: '10:00 AM - 11:30 AM',
            duration: '90',
            participants: 187,
            meetingId: 'KLU-DS-001',
            status: 'live'
        },
        {
            id: 2,
            course: 'Database Systems - Advanced Queries',
            professor: 'Dr. Deepak Sharma',
            time: '2:00 PM - 3:30 PM',
            duration: '90',
            participants: 201,
            meetingId: 'KLU-DB-002',
            status: 'upcoming'
        },
        {
            id: 3,
            course: 'Operating Systems - Memory Management',
            professor: 'Prof. Satyam Singh',
            time: '4:00 PM - 5:30 PM',
            duration: '90',
            participants: 198,
            meetingId: 'KLU-OS-003',
            status: 'upcoming'
        }
    ];

    const upcomingClasses = [
        {
            id: 4,
            course: 'Algorithms - Dynamic Programming',
            professor: 'Prof. Rajesh Verma',
            time: 'Tomorrow - 10:00 AM - 11:30 AM',
            duration: '90',
            participants: 195,
            meetingId: 'KLU-ALGO-004',
            status: 'upcoming'
        },
        {
            id: 5,
            course: 'Computer Networks - TCP/IP',
            professor: 'Dr. Priya Sharma',
            time: 'Tomorrow - 2:00 PM - 3:30 PM',
            duration: '90',
            participants: 189,
            meetingId: 'KLU-CN-005',
            status: 'upcoming'
        }
    ];

    const recordedClasses = [
        {
            id: 6,
            course: 'Data Structures - Linked Lists',
            professor: 'Prof. Nishant Kumar',
            time: 'Recorded on Dec 3, 2025',
            duration: '85',
            participants: 187,
            meetingId: 'KLU-DS-REC-001',
            status: 'recorded'
        },
        {
            id: 7,
            course: 'Database Systems - Normalization',
            professor: 'Dr. Deepak Sharma',
            time: 'Recorded on Dec 2, 2025',
            duration: '90',
            participants: 201,
            meetingId: 'KLU-DB-REC-002',
            status: 'recorded'
        },
        {
            id: 8,
            course: 'Operating Systems - Process Scheduling',
            professor: 'Prof. Satyam Singh',
            time: 'Recorded on Dec 1, 2025',
            duration: '88',
            participants: 198,
            meetingId: 'KLU-OS-REC-003',
            status: 'recorded'
        }
    ];

    const getClassesByTab = () => {
        switch (activeTab) {
            case 'today':
                return todayClasses;
            case 'upcoming':
                return upcomingClasses;
            case 'recorded':
                return recordedClasses;
            default:
                return todayClasses;
        }
    };

    const tabs = [
        { id: 'today', label: "Today's Classes" },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'recorded', label: 'Recorded Classes' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
                        <p className="text-sm text-gray-600 mt-1">Join live sessions and access recorded lectures</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">{currentDate}</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Class Cards */}
                <div className="space-y-4">
                    {getClassesByTab().map((classItem) => (
                        <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Course Title and Badge */}
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h3 className="text-base font-semibold text-gray-900">{classItem.course}</h3>
                                        {classItem.status === 'live' && (
                                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded">
                                                live
                                            </span>
                                        )}
                                        {classItem.status === 'upcoming' && (
                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                                                upcoming
                                            </span>
                                        )}
                                    </div>

                                    {/* Class Details */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <User className="w-4 h-4" />
                                            <span>{classItem.professor}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{classItem.time} ({classItem.duration})</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Video className="w-4 h-4" />
                                            <span>{classItem.participants} Participants</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Meeting ID and Button */}
                                <div className="flex flex-col items-end space-y-3">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Meeting ID: {classItem.meetingId}</p>
                                    </div>
                                    {classItem.status === 'live' ? (
                                        <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                                            Join Now
                                        </button>
                                    ) : classItem.status === 'upcoming' ? (
                                        <button className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors">
                                            Notify Me
                                        </button>
                                    ) : (
                                        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                            Watch Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LiveClassesPage;

