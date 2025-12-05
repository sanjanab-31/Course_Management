// Sample script to add courses to MongoDB via API
// Run this once to populate the database with sample courses

import { coursesApi } from '../services/api';

const sampleCourses = [
    {
        title: 'Data Structures & Algorithms',
        code: 'CS301',
        instructor: 'Prof. Nishant Kumar',
        instructorId: 'teacher@gmail.com', // Default teacher ID
        category: 'Computer Science',
        duration: '12 weeks',
        totalLectures: 45,
        rating: 4.8,
        description: 'Learn fundamental data structures and algorithms',
        level: 'Intermediate'
    },
    {
        title: 'Database Management Systems',
        code: 'CS302',
        instructor: 'Dr. Deepak Sharma',
        instructorId: 'teacher@gmail.com',
        category: 'Computer Science',
        duration: '10 weeks',
        totalLectures: 40,
        rating: 4.6,
        description: 'Master database design and SQL',
        level: 'Intermediate'
    },
    {
        title: 'Operating Systems',
        code: 'CS303',
        instructor: 'Prof. Satyam Singh',
        instructorId: 'teacher@gmail.com',
        category: 'Computer Science',
        duration: '8 weeks',
        totalLectures: 35,
        rating: 4.9,
        description: 'Understanding OS concepts and implementation',
        level: 'Advanced'
    },
    {
        title: 'Machine Learning',
        code: 'CS401',
        instructor: 'Dr. Priya Sharma',
        instructorId: 'teacher@gmail.com',
        category: 'Computer Science',
        duration: '14 weeks',
        totalLectures: 50,
        rating: 4.7,
        description: 'Introduction to machine learning algorithms',
        level: 'Advanced'
    },
    {
        title: 'Web Development',
        code: 'CS304',
        instructor: 'Prof. Amit Kumar',
        instructorId: 'teacher@gmail.com',
        category: 'Computer Science',
        duration: '12 weeks',
        totalLectures: 40,
        rating: 4.9,
        description: 'Full-stack web development with modern frameworks',
        level: 'Beginner'
    },
    {
        title: 'Artificial Intelligence',
        code: 'CS402',
        instructor: 'Dr. Sarah Lee',
        instructorId: 'teacher@gmail.com',
        category: 'Computer Science',
        duration: '16 weeks',
        totalLectures: 45,
        rating: 4.8,
        description: 'Explore AI concepts and applications',
        level: 'Advanced'
    }
];

export const addSampleCourses = async () => {
    try {
        for (const course of sampleCourses) {
            await coursesApi.create(course);
            console.log(`Added course: ${course.title}`);
        }

        console.log('All sample courses added successfully!');
    } catch (error) {
        console.error('Error adding sample courses:', error);
    }
};

// Uncomment the line below and run this file to add sample courses
// addSampleCourses();
