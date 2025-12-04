import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { Calendar, Clock, Download, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllStudentEnrollments } from '../../services/courseService';
import { subscribeToCourseAssignments, subscribeToAssignmentSubmissions, submitAssignment } from '../../services/assignmentService';

const AssignmentsPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('pending');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(null);



    // Fetch assignments and submissions
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        let assignmentUnsubscribes = [];
        let submissionUnsubscribes = [];

        const fetchEnrollmentsAndSetupListeners = async () => {
            try {
                setLoading(false);
                const enrollments = await getAllStudentEnrollments(currentUser.uid);
                const courses = enrollments.map(e => ({
                    id: e.courseId,
                    name: e.courseData.name,
                    professor: e.courseData.professor,
                    ...e.courseData
                }));

                if (courses.length === 0) {
                    setLoading(false);
                    return;
                }

                courses.forEach(course => {
                    const unsubAssignment = subscribeToCourseAssignments(course.id, (courseAssignments) => {
                        setAssignments(prevAssignments => {
                            // Remove existing assignments for this course
                            const otherAssignments = prevAssignments.filter(a => a.courseId !== course.id);

                            // Process new assignments
                            const newAssignments = courseAssignments.map(assignment => ({
                                ...assignment,
                                courseName: course.name,
                                professor: course.professor,
                                status: 'pending', // Default
                                submittedDate: null,
                                score: null,
                                requirements: assignment.requirements || []
                            }));

                            // Setup submission listeners
                            newAssignments.forEach(assignment => {
                                const unsubSubmission = subscribeToAssignmentSubmissions(course.id, assignment.id, currentUser.uid, (submissions) => {
                                    setAssignments(currentAssignments => {
                                        return currentAssignments.map(a => {
                                            if (a.id === assignment.id) {
                                                const lastSubmission = submissions.length > 0 ? submissions[0] : null;
                                                return {
                                                    ...a,
                                                    status: submissions.length > 0 ? 'submitted' : 'pending',
                                                    submittedDate: lastSubmission ? new Date(lastSubmission.submittedAt?.toDate()).toLocaleString() : null,
                                                    score: lastSubmission?.score || null
                                                };
                                            }
                                            return a;
                                        });
                                    });
                                });
                                submissionUnsubscribes.push(unsubSubmission);
                            });

                            return [...otherAssignments, ...newAssignments];
                        });
                    });
                    assignmentUnsubscribes.push(unsubAssignment);
                });

                setLoading(false);
            } catch (error) {
                console.error("Error setting up assignment listeners:", error);
                setLoading(false);
            }
        };

        fetchEnrollmentsAndSetupListeners();

        return () => {
            assignmentUnsubscribes.forEach(unsub => unsub());
            submissionUnsubscribes.forEach(unsub => unsub());
        };
    }, [currentUser]);

    const pendingAssignments = assignments.filter(a => a.status === 'pending');
    const submittedAssignments = assignments.filter(a => a.status === 'submitted');

    const getAssignmentsByTab = () => {
        switch (activeTab) {
            case 'pending':
                return pendingAssignments;
            case 'submitted':
                return submittedAssignments;
            case 'calendar':
                return [];
            default:
                return pendingAssignments;
        }
    };

    // Calculate stats
    const pendingCount = pendingAssignments.length;
    const avgScore = submittedAssignments.length > 0
        ? Math.round((submittedAssignments.reduce((sum, a) => sum + (a.score ? (a.score / a.points * 100) : 0), 0)) / submittedAssignments.length)
        : 0;

    const tabs = [
        { id: 'pending', label: `Pending (${pendingAssignments.length})` },
        { id: 'submitted', label: `Submitted (${submittedAssignments.length})` },
        { id: 'calendar', label: 'Calendar View' }
    ];

    const handleSubmit = async (assignment) => {
        if (!confirm(`Are you sure you want to submit "${assignment.title}"? This is a demo submission.`)) return;

        try {
            setSubmitting(assignment.id);
            // Create a dummy submission
            await submitAssignment(assignment.courseId, assignment.id, currentUser.uid, {
                content: "Demo submission content",
                attachments: [],
                score: null // Not graded yet
            });
            // Notification could be added here
        } catch (error) {
            console.error("Error submitting assignment:", error);
            alert("Failed to submit assignment");
        } finally {
            setSubmitting(null);
        }
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Track and submit your assignments</h1>
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                            <p className="text-sm text-gray-600">Pending</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">{avgScore}%</p>
                            <p className="text-sm text-gray-600">Avg Score</p>
                        </div>
                    </div>
                </div>

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

                {/* Assignment Cards */}
                {activeTab === 'calendar' ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <p className="text-gray-500">Calendar view is under development</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {getAssignmentsByTab().length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No {activeTab} assignments found.</p>
                                {activeTab === 'pending' && (
                                    <p className="text-sm text-gray-400 mt-1">Check back later for new assignments from your teachers.</p>
                                )}
                            </div>
                        ) : (
                            getAssignmentsByTab().map((assignment) => (
                                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6">
                                    {/* Title and Priority Badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                                            {assignment.priority === 'high' && (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                    high priority
                                                </span>
                                            )}
                                            {assignment.priority === 'medium' && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                                    medium priority
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Course and Professor */}
                                    <p className="text-sm text-gray-600 mb-3">
                                        <span className="font-medium">{assignment.courseName}</span> - {assignment.professor}
                                    </p>

                                    {/* Description */}
                                    <p className="text-sm text-gray-700 mb-4">{assignment.description}</p>

                                    {/* Metadata Row */}
                                    <div className="flex items-center space-x-6 mb-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Due: {assignment.dueDate}</span>
                                        </div>
                                        {activeTab === 'pending' && assignment.timeLeft && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span>Time left: {assignment.timeLeft}</span>
                                            </div>
                                        )}
                                        {activeTab === 'submitted' && assignment.submittedDate && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                <span>Submitted: {assignment.submittedDate}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Points: {assignment.points}</span>
                                            {activeTab === 'submitted' && assignment.score !== null && (
                                                <span className="ml-1 text-green-600 font-medium">
                                                    (Scored: {assignment.score})
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    {assignment.requirements && assignment.requirements.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                                            <div className="space-y-1">
                                                {assignment.requirements.map((req, index) => (
                                                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                        <span>{req}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-4">
                                        {activeTab === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleSubmit(assignment)}
                                                    disabled={submitting === assignment.id}
                                                    className="px-5 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {submitting === assignment.id ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </button>
                                                <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                                                    <Download className="w-4 h-4" />
                                                    <span>Download Instructions</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                                View Submission
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default AssignmentsPage;
