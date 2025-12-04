import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DashboardHeader = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const location = useLocation();

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
                <div className="text-sm text-gray-600">{formatDate(currentDateTime)}</div>
            </div>
        </header>
    );
};

export default DashboardHeader;
