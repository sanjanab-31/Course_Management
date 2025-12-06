import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentsPage from './components/teacher/StudentsPage';
import GradebookPage from './components/teacher/GradebookPage';

import StudentProfile from './components/student/StudentProfile';
import TeacherProfile from './components/teacher/TeacherProfile';
import StudentSettings from './components/student/StudentSettings';
import TeacherSettings from './components/teacher/TeacherSettings';
import StudentCourses from './components/student/StudentCourses';
import TeacherCourses from './components/teacher/TeacherCourses';
import TeacherAssignments from './components/teacher/TeacherAssignments';
import TeacherLiveClasses from './components/teacher/TeacherLiveClasses';
import TeacherQuizzes from './components/teacher/TeacherQuizzes';
import TeacherStudyMaterials from './components/teacher/TeacherStudyMaterials';
import LiveClassesPage from './components/student/LiveClassesPage';
import AssignmentsPage from './components/student/AssignmentsPage';
import QuizzesTestsPage from './components/student/QuizzesTestsPage';
import StudyMaterialsPage from './components/student/StudyMaterialsPage';
import MyProgressPage from './components/student/MyProgressPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userRole !== role) {
    const redirect = userRole === 'teacher' ? '/teacher' : '/student';
    return <Navigate to={redirect} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  if (currentUser) {
    const redirect = userRole === 'teacher' ? '/teacher' : '/student';
    return <Navigate to={redirect} replace />;
  }
  return children;
}

// Component to handle 404 redirects
function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <RedirectHandler />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student Dashboard Routes */}
          <Route path="/student" element={
            <RoleRoute role="student">
              <StudentDashboard />
            </RoleRoute>
          } />
          <Route path="/teacher" element={
            <RoleRoute role="teacher">
              <TeacherDashboard />
            </RoleRoute>
          } />
          <Route path="/students" element={
            <RoleRoute role="teacher">
              <StudentsPage />
            </RoleRoute>
          } />
          <Route path="/gradebook" element={
            <RoleRoute role="teacher">
              <GradebookPage />
            </RoleRoute>
          } />

          {/* Keep existing student feature routes under /student */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Navigate to="/student" replace />} />
          <Route path="/student/profile" element={
            <RoleRoute role="student">
              <StudentProfile />
            </RoleRoute>
          } />
          <Route path="/teacher/profile" element={
            <RoleRoute role="teacher">
              <TeacherProfile />
            </RoleRoute>
          } />
          <Route path="/student/settings" element={
            <RoleRoute role="student">
              <StudentSettings />
            </RoleRoute>
          } />
          <Route path="/teacher/settings" element={
            <RoleRoute role="teacher">
              <TeacherSettings />
            </RoleRoute>
          } />

          {/* Student Course Routes */}
          <Route path="/student/courses" element={
            <RoleRoute role="student">
              <StudentCourses />
            </RoleRoute>
          } />
          <Route path="/live-classes" element={
            <RoleRoute role="student">
              <LiveClassesPage />
            </RoleRoute>
          } />
          <Route path="/assignments" element={
            <RoleRoute role="student">
              <AssignmentsPage />
            </RoleRoute>
          } />
          <Route path="/quizzes-tests" element={
            <RoleRoute role="student">
              <QuizzesTestsPage />
            </RoleRoute>
          } />
          <Route path="/study-materials" element={
            <RoleRoute role="student">
              <StudyMaterialsPage />
            </RoleRoute>
          } />
          <Route path="/my-progress" element={
            <RoleRoute role="student">
              <MyProgressPage />
            </RoleRoute>
          } />

          {/* Teacher Routes */}
          <Route path="/teacher/courses" element={
            <RoleRoute role="teacher">
              <TeacherCourses />
            </RoleRoute>
          } />
          <Route path="/teacher/assignments" element={
            <RoleRoute role="teacher">
              <TeacherAssignments />
            </RoleRoute>
          } />
          <Route path="/teacher/live-classes" element={
            <RoleRoute role="teacher">
              <TeacherLiveClasses />
            </RoleRoute>
          } />
          <Route path="/teacher/quizzes" element={
            <RoleRoute role="teacher">
              <TeacherQuizzes />
            </RoleRoute>
          } />
          <Route path="/teacher/study-materials" element={
            <RoleRoute role="teacher">
              <TeacherStudyMaterials />
            </RoleRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
