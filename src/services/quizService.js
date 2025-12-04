import { quizzesApi } from './api';

/**
 * Get all quizzes for a specific course
 */
export const getQuizzesForCourse = async (courseId) => {
    try {
        return await quizzesApi.getByCourse(courseId);
    } catch (error) {
        console.error(`Error fetching quizzes for course ${courseId}:`, error);
        throw error;
    }
};

/**
 * Subscribe to quizzes for a specific course
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToCourseQuizzes = (courseId, callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const quizzes = await getQuizzesForCourse(courseId);
            callback(quizzes);
        } catch (error) {
            console.error(`Error subscribing to quizzes for course ${courseId}:`, error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};

/**
 * Submit a quiz attempt
 */
export const submitQuizAttempt = async (courseId, quizId, userId, attemptData) => {
    try {
        return await quizzesApi.submitAttempt(courseId, quizId, {
            userId,
            ...attemptData
        });
    } catch (error) {
        console.error('Error submitting quiz attempt:', error);
        throw error;
    }
};

/**
 * Get student's attempts for a specific quiz
 */
export const getStudentQuizAttempts = async (courseId, quizId, userId) => {
    try {
        // Note: This endpoint may need to be added to the backend API
        console.warn('getStudentQuizAttempts: Backend endpoint may need to be implemented');
        // TODO: Add endpoint to backend if needed
        return [];
    } catch (error) {
        console.error('Error fetching quiz attempts:', error);
        throw error;
    }
};

/**
 * Subscribe to student's attempts for a specific quiz
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToQuizAttempts = (courseId, quizId, userId, callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const attempts = await getStudentQuizAttempts(courseId, quizId, userId);
            callback(attempts);
        } catch (error) {
            console.error('Error subscribing to quiz attempts:', error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};
