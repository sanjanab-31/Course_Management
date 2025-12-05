import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsApi, liveClassesApi } from '../../services/api';
import { User, Clock, Users, Video, Loader2, BookOpen, AlertCircle } from 'lucide-react';

const LiveClassesPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('today');
    const [allClasses, setAllClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch live classes for enrolled courses
    useEffect(() => {
        fetchClasses();
    }, [currentUser]);

    const fetchClasses = async () => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // 1. Get enrolled courses
            const enrollments = await enrollmentsApi.getByUserId(currentUser.uid);

            if (enrollments.length === 0) {
                setAllClasses([]);
                setLoading(false);
                return;
            }

            // 2. Fetch live classes for all enrolled courses
            const allClassesData = [];
            await Promise.all(
                enrollments.map(async (enrollment) => {
                    try {
                        const classes = await liveClassesApi.getByCourse(enrollment.courseId);

                        classes.forEach(cls => {
                            allClassesData.push({
                                ...cls,
                                id: cls._id || cls.id,
                                courseId: enrollment.courseId,
                                courseName: enrollment.courseData?.title || 'Unknown Course',
                                professor: cls.instructor || enrollment.courseData?.instructor || 'Unknown',
                                startTime: cls.scheduledAt || cls.startTime,
                                endTime: cls.endTime,
                                meetingUrl: cls.meetingLink || cls.meetingUrl,
                                meetingLink: cls.meetingLink || cls.meetingUrl,
                                status: cls.status || 'upcoming',
                                attendees: cls.attendees || 0
                            });
                        });
                    } catch (err) {
                        console.error(`Error fetching classes for course ${enrollment.courseId}:`, err);
                    }
                })
            );

            setAllClasses(allClassesData);
            setError(null);
        } catch (err) {
            console.error('Error fetching live classes:', err);
            setError('Failed to load live classes');
        } finally {
            setLoading(false);
        }
    };

    // Filter classes based on active tab
    const getClassesByTab = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        switch (activeTab) {
            case 'today':
                return allClasses.filter(classItem => {
                    const classDate = new Date(classItem.startTime);
                    return classDate >= today && classDate < tomorrow;
                });
            case 'upcoming':
                return allClasses.filter(classItem => {
                    const classDate = new Date(classItem.startTime);
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
        const meetingLink = classItem.meetingLink || classItem.meetingUrl;
        if (meetingLink) {
            window.open(meetingLink, '_blank');
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

    const formatClassDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatClassTime = (start, end) => {
        if (!start) return 'TBD';
        const startTime = new Date(start).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        if (!end) return startTime;
        const endTime = new Date(end).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${startTime} - ${endTime}`;
    };

    const tabs = [
        { id: 'today', label: "Today's Classes" },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'recorded', label: 'Recorded Classes' }
    ];

    const filteredClasses = getClassesByTab();

    return (
        <StudentLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
                    <p className="text-gray-600 mt-1">Join live sessions and access recorded lectures</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                        <span className="text-gray-600">Loading classes...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        {error}
                    </div>
                )}

                {!loading && !error && (
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
                                    <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
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
                                                        <Users className="w-4 h-4" />
                                                        <span>{classItem.attendees || 0} Participants</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Meeting Link and Button */}
                                            <div className="flex flex-col items-end space-y-3">
                                                {(classItem.meetingLink || classItem.meetingUrl) && (
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            Meeting Link Available
                                                        </p>
                                                    </div>
                                                )}
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
        </StudentLayout>
    );
};

export default LiveClassesPage;
