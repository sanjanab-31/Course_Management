import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    BookOpen,
    Video,
    FileText,
    Award,
    BookMarked,
    TrendingUp,
    Settings,
    LogOut,
    Clock,
    Trophy,
    BookOpenCheck,
    Calendar,
    Play
} from 'lucide-react';

const StudentDashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format date and time
    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const handleNavigation = (tab) => {
        setActiveTab(tab);
        navigate(`/${tab}`);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'my-courses', label: 'My Courses', icon: BookOpen },
        { id: 'live-classes', label: 'Live Classes', icon: Video },
        { id: 'assignments', label: 'Assignments', icon: FileText },
        { id: 'quizzes-tests', label: 'Quizzes & Tests', icon: Award },
        { id: 'study-materials', label: 'Study Materials', icon: BookMarked },
        { id: 'my-progress', label: 'My Progress', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Sample data - replace with real data from Firebase
    const studentData = {
        name: 'Satyam Singh',
        role: 'B.Tech Student',
        semester: 'Semester 5',
        department: 'CSE',
        enrolledCourses: 8,
        enrolledCoursesChange: '+2 this month',
        hoursStudied: 42,
        hoursStudiedChange: '+8h this week',
        assignmentsDue: 3,
        assignmentsDueChange: '2 due today',
        overallProgress: 87,
        overallProgressChange: '+5% this month',
    };

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
        },
        {
            title: 'OS Theory',
            time: '4:00 PM',
            professor: 'Prof. Rajesh Kumar',
            type: 'Recorded',
            status: 'recorded'
        }
    ];

    const recentActivity = [
        {
            type: 'quiz',
            title: 'Completed quiz',
            course: 'Data Structures',
            score: '95/100',
            time: '2 hours ago',
            icon: Trophy
        },
        {
            type: 'assignment',
            title: 'Submitted assignment',
            course: 'DBMS',
            status: 'Pending Review',
            time: '4 hours ago',
            icon: FileText
        },
        {
            type: 'lecture',
            title: 'Watched lecture',
            course: 'Operating Systems',
            duration: '45 min',
            time: '1 day ago',
            icon: Play
        },
        {
            type: 'class',
            title: 'Joined live class',
            course: 'Data Structures',
            time: '2 days ago',
            icon: Video
        }
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-['Poppins']">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo Section */}
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpenCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-900">SRI ESHWAR</h1>
                            <p className="text-xs text-gray-500">Learning</p>
                            <p className="text-xs text-gray-500">Management System</p>
                        </div>
                    </div>
                    <div className="mt-3 px-3 py-1.5 bg-gray-100 rounded-md text-center">
                        <span className="text-xs font-medium text-gray-700">Student Portal</span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`w-full flex items-center space-x-3 px-5 py-2.5 text-sm transition-colors ${isActive
                                        ? 'bg-blue-600 text-white font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Profile Section */}
                <div className="border-t border-gray-200 p-4">
                    <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center space-x-3 mb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            SS
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{studentData.name}</p>
                            <p className="text-xs text-gray-500">{studentData.role}</p>
                            <p className="text-xs text-gray-500">{studentData.department} - {studentData.semester}</p>
                        </div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
                        <div className="text-sm text-gray-600">{formatDate(currentDateTime)}</div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8">
                    {/* Welcome Banner */}
                    <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">Welcome back, {studentData.name}!</h3>
                                <p className="text-blue-100">
                                    You have {studentData.assignmentsDue} classes today and {studentData.assignmentsDue} assignments due this week.
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-blue-100 mb-1">Current Semester</p>
                                <p className="text-xl font-semibold">{studentData.semester}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mb-6">
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
                    <div className="grid grid-cols-2 gap-6">
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
                                                {item.status === 'recorded' && (
                                                    <span className="px-2 py-0.5 bg-gray-600 text-white text-xs rounded-md font-medium">Recorded</span>
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
                                {recentActivity.map((activity, index) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activity.type === 'quiz' ? 'bg-yellow-100' :
                                                    activity.type === 'assignment' ? 'bg-blue-100' :
                                                        activity.type === 'lecture' ? 'bg-green-100' :
                                                            'bg-purple-100'
                                                }`}>
                                                <Icon className={`w-4 h-4 ${activity.type === 'quiz' ? 'text-yellow-600' :
                                                        activity.type === 'assignment' ? 'text-blue-600' :
                                                            activity.type === 'lecture' ? 'text-green-600' :
                                                                'text-purple-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                                <p className="text-sm text-gray-600">{activity.course} • {activity.score || activity.status || activity.duration}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
