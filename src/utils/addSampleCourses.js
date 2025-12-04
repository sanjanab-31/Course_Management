// Sample script to add courses to Firebase
// Run this once to populate the database with sample courses

import { db } from './config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const sampleCourses = [
    {
        name: 'Data Structures & Algorithms',
        code: 'CS301',
        professor: 'Prof. Nishant Kumar',
        duration: '12 weeks',
        totalLectures: 45,
        rating: 4.8,
        color: 'blue',
        description: 'Learn fundamental data structures and algorithms',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    },
    {
        name: 'Database Management Systems',
        code: 'CS302',
        professor: 'Dr. Deepak Sharma',
        duration: '10 weeks',
        totalLectures: 40,
        rating: 4.6,
        color: 'green',
        description: 'Master database design and SQL',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    },
    {
        name: 'Operating Systems',
        code: 'CS303',
        professor: 'Prof. Satyam Singh',
        duration: '8 weeks',
        totalLectures: 35,
        rating: 4.9,
        color: 'purple',
        description: 'Understanding OS concepts and implementation',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    },
    {
        name: 'Machine Learning',
        code: 'CS401',
        professor: 'Dr. Priya Sharma',
        duration: '14 weeks',
        totalLectures: 50,
        rating: 4.7,
        color: 'blue',
        description: 'Introduction to machine learning algorithms',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    },
    {
        name: 'Web Development',
        code: 'CS304',
        professor: 'Prof. Amit Kumar',
        duration: '12 weeks',
        totalLectures: 40,
        rating: 4.9,
        color: 'green',
        description: 'Full-stack web development with modern frameworks',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    },
    {
        name: 'Artificial Intelligence',
        code: 'CS402',
        professor: 'Dr. Sarah Lee',
        duration: '16 weeks',
        totalLectures: 45,
        rating: 4.8,
        color: 'purple',
        description: 'Explore AI concepts and applications',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }
];

export const addSampleCourses = async () => {
    try {
        const coursesRef = collection(db, 'courses');

        for (const course of sampleCourses) {
            await addDoc(coursesRef, course);
            console.log(`Added course: ${course.name}`);
        }

        console.log('All sample courses added successfully!');
    } catch (error) {
        console.error('Error adding sample courses:', error);
    }
};

// Uncomment the line below and run this file to add sample courses
// addSampleCourses();
