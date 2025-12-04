import React from 'react';
import DashboardLayout from '../DashboardLayout';
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Video,
  MessageCircle,
  CheckCircle
} from 'lucide-react';

const TeacherDashboard = () => {
  // Sample data - replace with real data from Firebase
  const teacherData = {
    name: 'Prof. Nishant Kumar',
    role: 'Assistant Professor',
    department: 'Computer Science',
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
    {
      title: 'Data Structures',
      time: '10:00 AM',
      location: 'Virtual Room 1',
      students: 45,
      status: 'upcoming'
    },
    {
      title: 'Algorithms',
      time: '2:00 PM',
      location: 'Virtual Room 2',
      students: 38,
      status: 'upcoming'
    },
    {
      title: 'DBMS',
      time: '4:00 PM',
      location: 'Virtual Room 3',
      students: 52,
      status: 'upcoming'
    }
  ];

  const recentActivity = [
    {
      type: 'assignment',
      title: 'Assignment submitted',
      student: 'Satyam Singh',
      course: 'Data Structures',
      time: '2 hours ago',
      icon: FileText
    },
    {
      type: 'doubt',
      title: 'Doubt raised',
      student: 'Deepak Sharma',
      course: 'Algorithms',
      time: '3 hours ago',
      icon: MessageCircle
    },
    {
      type: 'quiz',
      title: 'Quiz completed',
      student: 'Nishant Kumar', // Assuming student name
      course: 'DBMS',
      time: '5 hours ago',
      icon: CheckCircle
    },
    {
      type: 'live_class',
      title: 'Live class attended',
      student: 'Satyam Singh',
      course: 'OS',
      time: '1 day ago',
      icon: Video
    }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Courses */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Total Courses</span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold text-gray-900">{teacherData.totalCourses}</span>
          </div>
          <div className="text-xs text-gray-500">{teacherData.totalCoursesChange}</div>
        </div>

        {/* Active Students */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Active Students</span>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold text-gray-900">{teacherData.activeStudents}</span>
          </div>
          <div className="text-xs text-gray-500">{teacherData.activeStudentsChange}</div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Pending Reviews</span>
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold text-gray-900">{teacherData.pendingReviews}</span>
          </div>
          <div className="text-xs text-gray-500">{teacherData.pendingReviewsChange}</div>
        </div>

        {/* Class Rating */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Class Rating</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold text-gray-900">{teacherData.classRating}</span>
          </div>
          <div className="text-xs text-gray-500">{teacherData.classRatingChange}</div>
        </div>
      </div>

      {/* Today's Classes and Recent Activity */}
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
                  <p className="text-sm text-gray-600 mt-1">
                    {cls.time} • {cls.location}
                  </p>
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
                    <p className="text-sm text-gray-600 truncate">
                      {activity.student} • {activity.course}
                    </p>
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
