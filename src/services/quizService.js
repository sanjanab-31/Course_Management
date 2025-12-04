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
 * Get all quizzes for a specific course
 */
export const getQuizzesForCourse = async (courseId) => {
    try {
        const quizzesRef = collection(db, 'courses', courseId, 'quizzes');
        const snapshot = await getDocs(quizzesRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            courseId,
            ...doc.data()
        }));
    } catch (error) {
        console.error(`Error fetching quizzes for course ${courseId}:`, error);
        throw error;
    }
};

/**
 * Subscribe to quizzes for a specific course
 */
export const subscribeToCourseQuizzes = (courseId, callback) => {
    const quizzesRef = collection(db, 'courses', courseId, 'quizzes');

    return onSnapshot(quizzesRef, (snapshot) => {
        const quizzes = snapshot.docs.map(doc => ({
            id: doc.id,
            courseId,
            ...doc.data()
        }));
        callback(quizzes);
    }, (error) => {
        console.error(`Error subscribing to quizzes for course ${courseId}:`, error);
    });
};

/**
 * Submit a quiz attempt
 */
export const submitQuizAttempt = async (courseId, quizId, userId, attemptData) => {
    try {
        // 1. Save the attempt in the quiz's attempts subcollection
        const attemptRef = collection(db, 'courses', courseId, 'quizzes', quizId, 'attempts');
        await addDoc(attemptRef, {
            userId,
            ...attemptData,
            submittedAt: serverTimestamp()
        });

        // 2. Update the student's enrollment data to reflect the completed quiz
        // This is optional depending on how we want to track progress, but good for redundancy
        const enrollmentRef = doc(db, 'courses', courseId, 'enrollments', userId);
        // We might want to update a 'completedQuizzes' array or count in the enrollment
        // For now, we'll just log it or leave it to a cloud function

        return true;
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
        const attemptsRef = collection(db, 'courses', courseId, 'quizzes', quizId, 'attempts');
        const q = query(attemptsRef, where('userId', '==', userId), orderBy('submittedAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching quiz attempts:', error);
        throw error;
    }
};

/**
 * Subscribe to student's attempts for a specific quiz
 */
export const subscribeToQuizAttempts = (courseId, quizId, userId, callback) => {
    const attemptsRef = collection(db, 'courses', courseId, 'quizzes', quizId, 'attempts');
    const q = query(attemptsRef, where('userId', '==', userId), orderBy('submittedAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const attempts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(attempts);
    }, (error) => {
        console.error('Error subscribing to quiz attempts:', error);
    });
};
