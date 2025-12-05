import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { TrendingUp, Award, BookOpen, Clock, Loader2, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsApi, quizzesApi, assignmentsApi } from '../../services/api';

const MyProgressPage = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [quizStats, setQuizStats] = useState({ total: 0, completed: 0, avgScore: 0 });
    const [assignmentStats, setAssignmentStats] = useState({ total: 0, submitted: 0, avgScore: 0 });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProgressData();
    }, [currentUser]);

    const fetchProgressData = async () => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 1. Get enrolled courses
            const enrollments = await enrollmentsApi.getByUserId(currentUser.uid);

            if (enrollments.length === 0) {
                setEnrolledCourses([]);
                setLoading(false);
                return;
            }

            const courses = enrollments.map(e => ({
                id: e.courseId,
                name: e.courseData?.title || e.courseData?.name || 'Unknown Course',
                professor: e.courseData?.instructor || e.courseData?.professor || 'Unknown',
                progress: e.enrollmentData?.progress || 0,
                color: e.courseData?.color || 'blue'
            }));
            setEnrolledCourses(courses);

            // 2. Fetch quizzes and assignments for all courses
            let totalQuizzes = 0;
            let completedQuizzes = 0;
            let totalQuizScore = 0;

            let totalAssignments = 0;
            let submittedAssignments = 0;
            let totalAssignmentScore = 0;
            let scoredAssignmentsCount = 0;

            await Promise.all(
                courses.map(async (course) => {
                    try {
                        // Fetch quizzes
                        const courseQuizzes = await quizzesApi.getByCourse(course.id);
                        totalQuizzes += courseQuizzes.length;

                        // Check attempts (mock logic for now as attempts API might vary)
                        // In a real implementation, you'd fetch attempts for each quiz
                        // For now, we'll assume completed if status is 'completed' or score > 0
                        const completedCourseQuizzes = courseQuizzes.filter(q => q.status === 'completed' || (q.score && q.score > 0));
                        completedQuizzes += completedCourseQuizzes.length;

                        completedCourseQuizzes.forEach(q => {
                            totalQuizScore += (q.score || 0);
                        });

                        // Fetch assignments
                        const courseAssignments = await assignmentsApi.getByCourse(course.id);
                        totalAssignments += courseAssignments.length;

                        // Check submissions
                        const submittedCourseAssignments = courseAssignments.filter(a => a.status === 'submitted' || a.submittedDate);
                        submittedAssignments += submittedCourseAssignments.length;

                        submittedCourseAssignments.forEach(a => {
                            if (a.score !== null && a.score !== undefined) {
                                totalAssignmentScore += a.score;
                                scoredAssignmentsCount++;
                            }
                        });

                    } catch (err) {
                        console.error(`Error fetching data for course ${course.id}:`, err);
                    }
                })
            );

            setQuizStats({
                total: totalQuizzes,
                completed: completedQuizzes,
                avgScore: completedQuizzes > 0 ? Math.round(totalQuizScore / completedQuizzes) : 0
            });

            setAssignmentStats({
                total: totalAssignments,
                submitted: submittedAssignments,
                avgScore: scoredAssignmentsCount > 0 ? Math.round(totalAssignmentScore / scoredAssignmentsCount) : 0
            });

        } catch (err) {
            console.error("Error fetching progress data:", err);
            setError("Failed to load progress data");
        } finally {
            setLoading(false);
        }
    };

    // Calculate overall course completion
    const overallProgress = enrolledCourses.length > 0
        ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
        : 0;

    const stats = [
        { label: 'Overall Progress', value: `${overallProgress}%`, icon: TrendingUp, color: 'blue' },
        { label: 'Courses Enrolled', value: enrolledCourses.length.toString(), icon: BookOpen, color: 'green' },
        { label: 'Quizzes Completed', value: `${quizStats.completed}/${quizStats.total}`, icon: Target, color: 'purple' },
        { label: 'Assignments Submitted', value: `${assignmentStats.submitted}/${assignmentStats.total}`, icon: CheckCircle, color: 'orange' }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-600',
            green: 'bg-green-600',
            purple: 'bg-purple-600',
            orange: 'bg-orange-600',
            red: 'bg-red-600',
            teal: 'bg-teal-600'
        };
        return colors[color] || 'bg-blue-600';
    };

    const getIconBgClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100',
            green: 'bg-green-100',
            purple: 'bg-purple-100',
            orange: 'bg-orange-100',
            red: 'bg-red-100',
            teal: 'bg-teal-100'
        };
        return colors[color] || 'bg-blue-100';
    };

    const getIconTextClasses = (color) => {
        const colors = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            orange: 'text-orange-600',
            red: 'text-red-600',
            teal: 'text-teal-600'
        };
        return colors[color] || 'text-blue-600';
    };

    return (
        <StudentLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Track your academic performance</h1>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                        <span className="text-gray-600">Loading progress data...</span>
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
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className={`w-12 h-12 ${getIconBgClasses(stat.color)} rounded-lg flex items-center justify-center mb-4`}>
                                            <Icon className={`w-6 h-6 ${getIconTextClasses(stat.color)}`} />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Performance Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Quiz Performance */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Quiz Performance</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Quizzes</span>
                                        <span className="font-semibold text-gray-900">{quizStats.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Completed</span>
                                        <span className="font-semibold text-gray-900">{quizStats.completed}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Average Score</span>
                                        <span className="font-semibold text-green-600">{quizStats.avgScore}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${quizStats.total > 0 ? (quizStats.completed / quizStats.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Assignment Performance */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Assignment Performance</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Assignments</span>
                                        <span className="font-semibold text-gray-900">{assignmentStats.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Submitted</span>
                                        <span className="font-semibold text-gray-900">{assignmentStats.submitted}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Average Score</span>
                                        <span className="font-semibold text-green-600">{assignmentStats.avgScore > 0 ? `${assignmentStats.avgScore}%` : 'N/A'}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${assignmentStats.total > 0 ? (assignmentStats.submitted / assignmentStats.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Progress */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Course Progress</h2>
                            {enrolledCourses.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No enrolled courses found. Enroll in courses to track your progress.</p>
                            ) : (
                                <div className="space-y-6">
                                    {enrolledCourses.map((course, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-gray-900">{course.name}</span>
                                                <span className="font-bold text-gray-900">{course.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`${getColorClasses(course.color)} h-3 rounded-full transition-all duration-300`}
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </StudentLayout>
    );
};

export default MyProgressPage;
