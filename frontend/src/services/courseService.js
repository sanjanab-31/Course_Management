import { coursesApi, enrollmentsApi } from './api';

/**
 * Get all courses from API
 */
export const getAllCourses = async () => {
    try {
        return await coursesApi.getAll();
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

/**
 * Get a specific course by ID
 */
export const getCourseById = async (courseId) => {
    try {
        return await coursesApi.getById(courseId);
    } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
    }
};

/**
 * Get student's enrollment for a specific course
 */
export const getStudentEnrollment = async (courseId, userId) => {
    try {
        const enrollments = await enrollmentsApi.getByUserId(userId);
        return enrollments.find(e => e.courseId === courseId) || null;
    } catch (error) {
        console.error('Error fetching enrollment:', error);
        throw error;
    }
};

/**
 * Get all enrollments for a student across all courses
 */
export const getAllStudentEnrollments = async (userId) => {
    try {
        return await enrollmentsApi.getByUserId(userId);
    } catch (error) {
        console.error('Error fetching student enrollments:', error);
        throw error;
    }
};

/**
 * Enroll a student in a course
 */
export const enrollInCourse = async (courseId, userId) => {
    try {
        return await enrollmentsApi.enroll(courseId, userId);
    } catch (error) {
        console.error('Error enrolling in course:', error);
        throw error;
    }
};

/**
 * Update course progress for a student
 */
export const updateCourseProgress = async (courseId, userId, progressData) => {
    try {
        // Note: This endpoint may need to be added to the backend API
        // For now, we'll use the enrollments API if it supports updates
        console.warn('updateCourseProgress: Backend endpoint may need to be implemented');
        // TODO: Add update endpoint to backend if needed
    } catch (error) {
        console.error('Error updating course progress:', error);
        throw error;
    }
};

/**
 * Mark a course as completed
 */
export const completeCourse = async (courseId, userId) => {
    try {
        // Note: This endpoint may need to be added to the backend API
        console.warn('completeCourse: Backend endpoint may need to be implemented');
        // TODO: Add complete endpoint to backend if needed
    } catch (error) {
        console.error('Error completing course:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time course updates
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToCoursesUpdates = (callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const courses = await getAllCourses();
            callback(courses);
        } catch (error) {
            console.error('Error in courses subscription:', error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};

/**
 * Subscribe to real-time enrollment updates for a student
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToStudentEnrollments = (userId, callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const enrollments = await getAllStudentEnrollments(userId);
            callback(enrollments);
        } catch (error) {
            console.error('Error in enrollments subscription:', error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};
