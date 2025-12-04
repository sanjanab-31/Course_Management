import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
    getAllCourses,
    getAllStudentEnrollments,
    enrollInCourse,
    subscribeToCoursesUpdates,
    subscribeToStudentEnrollments
<<<<<<< HEAD:src/components/student/StudentCourses.jsx
} from '../../services/courseService';
=======
} from '../services/courseService';
import { checkCourseCompletion } from '../services/certificateService';
import CertificateGenerator from './CertificateGenerator';
>>>>>>> f97bea7a923e955961975ab0d0a31d9933014364:src/components/MyCoursesPage.jsx
import {
    BookOpen,
    Clock,
    Star,
    Search,
    Filter,
    Play,
    Loader2,
    CheckCircle
} from 'lucide-react';

const MyCoursesPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('available');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(null);
    const [notification, setNotification] = useState(null);
    const [certificateData, setCertificateData] = useState({});

    // Fetch courses and enrollments from Firebase
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(false);
                const [coursesData, enrollmentsData] = await Promise.all([
                    getAllCourses(),
                    getAllStudentEnrollments(currentUser.uid)
                ]);
                setAllCourses(coursesData);
                setEnrollments(enrollmentsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Failed to load courses', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Subscribe to real-time updates
        const unsubscribeCourses = subscribeToCoursesUpdates((courses) => {
            setAllCourses(courses);
        });

        const unsubscribeEnrollments = subscribeToStudentEnrollments(
            currentUser.uid,
            (enrollmentsData) => {
                setEnrollments(enrollmentsData);
            }
        );

        return () => {
            unsubscribeCourses();
            unsubscribeEnrollments();
        };
    }, [currentUser]);

    // Check certificate eligibility for enrolled courses
    useEffect(() => {
        const checkCertificates = async () => {
            if (!currentUser || enrollments.length === 0) return;

            const certData = {};
            for (const enrollment of enrollments) {
                const completion = await checkCourseCompletion(enrollment.courseId, currentUser.uid);
                certData[enrollment.courseId] = completion;
            }
            setCertificateData(certData);
        };

        checkCertificates();
    }, [enrollments, currentUser]);

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle enrollment
    const handleEnroll = async (courseId) => {
        if (!currentUser) {
            showNotification('Please log in to enroll', 'error');
            return;
        }

        try {
            setEnrolling(courseId);
            await enrollInCourse(courseId, currentUser.uid);
            showNotification('Successfully enrolled in course!', 'success');
        } catch (error) {
            console.error('Error enrolling:', error);
            showNotification('Failed to enroll in course', 'error');
        } finally {
            setEnrolling(null);
        }
    };

    // Combine courses with enrollment data
    const coursesWithEnrollment = allCourses.map(course => {
        const enrollment = enrollments.find(e => e.courseId === course.id);

        if (enrollment) {
            return {
                ...course,
                status: enrollment.enrollmentData.status,
                progress: enrollment.enrollmentData.progress || 0,
                completedLectures: enrollment.enrollmentData.completedLectures || 0,
                lectures: `${enrollment.enrollmentData.completedLectures || 0}/${course.totalLectures || 0}`,
                totalLectures: `${enrollment.enrollmentData.completedLectures || 0}/${course.totalLectures || 0}`,
                nextClass: enrollment.enrollmentData.nextClass,
                assignments: enrollment.enrollmentData.assignments || 0,
                quizzes: enrollment.enrollmentData.quizzes || 0
            };
        }

        return {
            ...course,
            status: 'available',
            progress: 0,
            completedLectures: 0,
            lectures: `0/${course.totalLectures || 0}`,
            totalLectures: `0/${course.totalLectures || 0}`,
            nextClass: null,
            assignments: 0,
            quizzes: 0
        };
    });

    // Filter courses based on active tab
    const filteredCourses = coursesWithEnrollment.filter(course => {
        const matchesTab = course.status === activeTab;
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.professor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Count courses by status
    const enrolledCount = coursesWithEnrollment.filter(c => c.status === 'enrolled').length;
    const availableCount = coursesWithEnrollment.filter(c => c.status === 'available').length;
    const completedCount = coursesWithEnrollment.filter(c => c.status === 'completed').length;

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
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    } text-white animate-slide-in`}>
                    {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading courses...</p>
                    </div>
                </div>
            ) : (
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
                                onClick={() => setActiveTab('available')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'available'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Available Courses ({availableCount})
                            </button>
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
                                onClick={() => setActiveTab('completed')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Completed ({completedCount})
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
                            const isEnrolling = enrolling === course.id;

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
                                            {course.status === 'available' ? (
                                                <button
                                                    onClick={() => handleEnroll(course.id)}
                                                    disabled={isEnrolling}
                                                    className={`flex-1 ${colors.bg} text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 font-medium text-sm disabled:opacity-50`}
                                                >
                                                    {isEnrolling ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Enrolling...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Enroll</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : course.status === 'completed' && certificateData[course.id]?.isCompleted ? (
                                                // Show certificate button for completed courses with all requirements met
                                                <CertificateGenerator
                                                    studentName={currentUser?.displayName || currentUser?.email || 'Student'}
                                                    courseName={course.name}
                                                    grade={certificateData[course.id]?.grade || 'N/A'}
                                                    completionDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    onDownload={() => showNotification('Certificate downloaded successfully!', 'success')}
                                                />
                                            ) : (
                                                <button
                                                    className={`flex-1 ${colors.bg} text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 font-medium text-sm`}
                                                >
                                                    <Play className="w-4 h-4" />
                                                    <span>Continue</span>
                                                </button>
                                            )}
                                            <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                                Details
                                            </button>
                                        </div>

                                        {/* Certificate Eligibility Info for Completed Courses */}
                                        {course.status === 'completed' && certificateData[course.id] && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                {certificateData[course.id].isCompleted ? (
                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            Certificate Ready! Grade: {certificateData[course.id].grade} ({certificateData[course.id].percentage}%)
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-600">
                                                        <p className="font-medium mb-1">Certificate Requirements:</p>
                                                        <p className="text-xs">
                                                            • Quizzes: {certificateData[course.id].completedQuizzes || 0}/3 completed<br />
                                                            • Assignments: {certificateData[course.id].submittedAssignments || 0}/2 submitted
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {allCourses.length === 0 ? 'No courses in database' : 'No courses found'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery
                                    ? 'Try adjusting your search'
                                    : allCourses.length === 0
                                        ? 'Add courses to Firebase to get started'
                                        : `No ${activeTab} courses available`
                                }
                            </p>
                            {allCourses.length === 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto text-left">
                                    <p className="text-sm text-blue-900 font-medium mb-2">💡 To add sample courses:</p>
                                    <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                                        <li>Open Firebase Console → Firestore Database</li>
                                        <li>Create a collection named "courses"</li>
                                        <li>Add documents with fields: name, code, professor, duration, totalLectures, rating, color</li>
                                        <li>Or use the sample data script in <code className="bg-blue-100 px-1 rounded">src/utils/addSampleCourses.js</code></li>
                                    </ol>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default MyCoursesPage;
