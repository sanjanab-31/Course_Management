import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsApi } from '../../services/api';
import {
    BookOpen,
    Clock,
    Trophy,
    TrendingUp,
    Calendar,
    Play,
    FileText,
    Video,
    Loader2
} from 'lucide-react';

const StudentDashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        enrolledCourses: 0,
        hoursStudied: 0,
        assignmentsDue: 0,
        overallProgress: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                setLoading(false);
                const enrollments = await enrollmentsApi.getByUserId(currentUser.uid);

                // Calculate stats
                const enrolledCourses = enrollments.length;
                const overallProgress = enrollments.length > 0
                    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.enrollmentData.progress || 0), 0) / enrollments.length)
                    : 0;

                // Mock data for hours and assignments (until we have real tracking)
                const hoursStudied = enrollments.reduce((acc, curr) => acc + (curr.enrollmentData.completedLectures || 0) * 1.5, 0);
                const assignmentsDue = enrollments.reduce((acc, curr) => acc + (curr.courseData.assignments || 0) - (curr.enrollmentData.assignments || 0), 0);

                setStats({
                    enrolledCourses,
                    hoursStudied: Math.round(hoursStudied),
                    assignmentsDue: Math.max(0, assignmentsDue),
                    overallProgress
                });

                // Generate recent activity from enrollments
                const activity = enrollments.slice(0, 4).map(enrollment => ({
                    type: 'course',
                    title: `Enrolled in ${enrollment.courseData.title}`,
                    course: enrollment.courseData.category,
                    time: new Date(enrollment.enrollmentData.enrolledAt?.seconds * 1000).toLocaleDateString(),
                    icon: BookOpen
                }));
                setRecentActivity(activity);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const studentData = {
        name: currentUser?.displayName || 'Student',
        role: 'Student',
        semester: 'Current Semester',
        department: 'General',
        ...stats,
        enrolledCoursesChange: 'Active now',
        hoursStudiedChange: 'Total hours',
        assignmentsDueChange: 'Pending tasks',
        overallProgressChange: 'Average progress'
    };

    // Mock schedule for now
    const todaySchedule = [
        {
            title: 'Data Structures',
            time: '10:00 AM',
            professor: 'Prof. Nishant Kumar',
            type: 'Live Class',
            status: 'live'
        },
        {
            title: 'DBMS Lab',
            time: '2:00 PM',
            professor: 'Dr. Deepak Sharma',
            type: 'Practical',
            status: 'upcoming'
        }
    ];

    // Loading state removed - always show content

    return (
        <StudentLayout>
            {/* Welcome Banner */}
            <div className="bg-[#0277bd] text-white rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Welcome back, {studentData.name}!</h3>
                        <p className="text-blue-100">
                            You have {studentData.enrolledCourses} active courses and {studentData.assignmentsDue} pending assignments.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-blue-100 mb-1">Current Semester</p>
                        <p className="text-xl font-semibold">{studentData.semester}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Enrolled Courses */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Enrolled Courses</span>
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="mb-1">
                        <span className="text-3xl font-bold text-gray-900">{studentData.enrolledCourses}</span>
                    </div>
                    <div className="text-xs text-gray-500">{studentData.enrolledCoursesChange}</div>
                </div>

                {/* Hours Studied */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Hours Studied</span>
                        <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="mb-1">
                        <span className="text-3xl font-bold text-gray-900">{studentData.hoursStudied}h</span>
                    </div>
                    <div className="text-xs text-gray-500">{studentData.hoursStudiedChange}</div>
                </div>

                {/* Assignments Due */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Assignments Due</span>
                        <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="mb-1">
                        <span className="text-3xl font-bold text-gray-900">{studentData.assignmentsDue}</span>
                    </div>
                    <div className="text-xs text-gray-500">{studentData.assignmentsDueChange}</div>
                </div>

                {/* Overall Progress */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="mb-1">
                        <span className="text-3xl font-bold text-gray-900">{studentData.overallProgress}%</span>
                    </div>
                    <div className="text-xs text-gray-500">{studentData.overallProgressChange}</div>
                </div>
            </div>

            {/* Today's Schedule and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                        <Calendar className="w-5 h-5 text-gray-700 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {todaySchedule.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                        {item.status === 'live' && (
                                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-md font-medium">Live Class</span>
                                        )}
                                        {item.status === 'upcoming' && (
                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-md font-medium">Practical</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{item.time} • {item.professor}</p>
                                    {item.status !== 'recorded' && (
                                        <button className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            <Play className="w-4 h-4" />
                                            <span>Join</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-100">
                                            <Icon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                            <p className="text-sm text-gray-600">{activity.course}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentDashboard;
