import { db } from '../config/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    orderBy
} from 'firebase/firestore';

/**
 * Get all study materials from Firestore
 */
export const getAllMaterials = async () => {
    try {
        const materialsRef = collection(db, 'materials');
        const q = query(materialsRef, orderBy('uploadedOn', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
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
        const materialsRef = collection(db, 'materials');
        const q = query(
            materialsRef,
            where('courseId', '==', courseId),
            orderBy('uploadedOn', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
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

        const materialsRef = collection(db, 'materials');

        // Firestore 'in' query supports up to 10 items
        // If more than 10 courses, we need to batch the queries
        const batchSize = 10;
        const batches = [];

        for (let i = 0; i < enrolledCourseIds.length; i += batchSize) {
            const batch = enrolledCourseIds.slice(i, i + batchSize);
            const q = query(
                materialsRef,
                where('courseId', 'in', batch),
                orderBy('uploadedOn', 'desc')
            );
            batches.push(getDocs(q));
        }

        const snapshots = await Promise.all(batches);
        const materials = [];

        snapshots.forEach(snapshot => {
            snapshot.docs.forEach(doc => {
                materials.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        });

        // Sort all materials by upload date
        materials.sort((a, b) => {
            const dateA = a.uploadedOn?.toDate?.() || new Date(a.uploadedOn);
            const dateB = b.uploadedOn?.toDate?.() || new Date(b.uploadedOn);
            return dateB - dateA;
        });

        return materials;
    } catch (error) {
        console.error('Error fetching materials for enrolled courses:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time updates for all materials
 */
export const subscribeToMaterialsUpdates = (callback) => {
    const materialsRef = collection(db, 'materials');
    const q = query(materialsRef, orderBy('uploadedOn', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const materials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(materials);
    }, (error) => {
        console.error('Error in materials subscription:', error);
    });
};

/**
 * Subscribe to real-time updates for enrolled courses materials
 */
export const subscribeToEnrolledMaterials = (enrolledCourseIds, callback) => {
    if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
        callback([]);
        return () => { }; // Return empty unsubscribe function
    }

    const materialsRef = collection(db, 'materials');

    // Handle batching for more than 10 courses
    const batchSize = 10;
    const unsubscribers = [];
    const materialsMap = new Map();

    const updateCallback = () => {
        const allMaterials = Array.from(materialsMap.values());
        // Sort by upload date
        allMaterials.sort((a, b) => {
            const dateA = a.uploadedOn?.toDate?.() || new Date(a.uploadedOn);
            const dateB = b.uploadedOn?.toDate?.() || new Date(b.uploadedOn);
            return dateB - dateA;
        });
        callback(allMaterials);
    };

    for (let i = 0; i < enrolledCourseIds.length; i += batchSize) {
        const batch = enrolledCourseIds.slice(i, i + batchSize);
        const q = query(
            materialsRef,
            where('courseId', 'in', batch),
            orderBy('uploadedOn', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach(doc => {
                materialsMap.set(doc.id, {
                    id: doc.id,
                    ...doc.data()
                });
            });
            updateCallback();
        }, (error) => {
            console.error('Error in enrolled materials subscription:', error);
        });

        unsubscribers.push(unsubscribe);
    }

    // Return combined unsubscribe function
    return () => {
        unsubscribers.forEach(unsub => unsub());
    };
};

/**
 * Format upload date for display
 */
export const formatUploadDate = (uploadedOn) => {
    try {
        let date;

        if (uploadedOn?.toDate) {
            // Firestore Timestamp
            date = uploadedOn.toDate();
        } else if (uploadedOn instanceof Date) {
            date = uploadedOn;
        } else if (typeof uploadedOn === 'string') {
            date = new Date(uploadedOn);
        } else {
            return 'Unknown date';
        }

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
