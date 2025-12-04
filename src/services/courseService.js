import { db } from '../config/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';

/**
 * Get all courses from Firestore
 */
export const getAllCourses = async () => {
    try {
        const coursesRef = collection(db, 'courses');
        const snapshot = await getDocs(coursesRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
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
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
            return {
                id: courseSnap.id,
                ...courseSnap.data()
            };
        }
        return null;
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
        const enrollmentRef = doc(db, 'courses', courseId, 'enrollments', userId);
        const enrollmentSnap = await getDoc(enrollmentRef);

        if (enrollmentSnap.exists()) {
            return {
                id: enrollmentSnap.id,
                ...enrollmentSnap.data()
            };
        }
        return null;
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
        const coursesRef = collection(db, 'courses');
        const coursesSnap = await getDocs(coursesRef);

        const enrollments = [];

        for (const courseDoc of coursesSnap.docs) {
            const enrollmentRef = doc(db, 'courses', courseDoc.id, 'enrollments', userId);
            const enrollmentSnap = await getDoc(enrollmentRef);

            if (enrollmentSnap.exists()) {
                enrollments.push({
                    courseId: courseDoc.id,
                    courseData: courseDoc.data(),
                    enrollmentData: enrollmentSnap.data()
                });
            }
        }

        return enrollments;
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
        const enrollmentRef = doc(db, 'courses', courseId, 'enrollments', userId);

        const enrollmentData = {
            userId,
            progress: 0,
            completedLectures: 0,
            status: 'enrolled',
            enrolledAt: serverTimestamp(),
            completedAt: null,
            nextClass: null,
            assignments: 0,
            quizzes: 0
        };

        await setDoc(enrollmentRef, enrollmentData);
        return enrollmentData;
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
        const enrollmentRef = doc(db, 'courses', courseId, 'enrollments', userId);

        await updateDoc(enrollmentRef, {
            ...progressData,
            updatedAt: serverTimestamp()
        });
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
        const enrollmentRef = doc(db, 'courses', courseId, 'enrollments', userId);

        await updateDoc(enrollmentRef, {
            status: 'completed',
            progress: 100,
            completedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error completing course:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time course updates
 */
export const subscribeToCoursesUpdates = (callback) => {
    const coursesRef = collection(db, 'courses');
    return onSnapshot(coursesRef, (snapshot) => {
        const courses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(courses);
    }, (error) => {
        console.error('Error in courses subscription:', error);
    });
};

/**
 * Subscribe to real-time enrollment updates for a student
 */
export const subscribeToStudentEnrollments = (userId, callback) => {
    const coursesRef = collection(db, 'courses');

    return onSnapshot(coursesRef, async (snapshot) => {
        const enrollments = [];

        for (const courseDoc of snapshot.docs) {
            const enrollmentRef = doc(db, 'courses', courseDoc.id, 'enrollments', userId);
            const enrollmentSnap = await getDoc(enrollmentRef);

            if (enrollmentSnap.exists()) {
                enrollments.push({
                    courseId: courseDoc.id,
                    courseData: courseDoc.data(),
                    enrollmentData: enrollmentSnap.data()
                });
            }
        }

        callback(enrollments);
    }, (error) => {
        console.error('Error in enrollments subscription:', error);
    });
};
