import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TeacherHeader = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const location = useLocation();
    const navigate = useNavigate();

    const userData = {
        name: 'K.Agalya',
        role: 'Assistant Professor',
        department: 'Computer Science and Engineering',
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        const titles = {
            '/teacher': 'Dashboard',
            '/teacher/courses': 'My Courses',
            '/teacher/assignments': 'Assignments',
            '/teacher/live-classes': 'Live Classes',
            '/students': 'Students',
            '/teacher/gradebook': 'Gradebook',
            '/settings': 'Settings',
            '/profile': 'Profile',
        };
        return titles[path] || 'Dashboard';
    };

    return (
        <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 z-30">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h2>
                <div className="flex items-center space-x-6">
                    <div className="text-sm text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                        {formatDate(currentDateTime)}
                    </div>

                    {/* Profile Section */}
                    <button
                        onClick={() => navigate('/teacher/profile')}
                        className="flex items-center space-x-3 hover:bg-purple-50 p-1.5 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 leading-none">{userData.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{userData.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-purple-50">
                            {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TeacherHeader;
