import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Calendar, Clock, Download, CheckCircle2 } from 'lucide-react';

const AssignmentsPage = () => {
    const [activeTab, setActiveTab] = useState('pending');
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

    // Sample data for pending assignments
    const pendingAssignments = [
        {
            id: 1,
            title: 'Binary Tree Implementation',
            course: 'Data Structure',
            professor: 'Prof. Nishant Kumar',
            description: 'Implement a binary search tree with insert, delete, and search operations. Include proper documentation and test cases.',
            dueDate: '8/26/2024 at 11:59 PM',
            timeLeft: '2 days',
            points: 100,
            priority: 'high',
            requirements: [
                'Complete implementation',
                'Unit tests',
                'Documentation'
            ]
        },
        {
            id: 2,
            title: 'Database Design Project',
            course: 'DBMS',
            professor: 'Dr. Deepak Sharma',
            description: 'Design a complete database schema for an e-commerce system. Include ER diagrams, normalization, and SQL queries.',
            dueDate: '9/20/2024 at 11:59 PM',
            timeLeft: '4 days',
            points: 150,
            priority: 'medium',
            requirements: [
                'ER diagrams',
                'Normalization',
                'SQL queries'
            ]
        },
        {
            id: 3,
            title: 'Operating Systems - Process Scheduling',
            course: 'Operating Systems',
            professor: 'Prof. Satyam Singh',
            description: 'Implement различных scheduling algorithms including FCFS, SJF, and Round Robin. Compare performance metrics.',
            dueDate: '9/25/2024 at 11:59 PM',
            timeLeft: '7 days',
            points: 120,
            priority: 'medium',
            requirements: [
                'Algorithm implementation',
                'Performance analysis',
                'Report documentation'
            ]
        }
    ];

    // Sample data for submitted assignments
    const submittedAssignments = [
        {
            id: 4,
            title: 'Array Manipulation Algorithms',
            course: 'Data Structure',
            professor: 'Prof. Nishant Kumar',
            description: 'Implemented various array manipulation algorithms including sorting, searching, and rotation.',
            submittedDate: '8/15/2024 at 10:30 PM',
            points: 100,
            score: 95,
            requirements: [
                'Complete implementation',
                'Unit tests',
                'Documentation'
            ]
        },
        {
            id: 5,
            title: 'SQL Query Optimization',
            course: 'DBMS',
            professor: 'Dr. Deepak Sharma',
            description: 'Optimized complex SQL queries for better performance using indexing and query rewriting.',
            submittedDate: '8/18/2024 at 9:45 PM',
            points: 150,
            score: 140,
            requirements: [
                'Query optimization',
                'Performance metrics',
                'Documentation'
            ]
        },
        {
            id: 6,
            title: 'Memory Management Simulation',
            course: 'Operating Systems',
            professor: 'Prof. Satyam Singh',
            description: 'Simulated memory management techniques including paging and segmentation.',
            submittedDate: '8/22/2024 at 11:00 PM',
            points: 120,
            score: 110,
            requirements: [
                'Simulation code',
                'Analysis report',
                'Documentation'
            ]
        }
    ];

    const getAssignmentsByTab = () => {
        switch (activeTab) {
            case 'pending':
                return pendingAssignments;
            case 'submitted':
                return submittedAssignments;
            case 'calendar':
                return []; // Calendar view would show a different UI
            default:
                return pendingAssignments;
        }
    };

    // Calculate stats
    const pendingCount = pendingAssignments.length;
    const avgScore = submittedAssignments.length > 0
        ? Math.round((submittedAssignments.reduce((sum, a) => sum + (a.score / a.points * 100), 0)) / submittedAssignments.length)
        : 0;

    const tabs = [
        { id: 'pending', label: `Pending (${pendingAssignments.length})` },
        { id: 'submitted', label: `Submitted (${submittedAssignments.length})` },
        { id: 'calendar', label: 'Calendar View' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
                        <p className="text-sm text-gray-600 mt-1">Track and submit your assignments</p>
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">{currentDate}</p>
                        </div>
                        <div className="flex items-center space-x-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                                <p className="text-sm text-gray-600">Pending</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900">{avgScore}%</p>
                                <p className="text-sm text-gray-600">Avg Score</p>
                            </div>
                        </div>
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

                {/* Assignment Cards */}
                {activeTab === 'calendar' ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <p className="text-gray-500">Calendar view is under development</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {getAssignmentsByTab().map((assignment) => (
                            <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6">
                                {/* Title and Priority Badge */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                                        {assignment.priority === 'high' && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                high priority
                                            </span>
                                        )}
                                        {assignment.priority === 'medium' && (
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                                medium priority
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Course and Professor */}
                                <p className="text-sm text-gray-600 mb-3">
                                    <span className="font-medium">{assignment.course}</span> - {assignment.professor}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-gray-700 mb-4">{assignment.description}</p>

                                {/* Metadata Row */}
                                <div className="flex items-center space-x-6 mb-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Due: {activeTab === 'pending' ? assignment.dueDate : assignment.submittedDate}</span>
                                    </div>
                                    {activeTab === 'pending' && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>Time left: {assignment.timeLeft}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Points: {assignment.points}</span>
                                        {activeTab === 'submitted' && assignment.score && (
                                            <span className="ml-1 text-green-600 font-medium">
                                                (Scored: {assignment.score})
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                                    <div className="space-y-1">
                                        {assignment.requirements.map((req, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                <span>{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-4">
                                    {activeTab === 'pending' ? (
                                        <>
                                            <button className="px-5 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
                                                Submit
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                                                <Download className="w-4 h-4" />
                                                <span>Download Instructions</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                            View Submission
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AssignmentsPage;

