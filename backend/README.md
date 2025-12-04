# Course Management Backend

This is the Node.js/Express backend for the Course Management System using MongoDB.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure MongoDB

You need to set up MongoDB:

**Option A: Local MongoDB**
1. Install MongoDB locally or use Docker
2. Start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/course_management`

Then create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Update the `.env` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/course_management
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course_management

PORT=5000
```

### 3. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| POST | `/api/courses` | Create a new course (Teacher) |
| PUT | `/api/courses/:id` | Update a course (Teacher) |
| DELETE | `/api/courses/:id` | Delete a course (Teacher) |

### Enrollments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments/:userId` | Get student enrollments |
| POST | `/api/enrollments` | Enroll in a course |

### Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/:courseId/assignments` | Get course assignments |
| POST | `/api/courses/:courseId/assignments` | Create assignment (Teacher) |
| POST | `/api/courses/:courseId/assignments/:id/submit` | Submit assignment (Student) |
| PUT | `/api/courses/:courseId/assignments/:id/submissions/:userId/grade` | Grade assignment (Teacher) |

### Quizzes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/:courseId/quizzes` | Get course quizzes |
| POST | `/api/courses/:courseId/quizzes` | Create quiz (Teacher) |
| POST | `/api/courses/:courseId/quizzes/:id/attempt` | Submit quiz attempt (Student) |

### Live Classes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/:courseId/live-classes` | Get course live classes |
| POST | `/api/courses/:courseId/live-classes` | Schedule live class (Teacher) |
| PUT | `/api/courses/:courseId/live-classes/:id` | Update live class (Teacher) |

### Study Materials

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/:courseId/materials` | Get course materials |
| POST | `/api/courses/:courseId/materials` | Upload material (Teacher) |
| DELETE | `/api/courses/:courseId/materials/:id` | Delete material (Teacher) |

### Teacher

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teacher/:teacherId/students` | Get teacher's students |
| GET | `/api/courses/:courseId/gradebook` | Get course gradebook |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## Data Flow

1. **Teacher creates courses** - Creates in MongoDB via backend API
2. **Students see courses** - Fetches from MongoDB via API
3. **Students enroll** - Creates enrollment in MongoDB
4. **Teacher creates content** - Assignments, quizzes, materials stored in MongoDB
5. **Students access content** - All content fetched via API
6. **Students submit work** - Submissions stored in MongoDB
7. **Teacher grades work** - Grades stored and reflected for students

## MongoDB Schema Structure

```
courses/
  - _id, title, description, instructor, instructorId, category, level, duration, image, totalLectures, students, rating, createdAt, updatedAt

enrollments/
  - _id, courseId (ref), userId, progress, completedLectures, status, enrolledAt, completedAt

assignments/
  - _id, courseId (ref), title, description, dueDate, maxScore, attachments, status, submissions, createdAt

assignmentSubmissions/
  - _id, assignmentId (ref), userId, content, attachments, submittedAt, status, grade, feedback, gradedAt

quizzes/
  - _id, courseId (ref), title, description, timeLimit, questions, passingScore, totalQuestions, attempts, averageScore, status, createdAt

quizAttempts/
  - _id, quizId (ref), userId, answers, score, timeTaken, submittedAt, status

liveClasses/
  - _id, courseId (ref), title, description, scheduledAt, duration, meetingLink, instructor, status, attendees, createdAt, updatedAt

materials/
  - _id, courseId (ref), title, description, type, fileUrl, fileName, fileSize, downloads, createdAt
```

## Authentication

Authentication is handled by Firebase Auth (frontend only). The backend API endpoints do not currently require authentication tokens, but this should be added for production use.
