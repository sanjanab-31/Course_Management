// Configuration for data source
// Set to 'api' to use backend API, or 'firebase' to use Firebase directly
const DATA_SOURCE = 'api';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API call failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

// ==================== COURSES API ====================

export const coursesApi = {
    getAll: () => apiCall('/courses'),
    getById: (courseId) => apiCall(`/courses/${courseId}`),
    create: (courseData) => apiCall('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
    }),
    update: (courseId, courseData) => apiCall(`/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
    }),
    delete: (courseId) => apiCall(`/courses/${courseId}`, {
        method: 'DELETE',
    }),
};

// ==================== ENROLLMENTS API ====================

export const enrollmentsApi = {
    getByUserId: (userId) => apiCall(`/enrollments/${userId}`),
    enroll: (courseId, userId) => apiCall('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ courseId, userId }),
    }),
};

// ==================== ASSIGNMENTS API ====================

export const assignmentsApi = {
    getByCourse: (courseId) => apiCall(`/courses/${courseId}/assignments`),
    create: (courseId, assignmentData) => apiCall(`/courses/${courseId}/assignments`, {
        method: 'POST',
        body: JSON.stringify(assignmentData),
    }),
    submit: (courseId, assignmentId, submissionData) =>
        apiCall(`/courses/${courseId}/assignments/${assignmentId}/submit`, {
            method: 'POST',
            body: JSON.stringify(submissionData),
        }),
    grade: (courseId, assignmentId, userId, gradeData) =>
        apiCall(`/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/grade`, {
            method: 'PUT',
            body: JSON.stringify(gradeData),
        }),
    getSubmissions: (courseId, assignmentId) =>
        apiCall(`/courses/${courseId}/assignments/${assignmentId}/submissions`),
    getMySubmissions: (studentId) => apiCall(`/student/${studentId}/submissions`),
};

// ==================== QUIZZES API ====================

export const quizzesApi = {
    getByCourse: (courseId) => apiCall(`/courses/${courseId}/quizzes`),
    create: (courseId, quizData) => apiCall(`/courses/${courseId}/quizzes`, {
        method: 'POST',
        body: JSON.stringify(quizData),
    }),
    submitAttempt: (courseId, quizId, attemptData) =>
        apiCall(`/courses/${courseId}/quizzes/${quizId}/attempt`, {
            method: 'POST',
            body: JSON.stringify(attemptData),
        }),
};

// ==================== LIVE CLASSES API ====================

export const liveClassesApi = {
    getByCourse: (courseId) => apiCall(`/courses/${courseId}/live-classes`),
    create: (courseId, classData) => apiCall(`/courses/${courseId}/live-classes`, {
        method: 'POST',
        body: JSON.stringify(classData),
    }),
    update: (courseId, classId, classData) =>
        apiCall(`/courses/${courseId}/live-classes/${classId}`, {
            method: 'PUT',
            body: JSON.stringify(classData),
        }),
};

// ==================== MATERIALS API ====================

export const materialsApi = {
    getByCourse: (courseId) => apiCall(`/courses/${courseId}/materials`),
    upload: (courseId, materialData) => apiCall(`/courses/${courseId}/materials`, {
        method: 'POST',
        body: JSON.stringify(materialData),
    }),
    delete: (courseId, materialId) =>
        apiCall(`/courses/${courseId}/materials/${materialId}`, {
            method: 'DELETE',
        }),
};

// ==================== LECTURES API ====================

export const lecturesApi = {
    getByCourse: (courseId) => apiCall(`/courses/${courseId}/lectures`),
    create: (courseId, lectureData) => apiCall(`/courses/${courseId}/lectures`, {
        method: 'POST',
        body: JSON.stringify(lectureData),
    }),
    update: (courseId, lectureId, lectureData) => apiCall(`/courses/${courseId}/lectures/${lectureId}`, {
        method: 'PUT',
        body: JSON.stringify(lectureData),
    }),
    delete: (courseId, lectureId) => apiCall(`/courses/${courseId}/lectures/${lectureId}`, {
        method: 'DELETE',
    }),
    markComplete: (courseId, lectureId, userId) => apiCall(`/courses/${courseId}/lectures/${lectureId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
    }),
};

// ==================== TEACHER API ====================

export const teacherApi = {
    getStudents: (teacherId) => apiCall(`/teacher/${teacherId}/students`),
    getGradebook: (courseId) => apiCall(`/courses/${courseId}/gradebook`),
};

// ==================== HEALTH CHECK ====================

export const healthCheck = () => apiCall('/health');

// Export all APIs
export default {
    courses: coursesApi,
    enrollments: enrollmentsApi,
    assignments: assignmentsApi,
    quizzes: quizzesApi,
    liveClasses: liveClassesApi,
    materials: materialsApi,
    lectures: lecturesApi,
    teacher: teacherApi,
    healthCheck,
    DATA_SOURCE,
};
