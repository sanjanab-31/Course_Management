import React from 'react';
import DashboardLayout from '../common/DashboardLayout';
import {
    BookOpen,
    Users,
    FileText,
    TrendingUp,
    Calendar,
    Video,
    MessageCircle,
    CheckCircle,
    Plus,
    HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const navigate = useNavigate();

    // Sample data
    const teacherData = {
        name: 'Prof. Nishant Kumar',
        totalCourses: 12,
        totalCoursesChange: '+2 this month',
        activeStudents: 456,
        activeStudentsChange: '+28 this week',
        pendingReviews: 24,
        pendingReviewsChange: '6 urgent',
        classRating: 4.8,
        classRatingChange: '+0.2 this month',
    };

    const todayClasses = [
        { title: 'Data Structures', time: '10:00 AM', location: 'Virtual Room 1', students: 45 },
        { title: 'Algorithms', time: '2:00 PM', location: 'Virtual Room 2', students: 38 },
        { title: 'DBMS', time: '4:00 PM', location: 'Virtual Room 3', students: 52 }
    ];

    const recentActivity = [
        { type: 'assignment', title: 'Assignment submitted', student: 'Satyam Singh', course: 'Data Structures', time: '2 hours ago', icon: FileText },
        { type: 'doubt', title: 'Doubt raised', student: 'Deepak Sharma', course: 'Algorithms', time: '3 hours ago', icon: MessageCircle },
        { type: 'quiz', title: 'Quiz completed', student: 'Nishant Kumar', course: 'DBMS', time: '5 hours ago', icon: CheckCircle },
    ];

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Mock data for charts
    const enrollmentData = [320, 350, 400, 450]; // Jan, Feb, Mar, Apr
    const completionData = [75, 82, 85, 88]; // Jan, Feb, Mar, Apr

    return (
        <DashboardLayout>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6 shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-3xl font-bold mb-2">Namaste, {teacherData.name}!</h3>
                        <p className="text-blue-100 text-lg">
                            You have {todayClasses.length} classes today and {teacherData.pendingReviews} assignments to review.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-blue-100 mb-1">Today's Date</p>
                        <p className="text-xl font-semibold">{currentDate}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Total Courses</span>
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="mb-1"><span className="text-3xl font-bold text-gray-900">{teacherData.totalCourses}</span></div>
                    <div className="text-xs text-gray-500">{teacherData.totalCoursesChange}</div>
                </div>
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Active Students</span>
                        <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="mb-1"><span className="text-3xl font-bold text-gray-900">{teacherData.activeStudents}</span></div>
                    <div className="text-xs text-gray-500">{teacherData.activeStudentsChange}</div>
                </div>
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Pending Reviews</span>
                        <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="mb-1"><span className="text-3xl font-bold text-gray-900">{teacherData.pendingReviews}</span></div>
                    <div className="text-xs text-gray-500">{teacherData.pendingReviewsChange}</div>
                </div>
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Class Rating</span>
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="mb-1"><span className="text-3xl font-bold text-gray-900">{teacherData.classRating}</span></div>
                    <div className="text-xs text-gray-500">{teacherData.classRatingChange}</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Student Enrollment Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Enrollment Trend</h3>
                    <div className="h-64 relative">
                        {/* Simple SVG Line Chart */}
                        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="150" x2="400" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                            <line x1="0" y1="100" x2="400" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                            <line x1="0" y1="50" x2="400" y2="50" stroke="#e5e7eb" strokeWidth="1" />

                            {/* Line */}
                            <polyline
                                points="0,120 133,100 266,80 400,60"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                            />
                            {/* Points */}
                            <circle cx="0" cy="120" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx="133" cy="100" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx="266" cy="80" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx="400" cy="60" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                        </svg>
                        {/* Labels */}
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                        </div>
                        {/* Y-Axis Labels (Absolute positioning) */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pointer-events-none" style={{ height: '80%' }}>
                            <span>600</span>
                            <span>450</span>
                            <span>300</span>
                            <span>150</span>
                            <span>0</span>
                        </div>
                    </div>
                </div>

                {/* Course Completion Rate */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Completion Rate</h3>
                    <div className="h-64 flex items-end justify-between space-x-6 px-4">
                        {completionData.map((value, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 w-full">
                                <div className="w-full bg-green-500 rounded-t-md hover:bg-green-600 transition-all" style={{ height: `${value}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/teacher/courses')} className="flex flex-col items-center justify-center p-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                        <BookOpen className="w-8 h-8 mb-3" />
                        <span className="font-medium">Create Course</span>
                    </button>
                    <button onClick={() => navigate('/teacher/assignments')} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
                        <FileText className="w-8 h-8 mb-3 text-gray-700" />
                        <span className="font-medium">New Assignment</span>
                    </button>
                    <button onClick={() => navigate('/teacher/live-classes')} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
                        <Video className="w-8 h-8 mb-3 text-gray-700" />
                        <span className="font-medium">Start Live Class</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-8 h-8 mb-3 text-gray-700" />
                        <span className="font-medium">Answer Doubts</span>
                    </button>
                </div>
            </div>

            {/* Bottom Section: Today's Classes & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Classes */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                        <Calendar className="w-5 h-5 text-gray-700 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Today's Classes</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {todayClasses.map((cls, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">{cls.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{cls.time} • {cls.location}</p>
                                    <div className="mt-2 text-xs font-medium text-gray-500 bg-gray-200 inline-block px-2 py-1 rounded">
                                        {cls.students} students
                                    </div>
                                </div>
                                <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
                                    <Video className="w-4 h-4" />
                                    <span>Join</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentActivity.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activity.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                                        activity.type === 'doubt' ? 'bg-orange-100 text-orange-600' :
                                            activity.type === 'quiz' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                        }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                        <p className="text-sm text-gray-600 truncate">{activity.student} • {activity.course}</p>
                                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TeacherDashboard;
