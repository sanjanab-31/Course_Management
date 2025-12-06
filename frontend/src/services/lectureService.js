import { apiCall } from './api';

const API_BASE_URL = 'https://course-management-b.onrender.com/api';

/**
 * Get all lectures for a course
 */
export const getAllLectures = async (courseId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lectures`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch lectures');
        }

        return data;
    } catch (error) {
        console.error('Error fetching lectures:', error);
        throw error;
    }
};

/**
 * Create a new lecture (Teacher)
 */
export const createLecture = async (courseId, lectureData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lectures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lectureData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create lecture');
        }

        return data;
    } catch (error) {
        console.error('Error creating lecture:', error);
        throw error;
    }
};

/**
 * Update a lecture (Teacher)
 */
export const updateLecture = async (courseId, lectureId, lectureData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lectures/${lectureId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lectureData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update lecture');
        }

        return data;
    } catch (error) {
        console.error('Error updating lecture:', error);
        throw error;
    }
};

/**
 * Delete a lecture (Teacher)
 */
export const deleteLecture = async (courseId, lectureId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lectures/${lectureId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete lecture');
        }

        return data;
    } catch (error) {
        console.error('Error deleting lecture:', error);
        throw error;
    }
};

/**
 * Mark a lecture as completed (Student)
 */
export const markLectureComplete = async (courseId, lectureId, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lectures/${lectureId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to mark lecture as complete');
        }

        return data;
    } catch (error) {
        console.error('Error marking lecture as complete:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time lecture updates for a course
 * Note: Real-time subscriptions are not available with REST API
 * This is a placeholder that polls the API
 */
export const subscribeToLectureUpdates = (courseId, callback) => {
    const pollInterval = setInterval(async () => {
        try {
            const lectures = await getAllLectures(courseId);
            callback(lectures);
        } catch (error) {
            console.error('Error in lectures subscription:', error);
        }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
};
