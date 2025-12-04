import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/course_management';

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
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
    completedLectures: { type: Number, default: 0 },
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
    userId: { type: String, required: true },
    content: { type: String, required: true },
    attachments: { type: Array, default: [] },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'submitted' },
    grade: { type: Number, default: null },
    feedback: { type: String, default: null },
    gradedAt: { type: Date, default: null }
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

// Create Models
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);
const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
const LiveClass = mongoose.model('LiveClass', liveClassSchema);
const Material = mongoose.model('Material', materialSchema);

// ==================== DATABASE CONNECTION ====================

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Please make sure MongoDB is running or check your MONGODB_URI in .env file');
    });

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
        res.json(courses);
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
        res.json(course);
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

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ courseId, userId });
        if (existingEnrollment) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
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

        res.status(201).json({ courseId, ...enrollmentData });
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ error: 'Failed to enroll student' });
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
app.post('/api/courses/:courseId/assignments/:assignmentId/submit', async (req, res) => {
    try {
        const { courseId, assignmentId } = req.params;
        const { userId, content, attachments } = req.body;

        const submissionData = {
            assignmentId,
            userId,
            content,
            attachments: attachments || [],
            submittedAt: Date.now(),
            status: 'submitted',
            grade: null,
            feedback: null
        };

        const submission = new AssignmentSubmission(submissionData);
        await submission.save();

        // Increment submission count
        await Assignment.findByIdAndUpdate(assignmentId, { $inc: { submissions: 1 } });

        res.status(201).json({ assignmentId, ...submissionData });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ error: 'Failed to submit assignment' });
    }
});

// Grade assignment (Teacher)
app.put('/api/courses/:courseId/assignments/:assignmentId/submissions/:userId/grade', async (req, res) => {
    try {
        const { assignmentId, userId } = req.params;
        const { grade, feedback } = req.body;

        const submission = await AssignmentSubmission.findOneAndUpdate(
            { assignmentId, userId },
            {
                grade,
                feedback,
                gradedAt: Date.now(),
                status: 'graded'
            },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({ message: 'Assignment graded successfully' });
    } catch (error) {
        console.error('Error grading assignment:', error);
        res.status(500).json({ error: 'Failed to grade assignment' });
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

        // Get all enrollments
        const enrollments = await Enrollment.find({ courseId });
        
        // Get all assignments
        const assignments = await Assignment.find({ courseId });
        
        // Get all quizzes
        const quizzes = await Quiz.find({ courseId });

        const gradebook = [];

        for (const enrollment of enrollments) {
            const studentId = enrollment.userId;
            const studentGrades = {
                studentId,
                assignments: [],
                quizzes: [],
                totalScore: 0
            };

            // Get assignment submissions
            for (const assignment of assignments) {
                const submission = await AssignmentSubmission.findOne({
                    assignmentId: assignment._id,
                    userId: studentId
                });

                studentGrades.assignments.push({
                    assignmentId: assignment._id.toString(),
                    title: assignment.title,
                    maxScore: assignment.maxScore,
                    grade: submission ? submission.grade : null
                });
            }

            // Get quiz attempts
            for (const quiz of quizzes) {
                const attempt = await QuizAttempt.findOne({
                    quizId: quiz._id,
                    userId: studentId
                }).sort({ submittedAt: -1 });

                studentGrades.quizzes.push({
                    quizId: quiz._id.toString(),
                    title: quiz.title,
                    score: attempt ? attempt.score : null
                });
            }

            gradebook.push(studentGrades);
        }

        res.json(gradebook);
    } catch (error) {
        console.error('Error fetching gradebook:', error);
        res.status(500).json({ error: 'Failed to fetch gradebook' });
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
