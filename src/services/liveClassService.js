import { liveClassesApi } from './api';

/**
 * Get all live classes from API
 */
export const getAllLiveClasses = async () => {
    try {
        // Note: This requires getting all courses first, then their live classes
        // For now, return empty array or implement a general endpoint
        console.warn('getAllLiveClasses: May need backend endpoint for all live classes');
        return [];
    } catch (error) {
        console.error('Error fetching live classes:', error);
        throw error;
    }
};

/**
 * Get live classes for a specific course
 */
export const getLiveClassesByCourseId = async (courseId) => {
    try {
        return await liveClassesApi.getByCourse(courseId);
    } catch (error) {
        console.error('Error fetching classes for course:', error);
        throw error;
    }
};

/**
 * Get live classes for multiple enrolled courses
 */
export const getLiveClassesForEnrolledCourses = async (enrolledCourseIds) => {
    try {
        if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
            return [];
        }

        const allClasses = [];
        for (const courseId of enrolledCourseIds) {
            try {
                const classes = await getLiveClassesByCourseId(courseId);
                allClasses.push(...classes);
            } catch (error) {
                console.error(`Error fetching classes for course ${courseId}:`, error);
            }
        }

        // Sort all classes by scheduled time
        allClasses.sort((a, b) => {
            const dateA = new Date(a.scheduledAt);
            const dateB = new Date(b.scheduledAt);
            return dateB - dateA;
        });

        return allClasses;
    } catch (error) {
        console.error('Error fetching classes for enrolled courses:', error);
        throw error;
    }
};

/**
 * Get today's classes for enrolled courses
 */
export const getTodayClasses = async (enrolledCourseIds) => {
    try {
        if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
            return [];
        }

        const allClasses = await getLiveClassesForEnrolledCourses(enrolledCourseIds);

        // Filter for today's classes
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return allClasses.filter(classItem => {
            const classDate = new Date(classItem.scheduledAt);
            return classDate >= today && classDate < tomorrow;
        });
    } catch (error) {
        console.error('Error fetching today\'s classes:', error);
        throw error;
    }
};

/**
 * Get upcoming classes for enrolled courses (future classes, not today)
 */
export const getUpcomingClasses = async (enrolledCourseIds) => {
    try {
        if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
            return [];
        }

        const allClasses = await getLiveClassesForEnrolledCourses(enrolledCourseIds);

        // Filter for upcoming classes (tomorrow onwards)
        const tomorrow = new Date();
        tomorrow.setHours(0, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return allClasses.filter(classItem => {
            const classDate = new Date(classItem.scheduledAt);
            return classDate >= tomorrow && classItem.status !== 'completed';
        });
    } catch (error) {
        console.error('Error fetching upcoming classes:', error);
        throw error;
    }
};

/**
 * Get recorded classes for enrolled courses
 */
export const getRecordedClasses = async (enrolledCourseIds) => {
    try {
        if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
            return [];
        }

        const allClasses = await getLiveClassesForEnrolledCourses(enrolledCourseIds);

        // Filter for completed classes with recordings
        return allClasses.filter(classItem => {
            return classItem.status === 'completed' && classItem.recordingUrl;
        });
    } catch (error) {
        console.error('Error fetching recorded classes:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time updates for live classes
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToLiveClassesUpdates = (enrolledCourseIds, callback) => {
    if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
        callback([]);
        return () => {}; // Return empty unsubscribe function
    }

    const pollInterval = setInterval(async () => {
        try {
            const classes = await getLiveClassesForEnrolledCourses(enrolledCourseIds);
            callback(classes);
        } catch (error) {
            console.error('Error in live classes subscription:', error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};

/**
 * Format class time for display
 */
export const formatClassTime = (startTime, endTime) => {
    try {
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : null;

        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);
        const endTimeStr = end ? end.toLocaleTimeString('en-US', timeOptions) : '';

        return endTimeStr ? `${startTimeStr} - ${endTimeStr}` : startTimeStr;
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'Time not available';
    }
};

/**
 * Format class date for display
 */
export const formatClassDate = (startTime) => {
    try {
        const date = new Date(startTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const classDate = new Date(date);
        classDate.setHours(0, 0, 0, 0);

        if (classDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (classDate.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Date not available';
    }
};
