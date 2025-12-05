import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    BookOpen,
    Video,
    FileText,
    Users,
    BarChart2,
    Settings,
    LogOut
} from 'lucide-react';

const TeacherSidebar = () => {
    const { logout } = useAuth();
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

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/teacher' },
        { id: 'my-courses', label: 'My Courses', icon: BookOpen, path: '/teacher/courses' },
        { id: 'students', label: 'Students', icon: Users, path: '/students' },
        { id: 'assignments', label: 'Assignments', icon: FileText, path: '/teacher/assignments' },
        { id: 'gradebook', label: 'Gradebook', icon: BarChart2, path: '/gradebook' },
        { id: 'live-classes', label: 'Live Classes', icon: Video, path: '/teacher/live-classes' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/teacher/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-200 flex flex-col z-40">
            {/* Logo Section */}
            <div className="p-5 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-50 h-12 bg-white rounded-full flex items-center justify-center">
                        <img src="https://res.cloudinary.com/dfflvhcbx/image/upload/v1764841818/download-removebg-preview_1_agz3sp.png" alt="" />
                    </div>
                </div>
                <div className="mt-3 px-3 py-1.5 bg-purple-100 rounded-md text-center">
                    <span className="text-xs font-medium text-purple-700">
                        Teacher Portal
                    </span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center space-x-3 px-5 py-2.5 text-sm transition-colors ${isActive
                                ? 'bg-purple-600 text-white font-medium'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="border-t border-gray-200 p-4">
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

export default TeacherSidebar;
