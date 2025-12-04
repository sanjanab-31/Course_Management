import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentHeader = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const location = useLocation();
    const navigate = useNavigate();

    const userData = {
        name: 'Satyam Singh',
        role: 'B.Tech Student',
        semester: 'Semester 5',
        department: 'CSE',
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
            '/student': 'Dashboard',
            '/student/courses': 'My Courses',
            '/live-classes': 'Live Classes',
            '/assignments': 'Assignments',
            '/quizzes-tests': 'Quizzes & Tests',
            '/study-materials': 'Study Materials',
            '/my-progress': 'My Progress',
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
                    <div className="text-sm text-[#0277bd] bg-[#e1f5fe] px-3 py-1 rounded-full border border-[#b3e5fc]">
                        {formatDate(currentDateTime)}
                    </div>

                    {/* Profile Section */}
                    <button
                        onClick={() => navigate('/student/profile')}
                        className="flex items-center space-x-3 hover:bg-[#e1f5fe] p-1.5 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 leading-none">{userData.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{userData.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#0277bd] rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-[#e1f5fe]">
                            {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default StudentHeader;
