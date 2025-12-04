import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { TrendingUp, Award, BookOpen, Clock, Loader2, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllStudentEnrollments } from '../../services/courseService';
import { subscribeToCourseQuizzes, subscribeToQuizAttempts } from '../../services/quizService';
import { subscribeToCourseAssignments, subscribeToAssignmentSubmissions } from '../../services/assignmentService';

const MyProgressPage = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [quizStats, setQuizStats] = useState({ total: 0, completed: 0, avgScore: 0 });
    const [assignmentStats, setAssignmentStats] = useState({ total: 0, submitted: 0, avgScore: 0 });

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        let unsubscribes = [];

        const fetchProgressData = async () => {
            try {
                setLoading(false);

                // Get enrolled courses
                const enrollments = await getAllStudentEnrollments(currentUser.uid);
                const courses = enrollments.map(e => ({
                    id: e.courseId,
                    name: e.courseData.name,
                    professor: e.courseData.professor,
                    progress: e.enrollmentData.progress || 0,
                    color: e.courseData.color || 'blue',
                    ...e.courseData
                }));
                setEnrolledCourses(courses);

                // Track all quizzes and assignments
                let allQuizzes = [];
                let allAssignments = [];
                let quizAttempts = [];
                let assignmentSubmissions = [];

                // For each course, subscribe to quizzes and assignments
                for (const course of courses) {
                    // Subscribe to quizzes
                    const unsubQuiz = subscribeToCourseQuizzes(course.id, (courseQuizzes) => {
                        allQuizzes = allQuizzes.filter(q => q.courseId !== course.id);
                        allQuizzes.push(...courseQuizzes.map(q => ({ ...q, courseId: course.id })));

                        // For each quiz, get attempts
                        courseQuizzes.forEach(quiz => {
                            const unsubAttempt = subscribeToQuizAttempts(course.id, quiz.id, currentUser.uid, (attempts) => {
                                quizAttempts = quizAttempts.filter(a => a.quizId !== quiz.id);
                                quizAttempts.push(...attempts.map(a => ({ ...a, quizId: quiz.id, courseId: course.id })));
                                updateQuizStats(allQuizzes, quizAttempts);
                            });
                            unsubscribes.push(unsubAttempt);
                        });
                    });
                    unsubscribes.push(unsubQuiz);

                    // Subscribe to assignments
                    const unsubAssignment = subscribeToCourseAssignments(course.id, (courseAssignments) => {
                        allAssignments = allAssignments.filter(a => a.courseId !== course.id);
                        allAssignments.push(...courseAssignments.map(a => ({ ...a, courseId: course.id })));

                        // For each assignment, get submissions
                        courseAssignments.forEach(assignment => {
                            const unsubSubmission = subscribeToAssignmentSubmissions(course.id, assignment.id, currentUser.uid, (submissions) => {
                                assignmentSubmissions = assignmentSubmissions.filter(s => s.assignmentId !== assignment.id);
                                assignmentSubmissions.push(...submissions.map(s => ({ ...s, assignmentId: assignment.id, courseId: course.id })));
                                updateAssignmentStats(allAssignments, assignmentSubmissions);
                            });
                            unsubscribes.push(unsubSubmission);
                        });
                    });
                    unsubscribes.push(unsubAssignment);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching progress data:", error);
                setLoading(false);
            }
        };

        const updateQuizStats = (quizzes, attempts) => {
            const totalQuizzes = quizzes.length;
            const completedQuizzes = new Set(attempts.map(a => a.quizId)).size;
            const avgScore = attempts.length > 0
                ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
                : 0;

            setQuizStats({ total: totalQuizzes, completed: completedQuizzes, avgScore });
        };

        const updateAssignmentStats = (assignments, submissions) => {
            const totalAssignments = assignments.length;
            const submittedAssignments = new Set(submissions.map(s => s.assignmentId)).size;
            const scoredSubmissions = submissions.filter(s => s.score !== null && s.score !== undefined);
            const avgScore = scoredSubmissions.length > 0
                ? Math.round(scoredSubmissions.reduce((sum, s) => sum + s.score, 0) / scoredSubmissions.length)
                : 0;

            setAssignmentStats({ total: totalAssignments, submitted: submittedAssignments, avgScore });
        };

        fetchProgressData();

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [currentUser]);

    // Calculate overall course completion
    const overallProgress = enrolledCourses.length > 0
        ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
        : 0;

    const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;

    const stats = [
        { label: 'Overall Progress', value: `${overallProgress}%`, icon: TrendingUp, color: 'blue' },
        { label: 'Courses Enrolled', value: enrolledCourses.length.toString(), icon: BookOpen, color: 'green' },
        { label: 'Quizzes Completed', value: `${quizStats.completed}/${quizStats.total}`, icon: Target, color: 'purple' },
        { label: 'Assignments Submitted', value: `${assignmentStats.submitted}/${assignmentStats.total}`, icon: CheckCircle, color: 'orange' }
    ];

    const getColorClasses = (color) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-600';
            case 'green':
                return 'bg-green-600';
            case 'purple':
                return 'bg-purple-600';
            case 'orange':
                return 'bg-orange-600';
            default:
                return 'bg-blue-600';
        }
    };

    const getIconBgClasses = (color) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-100';
            case 'green':
                return 'bg-green-100';
            case 'purple':
                return 'bg-purple-100';
            case 'orange':
                return 'bg-orange-100';
            default:
                return 'bg-blue-100';
        }
    };

    const getIconTextClasses = (color) => {
        switch (color) {
            case 'blue':
                return 'text-blue-600';
            case 'green':
                return 'text-green-600';
            case 'purple':
                return 'text-purple-600';
            case 'orange':
                return 'text-orange-600';
            default:
                return 'text-blue-600';
        }
    };

    // Loading state removed - always show content

    return (
        <StudentLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Track your academic performance</h1>
                </div>

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
            </div>
        </StudentLayout>
    );
};

export default MyProgressPage;
