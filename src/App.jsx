import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import StudentDashboard from './components/StudentDashboard';
import ProfilePage from './components/ProfilePage';
import MyCoursesPage from './components/MyCoursesPage';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student Dashboard Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/my-courses" element={
            <ProtectedRoute>
              <MyCoursesPage />
            </ProtectedRoute>
          } />
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
