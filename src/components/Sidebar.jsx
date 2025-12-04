import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    BookOpenCheck
} from 'lucide-react';

const Sidebar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
        { id: 'my-courses', label: 'My Courses', icon: BookOpen, path: '/my-courses' },
        { id: 'live-classes', label: 'Live Classes', icon: Video, path: '/live-classes' },
        { id: 'assignments', label: 'Assignments', icon: FileText, path: '/assignments' },
        { id: 'quizzes-tests', label: 'Quizzes & Tests', icon: Award, path: '/quizzes-tests' },
        { id: 'study-materials', label: 'Study Materials', icon: BookMarked, path: '/study-materials' },
        { id: 'my-progress', label: 'My Progress', icon: TrendingUp, path: '/my-progress' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ];

    // Sample student data - replace with real data from Firebase/context
    const studentData = {
        name: 'Satyam Singh',
        role: 'B.Tech Student',
        semester: 'Semester 5',
        department: 'CSE',
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-200 flex flex-col z-40">
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
                    const isActive = location.pathname === item.path ||
                        (item.path === '/dashboard' && location.pathname === '/');
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
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
    );
};

export default Sidebar;
