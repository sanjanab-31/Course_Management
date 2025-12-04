import { db } from '../config/firebase';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    addDoc
} from 'firebase/firestore';

/**
 * Get all assignments for a specific course
 */
export const getAssignmentsForCourse = async (courseId) => {
    try {
        const assignmentsRef = collection(db, 'courses', courseId, 'assignments');
        const snapshot = await getDocs(assignmentsRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            courseId,
            ...doc.data()
        }));
    } catch (error) {
        console.error(`Error fetching assignments for course ${courseId}:`, error);
        throw error;
    }
};

/**
 * Subscribe to assignments for a specific course
 */
export const subscribeToCourseAssignments = (courseId, callback) => {
    const assignmentsRef = collection(db, 'courses', courseId, 'assignments');

    return onSnapshot(assignmentsRef, (snapshot) => {
        const assignments = snapshot.docs.map(doc => ({
            id: doc.id,
            courseId,
            ...doc.data()
        }));
        callback(assignments);
    }, (error) => {
        console.error(`Error subscribing to assignments for course ${courseId}:`, error);
    });
};

/**
 * Submit an assignment
 */
export const submitAssignment = async (courseId, assignmentId, userId, submissionData) => {
    try {
        // 1. Save the submission in the assignment's submissions subcollection
        const submissionRef = collection(db, 'courses', courseId, 'assignments', assignmentId, 'submissions');

        // Check if a submission already exists for this user (optional, but good practice to prevent duplicates if only one submission allowed)
        // For now, we'll just add a new one, allowing multiple submissions (e.g. revisions)

        await addDoc(submissionRef, {
            userId,
            ...submissionData,
            submittedAt: serverTimestamp(),
            status: 'submitted' // or 'graded' later
        });

        // 2. Update the student's enrollment data to reflect the submission count or status
        // This is optional depending on how we want to track progress

        return true;
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
        const submissionsRef = collection(db, 'courses', courseId, 'assignments', assignmentId, 'submissions');
        const q = query(submissionsRef, where('userId', '==', userId), orderBy('submittedAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching assignment submissions:', error);
        throw error;
    }
};

/**
 * Subscribe to student's submissions for a specific assignment
 */
export const subscribeToAssignmentSubmissions = (courseId, assignmentId, userId, callback) => {
    const submissionsRef = collection(db, 'courses', courseId, 'assignments', assignmentId, 'submissions');
    const q = query(submissionsRef, where('userId', '==', userId), orderBy('submittedAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const submissions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(submissions);
    }, (error) => {
        console.error('Error subscribing to assignment submissions:', error);
    });
};
