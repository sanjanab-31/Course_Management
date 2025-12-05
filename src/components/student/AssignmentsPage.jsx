import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import { Calendar, Clock, Download, CheckCircle2, Loader2, AlertCircle, FileText, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsApi, assignmentsApi } from '../../services/api';

const AssignmentsPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('pending');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null);
    const [error, setError] = useState(null);

    // Submission Modal State
    const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [driveLink, setDriveLink] = useState('');

    // Fetch assignments from enrolled courses
    useEffect(() => {
        fetchAssignments();
    }, [currentUser]);

    const fetchAssignments = async () => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Get student's enrollments
            const enrollments = await enrollmentsApi.getByUserId(currentUser.uid);

            if (enrollments.length === 0) {
                setAssignments([]);
                setLoading(false);
                return;
            }

            // Get student's submissions
            let mySubmissions = [];
            try {
                mySubmissions = await assignmentsApi.getMySubmissions(currentUser.uid);
            } catch (err) {
                console.error('Error fetching submissions:', err);
            }

            // Fetch assignments for all enrolled courses
            const allAssignments = [];
            await Promise.all(
                enrollments.map(async (enrollment) => {
                    try {
                        const courseAssignments = await assignmentsApi.getByCourse(enrollment.courseId);

                        courseAssignments.forEach(assignment => {
                            const assignmentId = assignment._id || assignment.id;
                            const submission = mySubmissions.find(s => s.assignmentId === assignmentId);

                            allAssignments.push({
                                ...assignment,
                                id: assignmentId,
                                courseId: enrollment.courseId,
                                courseName: enrollment.courseData?.title || 'Unknown Course',
                                professor: enrollment.courseData?.instructor || 'Unknown',
                                status: submission ? 'submitted' : 'pending',
                                submittedDate: submission ? new Date(submission.submittedAt).toLocaleDateString() : null,
                                score: submission ? submission.grade : null,
                                points: assignment.maxScore || 100,
                                dueDate: assignment.dueDate
                                    ? new Date(assignment.dueDate).toLocaleDateString()
                                    : 'No due date'
                            });
                        });
                    } catch (err) {
                        console.error(`Error fetching assignments for course ${enrollment.courseId}:`, err);
                    }
                })
            );

            setAssignments(allAssignments);
            setError(null);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const pendingAssignments = assignments.filter(a => a.status === 'pending');
    const submittedAssignments = assignments.filter(a => a.status === 'submitted');

    const getAssignmentsByTab = () => {
        switch (activeTab) {
            case 'pending':
                return pendingAssignments;
            case 'submitted':
                return submittedAssignments;
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
        { id: 'submitted', label: `Submitted (${submittedAssignments.length})` }
    ];

    const openSubmissionModal = (assignment) => {
        setSelectedAssignment(assignment);
        setDriveLink('');
        setSubmissionModalOpen(true);
    };

    const handleSubmitAssignment = async (e) => {
        e.preventDefault();

        if (!driveLink.trim()) {
            alert("Drive link is required!");
            return;
        }

        try {
            setSubmitting(selectedAssignment.id);
            await assignmentsApi.submit(selectedAssignment.courseId, selectedAssignment.id, {
                userId: currentUser.uid,
                content: "Assignment submission via Drive",
                driveLink: driveLink,
                attachments: []
            });

            // Close modal and refresh
            setSubmissionModalOpen(false);
            await fetchAssignments();
            alert("Assignment submitted successfully!");
        } catch (error) {
            console.error("Error submitting assignment:", error);
            alert("Failed to submit assignment");
        } finally {
            setSubmitting(null);
        }
    };

    return (
        <StudentLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                        <p className="text-gray-600 mt-1">Track and submit your assignments</p>
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

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                        <span className="text-gray-600">Loading assignments...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        {error}
                    </div>
                )}

                {/* Content */}
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
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Assignment Cards */}
                        <div className="space-y-4">
                            {getAssignmentsByTab().length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No {activeTab} assignments found.</p>
                                    {activeTab === 'pending' && (
                                        <p className="text-sm text-gray-400 mt-1">
                                            Assignments created by your teachers will appear here
                                        </p>
                                    )}
                                </div>
                            ) : (
                                getAssignmentsByTab().map((assignment) => (
                                    <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        {/* Title */}
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
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
                                            {activeTab === 'submitted' && assignment.submittedDate && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    <span>Submitted: {assignment.submittedDate}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <span>Points: {assignment.points}</span>
                                                {activeTab === 'submitted' && assignment.score !== null && (
                                                    <span className="ml-1 text-green-600 font-medium">
                                                        (Scored: {assignment.score})
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center space-x-4">
                                            {activeTab === 'pending' ? (
                                                <button
                                                    onClick={() => openSubmissionModal(assignment)}
                                                    disabled={submitting === assignment.id}
                                                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {submitting === assignment.id ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        'Submit Assignment'
                                                    )}
                                                </button>
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
                    </>
                )}
            </div>

            {/* Submission Modal */}
            {submissionModalOpen && selectedAssignment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Submit Assignment</h2>
                            <button
                                onClick={() => setSubmissionModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">{selectedAssignment.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Please provide a Google Drive link to your assignment submission.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Google Drive Link *
                                </label>
                                <input
                                    type="url"
                                    value={driveLink}
                                    onChange={(e) => setDriveLink(e.target.value)}
                                    required
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setSubmissionModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting === selectedAssignment.id}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting === selectedAssignment.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
};

export default AssignmentsPage;
