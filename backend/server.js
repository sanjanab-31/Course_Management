import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/course_management';

// Middleware
app.use(cors());
app.use(express.json());


// ==================== MONGODB MODELS ====================

// Course Schema
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    instructorId: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, default: 'Beginner' },
    duration: { type: String, default: '0 hours' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400' },
    totalLectures: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completedLectures: { type: Array, default: [] }, // Array of lecture IDs
    completedVideosCount: { type: Number, default: 0 },
    videoMarks: { type: Number, default: 0 }, // Out of 50
    assignmentMarks: { type: Number, default: 0 }, // Out of 25
    quizMarks: { type: Number, default: 0 }, // Out of 25
    totalGrade: { type: Number, default: 0 }, // Out of 100
    status: { type: String, default: 'enrolled' },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null }
});

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    maxScore: { type: Number, default: 100 },
    attachments: { type: Array, default: [] },
    status: { type: String, default: 'active' },
    submissions: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Assignment Submission Schema
const assignmentSubmissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: String, required: true },
    driveLink: { type: String, required: true }, // Google Drive link (required)
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'submitted' }, // submitted, graded
    score: { type: Number, default: null }, // Out of assignment maxScore
    feedback: { type: String, default: '' },
    gradedAt: { type: Date, default: null },
    gradedBy: { type: String, default: null }
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeLimit: { type: Number, default: 30 },
    questions: { type: Array, default: [] },
    passingScore: { type: Number, default: 60 },
    totalQuestions: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

// Quiz Attempt Schema
const quizAttemptSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: String, required: true },
    answers: { type: Array, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'failed' }
});

// Live Class Schema
const liveClassSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    meetingLink: { type: String, required: true },
    instructor: { type: String, required: true },
    status: { type: String, default: 'scheduled' },
    attendees: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Study Material Schema
const materialSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, default: 'document' },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Lecture Schema (Video Lectures)
const lectureSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    duration: { type: String, default: '0:00' }, // e.g., "15:30"
    order: { type: Number, required: true }, // Part 1, Part 2, etc.
    createdAt: { type: Date, default: Date.now }
});

// Create Models
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);
const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
const LiveClass = mongoose.model('LiveClass', liveClassSchema);
const Material = mongoose.model('Material', materialSchema);
const Lecture = mongoose.model('Lecture', lectureSchema);
import { connectDB } from "./config/db.js";
connectDB(MONGODB_URI);

// ==================== COURSES API ====================

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                error: 'Database not connected',
                details: 'MongoDB connection is not established. Please check if MongoDB is running.'
            });
        }
        const courses = await Course.find().sort({ createdAt: -1 });

        // Transform courses to include 'id' field for frontend compatibility
        const transformedCourses = courses.map(course => ({
            ...course.toObject(),
            id: course._id.toString()
        }));

        res.json(transformedCourses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
    }
});

// Get course by ID
app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({
            ...course.toObject(),
            id: course._id.toString()
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// Create a new course (Teacher)
app.post('/api/courses', async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                error: 'Database not connected',
                details: 'MongoDB connection is not established. Please check if MongoDB is running.'
            });
        }
        const { title, description, instructor, instructorId, category, level, duration, image, totalLectures } = req.body;

        const courseData = {
            title,
            description,
            instructor,
            instructorId,
            category,
            level: level || 'Beginner',
            duration: duration || '0 hours',
            image: image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
            totalLectures: totalLectures || 0,
            students: 0,
            rating: 0
        };

        const course = new Course(courseData);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Failed to create course', details: error.message });
    }
});

// Update a course (Teacher)
app.put('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
});

// Delete a course (Teacher)
app.delete('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
});

// ==================== ENROLLMENTS API ====================

// Get student enrollments
app.get('/api/enrollments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const enrollments = await Enrollment.find({ userId }).populate('courseId');

        const enrollmentData = enrollments.map(enrollment => ({
            courseId: enrollment.courseId._id.toString(),
            courseData: enrollment.courseId,
            enrollmentData: {
                userId: enrollment.userId,
                progress: enrollment.progress,
                completedLectures: enrollment.completedLectures,
                status: enrollment.status,
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt
            }
        }));

        res.json(enrollmentData);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
});

// Enroll student in course
app.post('/api/enrollments', async (req, res) => {
    try {
        const { courseId, userId } = req.body;

        // Validate required fields
        if (!courseId || !userId) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Both courseId and userId are required'
            });
        }

        // Validate courseId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                error: 'Invalid course ID',
                details: `The provided courseId "${courseId}" is not a valid MongoDB ObjectId`
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                error: 'Course not found',
                details: `No course found with ID: ${courseId}`
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ courseId, userId });
        if (existingEnrollment) {
            return res.status(400).json({
                error: 'Already enrolled in this course',
                details: `User ${userId} is already enrolled in course ${courseId}`
            });
        }

        const enrollmentData = {
            courseId,
            userId,
            progress: 0,
            completedLectures: 0,
            status: 'enrolled',
            enrolledAt: Date.now(),
            completedAt: null
        };

        const enrollment = new Enrollment(enrollmentData);
        await enrollment.save();

        // Increment student count
        await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });

        console.log(`✅ Student ${userId} enrolled in course ${courseId}`);
        res.status(201).json({ courseId, ...enrollmentData });
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({
            error: 'Failed to enroll student',
            details: error.message
        });
    }
});

// ==================== ASSIGNMENTS API ====================

// Get all assignments for a course
app.get('/api/courses/:courseId/assignments', async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await Assignment.find({ courseId }).sort({ dueDate: 1 });
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
});

// Create assignment (Teacher)
app.post('/api/courses/:courseId/assignments', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, dueDate, maxScore, attachments } = req.body;

        // Check 2-assignment limit per course
        const existingCount = await Assignment.countDocuments({ courseId });
        if (existingCount >= 2) {
            return res.status(400).json({
                error: 'Assignment limit reached',
                message: 'Maximum 2 assignments allowed per course. Please delete an existing assignment to add a new one.'
            });
        }

        const assignmentData = {
            courseId,
            title,
            description,
            dueDate: new Date(dueDate),
            maxScore: maxScore || 100,
            attachments: attachments || [],
            status: 'active',
            submissions: 0
        };

        const assignment = new Assignment(assignmentData);
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ error: 'Failed to create assignment' });
    }
});

// Submit assignment (Student)
app.post('/api/assignments/:assignmentId/submit', async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { userId, driveLink, courseId } = req.body;

        // Validate Drive link
        if (!driveLink || !driveLink.includes('drive.google.com') && !driveLink.includes('docs.google.com')) {
            return res.status(400).json({ error: 'Invalid Google Drive link' });
        }

        // Check if already submitted
        const existing = await AssignmentSubmission.findOne({ assignmentId, userId });
        if (existing) {
            return res.status(400).json({ error: 'Assignment already submitted' });
        }

        const submissionData = {
            assignmentId,
            courseId,
            userId,
            driveLink,
            submittedAt: Date.now(),
            status: 'submitted',
            score: null,
            feedback: ''
        };

        const submission = new AssignmentSubmission(submissionData);
        await submission.save();

        // Increment submission count
        await Assignment.findByIdAndUpdate(assignmentId, { $inc: { submissions: 1 } });

        res.status(201).json(submission);
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ error: 'Failed to submit assignment', details: error.message });
    }
});

// Grade assignment (Teacher)
app.put('/api/assignments/submissions/:submissionId/grade', async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { score, feedback, gradedBy } = req.body;

        // Get submission to find assignment and validate score
        const submission = await AssignmentSubmission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        // Get assignment to check maxScore
        const assignment = await Assignment.findById(submission.assignmentId);
        if (score > assignment.maxScore) {
            return res.status(400).json({ error: `Score cannot exceed ${assignment.maxScore}` });
        }

        // Update submission
        submission.score = score;
        submission.feedback = feedback || '';
        submission.gradedAt = Date.now();
        submission.gradedBy = gradedBy;
        submission.status = 'graded';
        await submission.save();

        // Recalculate proportional assignment marks for this student
        const courseId = submission.courseId;
        const userId = submission.userId;

        // Get all graded submissions for this student in this course
        const allSubmissions = await AssignmentSubmission.find({
            courseId,
            userId,
            status: 'graded'
        });

        // Get all assignments for this course to get maxScores
        const assignments = await Assignment.find({ courseId });
        const assignmentMap = {};
        assignments.forEach(a => {
            assignmentMap[a._id.toString()] = a.maxScore;
        });

        // Calculate proportional marks
        let totalEarned = 0;
        let totalPossible = 0;
        allSubmissions.forEach(sub => {
            totalEarned += sub.score || 0;
            totalPossible += assignmentMap[sub.assignmentId.toString()] || 0;
        });

        const assignmentMarks = totalPossible > 0 ? (totalEarned / totalPossible) * 25 : 0;

        // Update enrollment
        const enrollment = await Enrollment.findOne({ courseId, userId });
        if (enrollment) {
            enrollment.assignmentMarks = Math.round(assignmentMarks * 100) / 100; // Round to 2 decimals

            // Recalculate total grade
            const videoMarks = enrollment.videoMarks || 0;
            const quizMarks = enrollment.quizMarks || 0;
            enrollment.totalGrade = videoMarks + enrollment.assignmentMarks + quizMarks;
            enrollment.progress = Math.round(enrollment.totalGrade);

            await enrollment.save();
        }

        res.json({
            message: 'Assignment graded successfully',
            submission,
            assignmentMarks: enrollment ? enrollment.assignmentMarks : 0
        });
    } catch (error) {
        console.error('Error grading assignment:', error);
        res.status(500).json({ error: 'Failed to grade assignment', details: error.message });
    }
});

// Get submissions for an assignment (Teacher)
app.get('/api/courses/:courseId/assignments/:assignmentId/submissions', async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await AssignmentSubmission.find({ assignmentId });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Get student submissions for a specific course
app.get('/api/assignments/my-submissions/:userId/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const submissions = await AssignmentSubmission.find({ userId, courseId })
            .populate('assignmentId')
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching student submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
    }
});

// Get all submissions for a student (all courses)
app.get('/api/student/:studentId/submissions', async (req, res) => {
    try {
        const { studentId } = req.params;
        const submissions = await AssignmentSubmission.find({ userId: studentId });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching student submissions:', error);
        res.status(500).json({ error: 'Failed to fetch student submissions' });
    }
});

// ==================== QUIZZES API ====================

// Get all quizzes for a course
app.get('/api/courses/:courseId/quizzes', async (req, res) => {
    try {
        const { courseId } = req.params;
        const quizzes = await Quiz.find({ courseId });
        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});

// Create quiz (Teacher)
app.post('/api/courses/:courseId/quizzes', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, timeLimit, questions, passingScore } = req.body;

        const quizData = {
            courseId,
            title,
            description,
            timeLimit: timeLimit || 30,
            questions: questions || [],
            passingScore: passingScore || 60,
            totalQuestions: questions ? questions.length : 0,
            attempts: 0,
            averageScore: 0,
            status: 'active'
        };

        const quiz = new Quiz(quizData);
        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
});

// Submit quiz attempt (Student)
app.post('/api/courses/:courseId/quizzes/:quizId/attempt', async (req, res) => {
    try {
        const { courseId, quizId } = req.params;
        const { userId, answers, score, timeTaken } = req.body;

        const attemptData = {
            quizId,
            userId,
            answers,
            score,
            timeTaken,
            submittedAt: Date.now(),
            status: score >= 60 ? 'passed' : 'failed'
        };

        const attempt = new QuizAttempt(attemptData);
        await attempt.save();

        // Update quiz statistics
        await Quiz.findByIdAndUpdate(quizId, { $inc: { attempts: 1 } });

        // Recalculate quiz marks for this student in this course
        const quizzes = await Quiz.find({ courseId }).sort({ createdAt: 1 }).limit(3);
        const quizScores = [];

        for (const quiz of quizzes) {
            const latestAttempt = await QuizAttempt.findOne({
                quizId: quiz._id,
                userId
            }).sort({ submittedAt: -1 });

            if (latestAttempt) {
                quizScores.push(latestAttempt.score || 0);
            } else {
                quizScores.push(0);
            }
        }

        // Calculate average quiz score and convert to 25
        const avgQuizScore = quizScores.length > 0
            ? quizScores.reduce((a, b) => a + b, 0) / 3
            : 0;
        const quizMarks = Math.round((avgQuizScore / 100) * 25 * 100) / 100;

        // Update enrollment
        const enrollment = await Enrollment.findOne({ courseId, userId });
        if (enrollment) {
            enrollment.quizMarks = quizMarks;
            enrollment.totalGrade = (enrollment.videoMarks || 0) + (enrollment.assignmentMarks || 0) + quizMarks;
            enrollment.progress = Math.round(enrollment.totalGrade);
            await enrollment.save();
        }

        res.status(201).json(attempt);
    } catch (error) {
        console.error('Error submitting quiz attempt:', error);
        res.status(500).json({ error: 'Failed to submit quiz attempt' });
    }
});

// ==================== LIVE CLASSES API ====================

// Get all live classes for a course
app.get('/api/courses/:courseId/live-classes', async (req, res) => {
    try {
        const { courseId } = req.params;
        const classes = await LiveClass.find({ courseId }).sort({ scheduledAt: 1 });
        res.json(classes);
    } catch (error) {
        console.error('Error fetching live classes:', error);
        res.status(500).json({ error: 'Failed to fetch live classes' });
    }
});

// Create live class (Teacher)
app.post('/api/courses/:courseId/live-classes', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, scheduledAt, duration, meetingLink, instructor } = req.body;

        const classData = {
            courseId,
            title,
            description,
            scheduledAt: new Date(scheduledAt),
            duration: duration || 60,
            meetingLink,
            instructor,
            status: 'scheduled',
            attendees: 0
        };

        const liveClass = new LiveClass(classData);
        await liveClass.save();
        res.status(201).json(liveClass);
    } catch (error) {
        console.error('Error creating live class:', error);
        res.status(500).json({ error: 'Failed to create live class' });
    }
});

// Update live class status (Teacher)
app.put('/api/courses/:courseId/live-classes/:classId', async (req, res) => {
    try {
        const { classId } = req.params;

        const liveClass = await LiveClass.findByIdAndUpdate(
            classId,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!liveClass) {
            return res.status(404).json({ error: 'Live class not found' });
        }

        res.json({ message: 'Live class updated successfully' });
    } catch (error) {
        console.error('Error updating live class:', error);
        res.status(500).json({ error: 'Failed to update live class' });
    }
});

// ==================== STUDY MATERIALS API ====================

// Get all materials for a course
app.get('/api/courses/:courseId/materials', async (req, res) => {
    try {
        const { courseId } = req.params;
        const materials = await Material.find({ courseId });
        res.json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ error: 'Failed to fetch materials' });
    }
});

// Upload study material (Teacher)
app.post('/api/courses/:courseId/materials', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, type, fileUrl, fileName, fileSize } = req.body;

        const materialData = {
            courseId,
            title,
            description,
            type: type || 'document',
            fileUrl,
            fileName,
            fileSize,
            downloads: 0
        };

        const material = new Material(materialData);
        await material.save();
        res.status(201).json(material);
    } catch (error) {
        console.error('Error uploading material:', error);
        res.status(500).json({ error: 'Failed to upload material' });
    }
});

// Delete material (Teacher)
app.delete('/api/courses/:courseId/materials/:materialId', async (req, res) => {
    try {
        const { materialId } = req.params;
        const material = await Material.findByIdAndDelete(materialId);
        if (!material) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ error: 'Failed to delete material' });
    }
});

// ==================== LECTURES API (Video Lectures) ====================

// Get all lectures for a course
app.get('/api/courses/:courseId/lectures', async (req, res) => {
    try {
        const { courseId } = req.params;
        const lectures = await Lecture.find({ courseId }).sort({ order: 1 });

        // Transform lectures to include 'id' field
        const transformedLectures = lectures.map(lecture => ({
            ...lecture.toObject(),
            id: lecture._id.toString()
        }));

        res.json(transformedLectures);
    } catch (error) {
        console.error('Error fetching lectures:', error);
        res.status(500).json({ error: 'Failed to fetch lectures' });
    }
});

// Create lecture (Teacher)
app.post('/api/courses/:courseId/lectures', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, videoUrl, duration, order } = req.body;

        const lectureData = {
            courseId,
            title,
            description: description || '',
            videoUrl,
            duration: duration || '0:00',
            order
        };

        const lecture = new Lecture(lectureData);
        await lecture.save();

        // Update course totalLectures count
        await Course.findByIdAndUpdate(courseId, { $inc: { totalLectures: 1 } });

        res.status(201).json({
            ...lecture.toObject(),
            id: lecture._id.toString()
        });
    } catch (error) {
        console.error('Error creating lecture:', error);
        res.status(500).json({ error: 'Failed to create lecture' });
    }
});

// Update lecture (Teacher)
app.put('/api/courses/:courseId/lectures/:lectureId', async (req, res) => {
    try {
        const { lectureId } = req.params;

        const lecture = await Lecture.findByIdAndUpdate(
            lectureId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lecture) {
            return res.status(404).json({ error: 'Lecture not found' });
        }

        res.json({
            ...lecture.toObject(),
            id: lecture._id.toString()
        });
    } catch (error) {
        console.error('Error updating lecture:', error);
        res.status(500).json({ error: 'Failed to update lecture' });
    }
});

// Delete lecture (Teacher)
app.delete('/api/courses/:courseId/lectures/:lectureId', async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;

        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({ error: 'Lecture not found' });
        }

        // Decrement course totalLectures count
        await Course.findByIdAndUpdate(courseId, { $inc: { totalLectures: -1 } });

        res.json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        console.error('Error deleting lecture:', error);
        res.status(500).json({ error: 'Failed to delete lecture' });
    }
});

// Mark lecture as completed (Student)
app.post('/api/courses/:courseId/lectures/:lectureId/complete', async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // Find enrollment
        const enrollment = await Enrollment.findOne({ courseId, userId });
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        // Check if lecture already completed
        if (enrollment.completedLectures.includes(lectureId)) {
            return res.json({ message: 'Lecture already marked as completed' });
        }

        // Add lecture to completed lectures
        enrollment.completedLectures.push(lectureId);
        enrollment.completedVideosCount = enrollment.completedLectures.length;

        // Calculate video marks (out of 50)
        const totalLectures = await Lecture.countDocuments({ courseId });
        if (totalLectures > 0) {
            enrollment.videoMarks = (enrollment.completedVideosCount / totalLectures) * 50;
        } else {
            enrollment.videoMarks = 50; // If no lectures, give full marks? Or 0. Let's keep it safe.
        }

        // Ensure marks are numbers
        const videoMarks = enrollment.videoMarks || 0;
        const assignmentMarks = enrollment.assignmentMarks || 0;
        const quizMarks = enrollment.quizMarks || 0;

        // Update total grade
        enrollment.totalGrade = videoMarks + assignmentMarks + quizMarks;

        // Update progress percentage
        enrollment.progress = Math.round(enrollment.totalGrade);

        await enrollment.save();

        res.json({
            message: 'Lecture marked as completed',
            videoMarks: enrollment.videoMarks,
            totalGrade: enrollment.totalGrade,
            progress: enrollment.progress
        });
    } catch (error) {
        console.error('Error marking lecture as complete:', error);
        res.status(500).json({ error: 'Failed to mark lecture as complete', details: error.message });
    }
});

// ==================== STUDENTS API (for Teachers) ====================

// Get all students enrolled in teacher's courses
app.get('/api/teacher/:teacherId/students', async (req, res) => {
    try {
        const { teacherId } = req.params;

        // Get teacher's courses
        const courses = await Course.find({ instructorId: teacherId });
        const courseIds = courses.map(c => c._id);

        // Get enrollments for these courses
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).populate('courseId');

        const students = enrollments.map(enrollment => ({
            id: enrollment.userId,
            courseId: enrollment.courseId._id.toString(),
            courseName: enrollment.courseId.title,
            userId: enrollment.userId,
            progress: enrollment.progress,
            completedLectures: enrollment.completedLectures,
            status: enrollment.status,
            enrolledAt: enrollment.enrolledAt
        }));

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// ==================== GRADEBOOK API ====================

// Get gradebook for a course
app.get('/api/courses/:courseId/gradebook', async (req, res) => {
    try {
        const { courseId } = req.params;

        // Get all enrollments for this course
        const enrollments = await Enrollment.find({ courseId });

        // Get all assignments (max 2)
        const assignments = await Assignment.find({ courseId }).sort({ createdAt: 1 }).limit(2);

        // Get all quizzes (max 3)
        const quizzes = await Quiz.find({ courseId }).sort({ createdAt: 1 }).limit(3);

        const gradebook = [];

        for (const enrollment of enrollments) {
            const studentId = enrollment.userId;

            // Initialize student grade record
            const studentGrade = {
                studentId,
                studentName: 'Unknown Student', // Will be populated if we have user data
                videoMark: enrollment.videoMarks || 0, // Out of 50
                assignment1: null,
                assignment2: null,
                assignmentTotal: 0, // Out of 25
                quiz1: null,
                quiz2: null,
                quiz3: null,
                quizTotal: 0, // Out of 25
                finalTotal: 0 // Out of 100
            };

            // Get assignment submissions and scores
            if (assignments.length > 0) {
                const submission1 = await AssignmentSubmission.findOne({
                    assignmentId: assignments[0]._id,
                    userId: studentId
                });
                studentGrade.assignment1 = submission1 ? (submission1.score || 0) : 0;
            }

            if (assignments.length > 1) {
                const submission2 = await AssignmentSubmission.findOne({
                    assignmentId: assignments[1]._id,
                    userId: studentId
                });
                studentGrade.assignment2 = submission2 ? (submission2.score || 0) : 0;
            }

            // Calculate assignment total (convert to 25)
            // Get max scores for assignments
            const assignment1MaxScore = assignments[0] ? assignments[0].maxScore : 100;
            const assignment2MaxScore = assignments[1] ? assignments[1].maxScore : 100;

            const assignment1Percentage = assignment1MaxScore > 0 ? (studentGrade.assignment1 / assignment1MaxScore) : 0;
            const assignment2Percentage = assignment2MaxScore > 0 ? (studentGrade.assignment2 / assignment2MaxScore) : 0;

            // Average the two assignments and convert to 25
            const avgAssignmentPercentage = assignments.length > 0
                ? (assignment1Percentage + assignment2Percentage) / 2
                : 0;
            studentGrade.assignmentTotal = Math.round(avgAssignmentPercentage * 25 * 100) / 100;

            // Get quiz attempts and scores
            if (quizzes.length > 0) {
                const attempt1 = await QuizAttempt.findOne({
                    quizId: quizzes[0]._id,
                    userId: studentId
                }).sort({ submittedAt: -1 });
                studentGrade.quiz1 = attempt1 ? (attempt1.score || 0) : 0;
            }

            if (quizzes.length > 1) {
                const attempt2 = await QuizAttempt.findOne({
                    quizId: quizzes[1]._id,
                    userId: studentId
                }).sort({ submittedAt: -1 });
                studentGrade.quiz2 = attempt2 ? (attempt2.score || 0) : 0;
            }

            if (quizzes.length > 2) {
                const attempt3 = await QuizAttempt.findOne({
                    quizId: quizzes[2]._id,
                    userId: studentId
                }).sort({ submittedAt: -1 });
                studentGrade.quiz3 = attempt3 ? (attempt3.score || 0) : 0;
            }

            // Calculate quiz total (convert to 25)
            // Assuming quizzes are scored out of 100
            const avgQuizScore = quizzes.length > 0
                ? (studentGrade.quiz1 + studentGrade.quiz2 + studentGrade.quiz3) / 3
                : 0;
            studentGrade.quizTotal = Math.round((avgQuizScore / 100) * 25 * 100) / 100;

            // Calculate final total
            studentGrade.finalTotal = Math.round((studentGrade.videoMark + studentGrade.assignmentTotal + studentGrade.quizTotal) * 100) / 100;

            gradebook.push(studentGrade);
        }

        res.json(gradebook);
    } catch (error) {
        console.error('Error fetching gradebook:', error);
        res.status(500).json({ error: 'Failed to fetch gradebook' });
    }
});

// Update assignment marks for a student (Teacher)
app.put('/api/courses/:courseId/gradebook/:studentId/assignments', async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const { assignment1, assignment2, assignmentId } = req.body;

        // Find the enrollment
        const enrollment = await Enrollment.findOne({ courseId, userId: studentId });
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        // Get assignments for this course
        const assignments = await Assignment.find({ courseId }).sort({ createdAt: 1 }).limit(2);

        if (assignments.length === 0) {
            return res.status(400).json({ error: 'No assignments found for this course' });
        }

        // Update or create assignment submission with the score
        if (assignment1 !== undefined && assignments[0]) {
            let submission = await AssignmentSubmission.findOne({
                assignmentId: assignments[0]._id,
                userId: studentId
            });

            if (submission) {
                submission.score = assignment1;
                submission.status = 'graded';
                submission.gradedAt = Date.now();
                await submission.save();
            } else {
                // Create a new submission record with just the score
                submission = new AssignmentSubmission({
                    assignmentId: assignments[0]._id,
                    courseId,
                    userId: studentId,
                    driveLink: 'N/A', // Placeholder since teacher is entering marks directly
                    score: assignment1,
                    status: 'graded',
                    gradedAt: Date.now()
                });
                await submission.save();
            }
        }

        if (assignment2 !== undefined && assignments[1]) {
            let submission = await AssignmentSubmission.findOne({
                assignmentId: assignments[1]._id,
                userId: studentId
            });

            if (submission) {
                submission.score = assignment2;
                submission.status = 'graded';
                submission.gradedAt = Date.now();
                await submission.save();
            } else {
                // Create a new submission record with just the score
                submission = new AssignmentSubmission({
                    assignmentId: assignments[1]._id,
                    courseId,
                    userId: studentId,
                    driveLink: 'N/A', // Placeholder
                    score: assignment2,
                    status: 'graded',
                    gradedAt: Date.now()
                });
                await submission.save();
            }
        }

        // Recalculate assignment total (convert to 25)
        const assignment1MaxScore = assignments[0] ? assignments[0].maxScore : 100;
        const assignment2MaxScore = assignments[1] ? assignments[1].maxScore : 100;

        const sub1 = await AssignmentSubmission.findOne({ assignmentId: assignments[0]._id, userId: studentId });
        const sub2 = assignments[1] ? await AssignmentSubmission.findOne({ assignmentId: assignments[1]._id, userId: studentId }) : null;

        const score1 = sub1 ? (sub1.score || 0) : 0;
        const score2 = sub2 ? (sub2.score || 0) : 0;

        const assignment1Percentage = assignment1MaxScore > 0 ? (score1 / assignment1MaxScore) : 0;
        const assignment2Percentage = assignment2MaxScore > 0 ? (score2 / assignment2MaxScore) : 0;

        const avgAssignmentPercentage = (assignment1Percentage + assignment2Percentage) / 2;
        const assignmentTotal = Math.round(avgAssignmentPercentage * 25 * 100) / 100;

        // Update enrollment
        enrollment.assignmentMarks = assignmentTotal;
        enrollment.totalGrade = (enrollment.videoMarks || 0) + assignmentTotal + (enrollment.quizMarks || 0);
        enrollment.progress = Math.round(enrollment.totalGrade);
        await enrollment.save();

        res.json({
            message: 'Assignment marks updated successfully',
            assignmentTotal,
            totalGrade: enrollment.totalGrade
        });
    } catch (error) {
        console.error('Error updating assignment marks:', error);
        res.status(500).json({ error: 'Failed to update assignment marks', details: error.message });
    }
});


// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    if (mongoose.connection.readyState !== 1) {
        console.warn('⚠️  WARNING: MongoDB is not connected!');
        console.warn('   Please start MongoDB or update MONGODB_URI in .env file');
    }
});
