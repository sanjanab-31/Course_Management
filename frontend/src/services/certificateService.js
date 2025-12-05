import {
    getQuizzesForCourse,
    getStudentQuizAttempts
} from './quizService';
import {
    getAssignmentsForCourse,
    getStudentAssignmentSubmissions
} from './assignmentService';

/**
 * Check if a student has completed all requirements for a course
 * Requirements: 3 quizzes completed + 2 assignments submitted
 */
export const checkCourseCompletion = async (courseId, userId) => {
    try {
        // Get all quizzes for the course
        const quizzes = await getQuizzesForCourse(courseId);

        // Get all assignments for the course
        const assignments = await getAssignmentsForCourse(courseId);

        // Check if there are at least 3 quizzes and 2 assignments
        if (quizzes.length < 3 || assignments.length < 2) {
            return {
                isCompleted: false,
                reason: 'Course does not have minimum required quizzes (3) and assignments (2)'
            };
        }

        // Check quiz attempts
        let completedQuizzes = 0;
        let quizScores = [];

        for (const quiz of quizzes.slice(0, 3)) { // Only check first 3 quizzes
            const attempts = await getStudentQuizAttempts(courseId, quiz.id, userId);
            if (attempts.length > 0) {
                completedQuizzes++;
                // Get best score from all attempts
                const bestScore = Math.max(...attempts.map(a => a.score || 0));
                quizScores.push(bestScore);
            }
        }

        // Check assignment submissions
        let submittedAssignments = 0;
        let assignmentScores = [];

        for (const assignment of assignments.slice(0, 2)) { // Only check first 2 assignments
            const submissions = await getStudentAssignmentSubmissions(courseId, assignment.id, userId);
            if (submissions.length > 0) {
                submittedAssignments++;
                // Get the latest submission score
                const latestSubmission = submissions[0];
                if (latestSubmission.score !== null && latestSubmission.score !== undefined) {
                    // Assuming assignment score is stored as percentage
                    assignmentScores.push(latestSubmission.score);
                }
            }
        }

        // Check if all requirements are met
        const isCompleted = completedQuizzes >= 3 && submittedAssignments >= 2;

        if (!isCompleted) {
            return {
                isCompleted: false,
                reason: `Incomplete: ${completedQuizzes}/3 quizzes, ${submittedAssignments}/2 assignments`,
                completedQuizzes,
                submittedAssignments
            };
        }

        // Calculate final grade
        const grade = calculateFinalGrade(quizScores, assignmentScores);

        return {
            isCompleted: true,
            grade: grade.letter,
            percentage: grade.percentage,
            completedQuizzes,
            submittedAssignments,
            quizScores,
            assignmentScores
        };

    } catch (error) {
        console.error('Error checking course completion:', error);
        return {
            isCompleted: false,
            reason: 'Error checking completion status'
        };
    }
};

/**
 * Calculate final grade based on quiz and assignment scores
 * Weight: 50% quizzes, 50% assignments
 */
const calculateFinalGrade = (quizScores, assignmentScores) => {
    // Calculate average quiz score
    const avgQuizScore = quizScores.length > 0
        ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
        : 0;

    // Calculate average assignment score
    const avgAssignmentScore = assignmentScores.length > 0
        ? assignmentScores.reduce((sum, score) => sum + score, 0) / assignmentScores.length
        : 0;

    // Final percentage (50% quizzes + 50% assignments)
    const finalPercentage = (avgQuizScore * 0.5) + (avgAssignmentScore * 0.5);

    // Convert to letter grade
    let letterGrade;
    if (finalPercentage >= 90) {
        letterGrade = 'A+';
    } else if (finalPercentage >= 85) {
        letterGrade = 'A';
    } else if (finalPercentage >= 80) {
        letterGrade = 'A-';
    } else if (finalPercentage >= 75) {
        letterGrade = 'B+';
    } else if (finalPercentage >= 70) {
        letterGrade = 'B';
    } else if (finalPercentage >= 65) {
        letterGrade = 'B-';
    } else if (finalPercentage >= 60) {
        letterGrade = 'C+';
    } else if (finalPercentage >= 55) {
        letterGrade = 'C';
    } else if (finalPercentage >= 50) {
        letterGrade = 'C-';
    } else {
        letterGrade = 'F';
    }

    return {
        letter: letterGrade,
        percentage: Math.round(finalPercentage)
    };
};

/**
 * Get completion status for multiple courses
 */
export const getCourseCompletionStatus = async (courseIds, userId) => {
    const completionStatuses = {};

    for (const courseId of courseIds) {
        completionStatuses[courseId] = await checkCourseCompletion(courseId, userId);
    }

    return completionStatuses;
};
