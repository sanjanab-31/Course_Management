import { materialsApi } from './api';

/**
 * Get all study materials from API
 */
export const getAllMaterials = async () => {
    try {
        // Note: This requires getting all courses first, then their materials
        // For now, return empty array or implement a general endpoint
        console.warn('getAllMaterials: May need backend endpoint for all materials');
        return [];
    } catch (error) {
        console.error('Error fetching materials:', error);
        throw error;
    }
};

/**
 * Get materials for a specific course
 */
export const getMaterialsByCourseId = async (courseId) => {
    try {
        return await materialsApi.getByCourse(courseId);
    } catch (error) {
        console.error('Error fetching materials for course:', error);
        throw error;
    }
};

/**
 * Get materials for multiple enrolled courses
 */
export const getMaterialsForEnrolledCourses = async (enrolledCourseIds) => {
    try {
        if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
            return [];
        }

        const allMaterials = [];
        for (const courseId of enrolledCourseIds) {
            try {
                const materials = await getMaterialsByCourseId(courseId);
                allMaterials.push(...materials);
            } catch (error) {
                console.error(`Error fetching materials for course ${courseId}:`, error);
            }
        }

        // Sort all materials by upload date
        allMaterials.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.uploadedOn);
            const dateB = new Date(b.createdAt || b.uploadedOn);
            return dateB - dateA;
        });

        return allMaterials;
    } catch (error) {
        console.error('Error fetching materials for enrolled courses:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time updates for all materials
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToMaterialsUpdates = (callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const materials = await getAllMaterials();
            callback(materials);
        } catch (error) {
            console.error('Error in materials subscription:', error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};

/**
 * Subscribe to real-time updates for enrolled courses materials
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToEnrolledMaterials = (enrolledCourseIds, callback) => {
    if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
        callback([]);
        return () => {}; // Return empty unsubscribe function
    }

    const pollInterval = setInterval(async () => {
        try {
            const materials = await getMaterialsForEnrolledCourses(enrolledCourseIds);
            callback(materials);
        } catch (error) {
            console.error('Error in enrolled materials subscription:', error);
        }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
};

/**
 * Format upload date for display
 */
export const formatUploadDate = (uploadedOn) => {
    try {
        const date = new Date(uploadedOn || uploadedOn?.createdAt);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Unknown date';
    }
};
