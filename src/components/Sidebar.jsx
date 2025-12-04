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
    BookOpenCheck,
    Users,
    BarChart2
} from 'lucide-react';

const Sidebar = () => {
    const { currentUser, logout, userRole } = useAuth();
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

    const studentMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/student' },
        { id: 'my-courses', label: 'My Courses', icon: BookOpen, path: '/student/courses' },
        { id: 'live-classes', label: 'Live Classes', icon: Video, path: '/live-classes' },
        { id: 'assignments', label: 'Assignments', icon: FileText, path: '/assignments' },
        { id: 'quizzes-tests', label: 'Quizzes & Tests', icon: Award, path: '/quizzes-tests' },
        { id: 'study-materials', label: 'Study Materials', icon: BookMarked, path: '/study-materials' },
        { id: 'my-progress', label: 'My Progress', icon: TrendingUp, path: '/my-progress' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ];

    const teacherMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/teacher' },
        { id: 'my-courses', label: 'My Courses', icon: BookOpen, path: '/teacher/courses' },
        { id: 'students', label: 'Students', icon: Users, path: '/students' },
        { id: 'assignments', label: 'Assignments', icon: FileText, path: '/assignments' },
        { id: 'gradebook', label: 'Gradebook', icon: BarChart2, path: '/gradebook' },
        { id: 'live-classes', label: 'Live Classes', icon: Video, path: '/live-classes' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ];

    const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

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

    return (
        <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-200 flex flex-col z-40">
            {/* Logo Section */}
            <div className="p-5 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-12 bg-white rounded-full flex items-center justify-center">
                        <img src="https://res.cloudinary.com/dfflvhcbx/image/upload/v1764820736/download-removebg-preview_i5gn9t.png" alt="" /> 
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-gray-900">SRI ESHWAR</h1>
                        <p className="text-xs text-gray-500">Learning</p>
                        <p className="text-xs text-gray-500">Management System</p>
                    </div>
                </div>
                <div className="mt-3 px-3 py-1.5 bg-gray-100 rounded-md text-center">
                    <span className="text-xs font-medium text-gray-700">
                        {userRole === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
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
                        {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                        <p className="text-xs text-gray-500">{userData.role}</p>
                        <p className="text-xs text-gray-500">{userData.department}</p>
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
