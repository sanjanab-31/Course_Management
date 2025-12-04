import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import {
    BookOpen,
    Clock,
    Star,
    Search,
    Filter,
    Play,
    Calendar
} from 'lucide-react';

const MyCoursesPage = () => {
    const [activeTab, setActiveTab] = useState('enrolled');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    // Sample course data - replace with real data from Firebase
    const allCourses = [
        {
            id: 1,
            name: 'Data Structures & Algorithms',
            code: 'CS301',
            professor: 'Prof. Nishant Kumar',
            progress: 85,
            lectures: '38/45',
            duration: '12 weeks',
            rating: 4.8,
            color: 'blue',
            status: 'enrolled',
            nextClass: 'Today 10:00 AM',
            assignments: 3,
            quizzes: 2,
            totalLectures: '28/40'
        },
        {
            id: 2,
            name: 'Database Management Systems',
            code: 'CS302',
            professor: 'Dr. Deepak Sharma',
            progress: 72,
            lectures: '29/40',
            duration: '10 weeks',
            rating: 4.6,
            color: 'green',
            status: 'enrolled',
            nextClass: 'Tomorrow 2:00 AM',
            assignments: 2,
            quizzes: 1,
            totalLectures: '29/40'
        },
        {
            id: 3,
            name: 'Operating Systems',
            code: 'CS303',
            professor: 'Prof. Satyam Singh',
            progress: 90,
            lectures: '32/35',
            duration: '8 weeks',
            rating: 4.9,
            color: 'purple',
            status: 'enrolled',
            nextClass: 'Friday 11:00',
            assignments: 1,
            quizzes: 0,
            totalLectures: '32/35'
        },
        {
            id: 4,
            name: 'Machine Learning',
            code: 'CS401',
            professor: 'Dr. Priya Sharma',
            progress: 0,
            lectures: '0/50',
            duration: '14 weeks',
            rating: 4.7,
            color: 'blue',
            status: 'available',
            nextClass: null,
            assignments: 0,
            quizzes: 0,
            totalLectures: '0/50'
        },
        {
            id: 5,
            name: 'Web Development',
            code: 'CS304',
            professor: 'Prof. Amit Kumar',
            progress: 100,
            lectures: '40/40',
            duration: '12 weeks',
            rating: 4.9,
            color: 'green',
            status: 'completed',
            nextClass: null,
            assignments: 0,
            quizzes: 0,
            totalLectures: '40/40'
        },
        {
            id: 6,
            name: 'Artificial Intelligence',
            code: 'CS402',
            professor: 'Dr. Sarah Lee',
            progress: 0,
            lectures: '0/45',
            duration: '16 weeks',
            rating: 4.8,
            color: 'purple',
            status: 'available',
            nextClass: null,
            assignments: 0,
            quizzes: 0,
            totalLectures: '0/45'
        }
    ];

    // Filter courses based on active tab
    const filteredCourses = allCourses.filter(course => {
        const matchesTab = course.status === activeTab;
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.professor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Count courses by status
    const enrolledCount = allCourses.filter(c => c.status === 'enrolled').length;
    const availableCount = allCourses.filter(c => c.status === 'available').length;
    const completedCount = allCourses.filter(c => c.status === 'completed').length;

    const getColorClasses = (color) => {
        switch (color) {
            case 'blue':
                return {
                    bg: 'bg-blue-600',
                    text: 'text-blue-600',
                    lightBg: 'bg-blue-50',
                    border: 'border-blue-600'
                };
            case 'green':
                return {
                    bg: 'bg-green-600',
                    text: 'text-green-600',
                    lightBg: 'bg-green-50',
                    border: 'border-green-600'
                };
            case 'purple':
                return {
                    bg: 'bg-purple-600',
                    text: 'text-purple-600',
                    lightBg: 'bg-purple-50',
                    border: 'border-purple-600'
                };
            default:
                return {
                    bg: 'bg-blue-600',
                    text: 'text-blue-600',
                    lightBg: 'bg-blue-50',
                    border: 'border-blue-600'
                };
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
                    <p className="text-gray-600">Continue your learning journey</p>
                </div>

                {/* Tabs and Search/Filter Section */}
                <div className="flex items-center justify-between">
                    {/* Tabs */}
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('enrolled')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'enrolled'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Enrolled Courses ({enrolledCount})
                        </button>
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'available'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Available Courses
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Completed
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm font-medium text-gray-700"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                            {showFilter && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                        Sort by Progress
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                        Sort by Name
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                        Sort by Rating
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const colors = getColorClasses(course.color);
                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                {/* Course Header with Icon */}
                                <div className={`${colors.bg} h-32 flex items-center justify-center`}>
                                    <BookOpen className="w-16 h-16 text-white" strokeWidth={1.5} />
                                </div>

                                {/* Course Content */}
                                <div className="p-5">
                                    {/* Course Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {course.professor}
                                    </p>

                                    {/* Progress Section */}
                                    {course.status === 'enrolled' && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-bold text-gray-900">{course.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Course Stats */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <BookOpen className="w-4 h-4" />
                                                <span>Lectures</span>
                                            </div>
                                            <span className="font-semibold text-gray-900">{course.totalLectures}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-semibold text-gray-900">{course.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Class Info (for enrolled courses) */}
                                    {course.nextClass && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-600">Next: {course.nextClass}</span>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-gray-900 font-medium">{course.assignments} assignments</span>
                                                    <span className="text-gray-900 font-medium">{course.quizzes} quizzes</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className={`flex-1 ${colors.bg} text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 font-medium text-sm`}
                                        >
                                            <Play className="w-4 h-4" />
                                            <span>Continue</span>
                                        </button>
                                        <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredCourses.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-600">
                            {searchQuery ? 'Try adjusting your search' : `No ${activeTab} courses available`}
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyCoursesPage;
