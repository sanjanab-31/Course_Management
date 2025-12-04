import React, { useState, useEffect } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getAllStudentEnrollments, subscribeToStudentEnrollments } from '../../services/courseService';
import {
    getTodayClasses,
    getUpcomingClasses,
    getRecordedClasses,
    subscribeToLiveClassesUpdates,
    formatClassTime,
    formatClassDate
} from '../../services/liveClassService';
import { User, Clock, Users, Video, Loader2, BookOpen, AlertCircle } from 'lucide-react';

const LiveClassesPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('today');
    const [allClasses, setAllClasses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    // Fetch enrolled courses
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            setError('Please log in to view live classes');
            return;
        }

        const fetchEnrollments = async () => {
            try {
                setLoading(false);
                setError(null);

                const enrollments = await getAllStudentEnrollments(currentUser.uid);
                const courseIds = enrollments.map(enrollment => enrollment.courseId);
                setEnrolledCourseIds(courseIds);
            } catch (err) {
                console.error('Error fetching enrollments:', err);
                setError('Failed to load enrollments');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();

        // Subscribe to real-time enrollment updates
        const unsubscribeEnrollments = subscribeToStudentEnrollments(
            currentUser.uid,
            (enrollmentsData) => {
                const courseIds = enrollmentsData.map(enrollment => enrollment.courseId);
                setEnrolledCourseIds(courseIds);
            }
        );

        return () => {
            unsubscribeEnrollments();
        };
    }, [currentUser]);

    // Subscribe to real-time live classes updates
    useEffect(() => {
        if (enrolledCourseIds.length === 0) {
            setAllClasses([]);
            return;
        }

        const unsubscribeClasses = subscribeToLiveClassesUpdates(
            enrolledCourseIds,
            (classesData) => {
                setAllClasses(classesData);
            }
        );

        return () => {
            unsubscribeClasses();
        };
    }, [enrolledCourseIds]);

    // Filter classes based on active tab
    const getClassesByTab = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        switch (activeTab) {
            case 'today':
                return allClasses.filter(classItem => {
                    const classDate = classItem.startTime?.toDate?.() || new Date(classItem.startTime);
                    return classDate >= today && classDate < tomorrow;
                });
            case 'upcoming':
                return allClasses.filter(classItem => {
                    const classDate = classItem.startTime?.toDate?.() || new Date(classItem.startTime);
                    return classDate >= tomorrow && classItem.status !== 'completed';
                });
            case 'recorded':
                return allClasses.filter(classItem => {
                    return classItem.status === 'completed' && classItem.recordingUrl;
                });
            default:
                return [];
        }
    };

    const handleJoinClass = (classItem) => {
        if (classItem.meetingUrl) {
            window.open(classItem.meetingUrl, '_blank');
        } else {
            alert('Meeting URL not available');
        }
    };

    const handleWatchRecording = (classItem) => {
        if (classItem.recordingUrl) {
            window.open(classItem.recordingUrl, '_blank');
        } else {
            alert('Recording URL not available');
        }
    };

    const tabs = [
        { id: 'today', label: "Today's Classes" },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'recorded', label: 'Recorded Classes' }
    ];

    const filteredClasses = getClassesByTab();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Join live sessions and access recorded lectures</h1>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading live classes...</p>
                        </div>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <p className="text-gray-600">{error}</p>
                        </div>
                    </div>
                ) : enrolledCourseIds.length === 0 ? (
                    /* No Enrollments State */
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Enrolled Courses
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You need to enroll in courses to access live classes
                        </p>
                        <a
                            href="/my-courses"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Browse Available Courses
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <div className="flex space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                            ? 'text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Class Cards */}
                        {filteredClasses.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Classes Available
                                </h3>
                                <p className="text-gray-600">
                                    {activeTab === 'today' && "No classes scheduled for today"}
                                    {activeTab === 'upcoming' && "No upcoming classes scheduled"}
                                    {activeTab === 'recorded' && "No recorded classes available"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredClasses.map((classItem) => (
                                    <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                {/* Course Title and Badge */}
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        {classItem.courseName}
                                                    </h3>
                                                    {classItem.status === 'live' && (
                                                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded">
                                                            live
                                                        </span>
                                                    )}
                                                    {classItem.status === 'upcoming' && (
                                                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                                                            upcoming
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Class Details */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <User className="w-4 h-4" />
                                                        <span>{classItem.professor}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {activeTab === 'recorded'
                                                                ? `Recorded on ${formatClassDate(classItem.startTime)}`
                                                                : `${formatClassDate(classItem.startTime)} - ${formatClassTime(classItem.startTime, classItem.endTime)}`
                                                            }
                                                            {classItem.duration && ` (${classItem.duration} min)`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Video className="w-4 h-4" />
                                                        <span>{classItem.participants || 0} Participants</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Meeting ID and Button */}
                                            <div className="flex flex-col items-end space-y-3">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        Meeting ID: {classItem.meetingId || 'N/A'}
                                                    </p>
                                                </div>
                                                {classItem.status === 'live' ? (
                                                    <button
                                                        onClick={() => handleJoinClass(classItem)}
                                                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        Join Now
                                                    </button>
                                                ) : classItem.status === 'upcoming' ? (
                                                    <button className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors">
                                                        Notify Me
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleWatchRecording(classItem)}
                                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        Watch Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default LiveClassesPage;
