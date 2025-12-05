import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const location = useLocation();
    const { userRole } = useAuth();
    const navigate = useNavigate();

    // Sample data - replace with real data from Firebase/context
    const userData = userRole === 'teacher' ? {
        name: 'Prof. Nishant Kumar',
        role: 'Assistant Professor',
        department: 'Computer Science',
    } : {
        name: 'Satyam Singh',
        role: 'B.Tech Student',
        semester: 'Semester 5',
        department: 'CSE',
    };

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format date
    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Get page title based on current route
    const getPageTitle = () => {
        const path = location.pathname;
        const titles = {
            '/': 'Dashboard',
            '/dashboard': 'Dashboard',
            '/student': 'Dashboard',
            '/teacher': 'Dashboard',
            '/my-courses': 'My Courses',
            '/student/courses': 'My Courses',
            '/teacher/courses': 'My Courses',
            '/teacher/assignments': 'Assignments',
            '/teacher/live-classes': 'Live Classes',
            '/live-classes': 'Live Classes',
            '/assignments': 'Assignments',
            '/quizzes-tests': 'Quizzes & Tests',
            '/study-materials': 'Study Materials',
            '/my-progress': 'My Progress',
            '/settings': 'Settings',
            '/profile': 'Profile',
            '/students': 'Students',
            '/gradebook': 'Gradebook'
        };
        return titles[path] || 'Dashboard';
    };

    return (
        <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 z-30">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h2>
                <div className="flex items-center space-x-6">
                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                        {formatDate(currentDateTime)}
                    </div>

                    {/* Profile Section */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center space-x-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 leading-none">{userData.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{userData.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-blue-50">
                            {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
