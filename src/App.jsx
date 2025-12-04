import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentsPage from './components/teacher/StudentsPage';
import GradebookPage from './components/teacher/GradebookPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import StudentCourses from './components/student/StudentCourses';
import TeacherCourses from './components/teacher/TeacherCourses';
import LiveClassesPage from './components/LiveClassesPage';
import AssignmentsPage from './components/AssignmentsPage';
import QuizzesTestsPage from './components/QuizzesTestsPage';
import StudyMaterialsPage from './components/StudyMaterialsPage';
import MyProgressPage from './components/MyProgressPage';
import SettingsPage from './components/SettingsPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userRole !== role) {
    const redirect = userRole === 'teacher' ? '/teacher' : userRole === 'admin' ? '/admin' : '/student';
    return <Navigate to={redirect} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  if (currentUser) {
    const redirect = userRole === 'teacher' ? '/teacher' : userRole === 'admin' ? '/admin' : '/student';
    return <Navigate to={redirect} replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
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
          <Route path="/admin" element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          } />
          {/* Keep existing student feature routes under /student */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Navigate to="/student" replace />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/student/courses" element={
            <RoleRoute role="student">
              <StudentCourses />
            </RoleRoute>
          } />
          <Route path="/teacher/courses" element={
            <RoleRoute role="teacher">
              <TeacherCourses />
            </RoleRoute>
          } />
          {/* Redirect legacy /my-courses if needed, or just remove it if sidebar is updated */}
          <Route path="/my-courses" element={<Navigate to="/student/courses" replace />} />
          <Route path="/live-classes" element={
            <ProtectedRoute>
              <LiveClassesPage />
            </ProtectedRoute>
          } />
          <Route path="/assignments" element={
            <ProtectedRoute>
              <AssignmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/quizzes-tests" element={
            <ProtectedRoute>
              <QuizzesTestsPage />
            </ProtectedRoute>
          } />
          <Route path="/study-materials" element={
            <ProtectedRoute>
              <StudyMaterialsPage />
            </ProtectedRoute>
          } />
          <Route path="/my-progress" element={
            <ProtectedRoute>
              <MyProgressPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
