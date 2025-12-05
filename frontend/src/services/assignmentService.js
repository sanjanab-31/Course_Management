import { assignmentsApi } from './api';

/**
 * Get all assignments for a specific course
 */
export const getAssignmentsForCourse = async (courseId) => {
    try {
        return await assignmentsApi.getByCourse(courseId);
    } catch (error) {
        console.error(`Error fetching assignments for course ${courseId}:`, error);
        throw error;
    }
};

/**
 * Subscribe to assignments for a specific course
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToCourseAssignments = (courseId, callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const assignments = await getAssignmentsForCourse(courseId);
            callback(assignments);
        } catch (error) {
            console.error(`Error subscribing to assignments for course ${courseId}:`, error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};

/**
 * Submit an assignment
 */
export const submitAssignment = async (courseId, assignmentId, userId, submissionData) => {
    try {
        return await assignmentsApi.submit(courseId, assignmentId, {
            userId,
            ...submissionData
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        throw error;
    }
};

/**
 * Get student's submissions for a specific assignment
 */
export const getStudentAssignmentSubmissions = async (courseId, assignmentId, userId) => {
    try {
        // Note: This endpoint may need to be added to the backend API
        console.warn('getStudentAssignmentSubmissions: Backend endpoint may need to be implemented');
        // TODO: Add endpoint to backend if needed
        return [];
    } catch (error) {
        console.error('Error fetching assignment submissions:', error);
        throw error;
    }
};

/**
 * Subscribe to student's submissions for a specific assignment
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToAssignmentSubmissions = (courseId, assignmentId, userId, callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const submissions = await getStudentAssignmentSubmissions(courseId, assignmentId, userId);
            callback(submissions);
        } catch (error) {
            console.error('Error subscribing to assignment submissions:', error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};
