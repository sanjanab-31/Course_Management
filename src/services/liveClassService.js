import { db } from '../config/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    orderBy,
    Timestamp
} from 'firebase/firestore';

/**
 * Get all live classes from Firestore
 */
export const getAllLiveClasses = async () => {
    try {
        const classesRef = collection(db, 'liveClasses');
        const q = query(classesRef, orderBy('startTime', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
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
        const classesRef = collection(db, 'liveClasses');
        const q = query(
            classesRef,
            where('courseId', '==', courseId),
            orderBy('startTime', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
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

        const classesRef = collection(db, 'liveClasses');

        // Firestore 'in' query supports up to 10 items
        const batchSize = 10;
        const batches = [];

        for (let i = 0; i < enrolledCourseIds.length; i += batchSize) {
            const batch = enrolledCourseIds.slice(i, i + batchSize);
            const q = query(
                classesRef,
                where('courseId', 'in', batch),
                orderBy('startTime', 'desc')
            );
            batches.push(getDocs(q));
        }

        const snapshots = await Promise.all(batches);
        const classes = [];

        snapshots.forEach(snapshot => {
            snapshot.docs.forEach(doc => {
                classes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        });

        // Sort all classes by start time
        classes.sort((a, b) => {
            const dateA = a.startTime?.toDate?.() || new Date(a.startTime);
            const dateB = b.startTime?.toDate?.() || new Date(b.startTime);
            return dateB - dateA;
        });

        return classes;
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
            const classDate = classItem.startTime?.toDate?.() || new Date(classItem.startTime);
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
            const classDate = classItem.startTime?.toDate?.() || new Date(classItem.startTime);
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
 */
export const subscribeToLiveClassesUpdates = (enrolledCourseIds, callback) => {
    if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
        callback([]);
        return () => { }; // Return empty unsubscribe function
    }

    const classesRef = collection(db, 'liveClasses');

    // Handle batching for more than 10 courses
    const batchSize = 10;
    const unsubscribers = [];
    const classesMap = new Map();

    const updateCallback = () => {
        const allClasses = Array.from(classesMap.values());
        // Sort by start time
        allClasses.sort((a, b) => {
            const dateA = a.startTime?.toDate?.() || new Date(a.startTime);
            const dateB = b.startTime?.toDate?.() || new Date(b.startTime);
            return dateB - dateA;
        });
        callback(allClasses);
    };

    for (let i = 0; i < enrolledCourseIds.length; i += batchSize) {
        const batch = enrolledCourseIds.slice(i, i + batchSize);
        const q = query(
            classesRef,
            where('courseId', 'in', batch),
            orderBy('startTime', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach(doc => {
                classesMap.set(doc.id, {
                    id: doc.id,
                    ...doc.data()
                });
            });
            updateCallback();
        }, (error) => {
            console.error('Error in live classes subscription:', error);
        });

        unsubscribers.push(unsubscribe);
    }

    // Return combined unsubscribe function
    return () => {
        unsubscribers.forEach(unsub => unsub());
    };
};

/**
 * Format class time for display
 */
export const formatClassTime = (startTime, endTime) => {
    try {
        let start, end;

        if (startTime?.toDate) {
            start = startTime.toDate();
        } else if (startTime instanceof Date) {
            start = startTime;
        } else if (typeof startTime === 'string') {
            start = new Date(startTime);
        } else {
            return 'Time not available';
        }

        if (endTime?.toDate) {
            end = endTime.toDate();
        } else if (endTime instanceof Date) {
            end = endTime;
        } else if (typeof endTime === 'string') {
            end = new Date(endTime);
        }

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
        let date;

        if (startTime?.toDate) {
            date = startTime.toDate();
        } else if (startTime instanceof Date) {
            date = startTime;
        } else if (typeof startTime === 'string') {
            date = new Date(startTime);
        } else {
            return 'Date not available';
        }

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
