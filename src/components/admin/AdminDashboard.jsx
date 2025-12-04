import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser, userRole } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Portal</h1>
      <p className="mt-2 text-gray-600">Welcome, {currentUser?.email} ({userRole}).</p>
      <div className="mt-6">
        <p className="text-gray-700">This is a placeholder dashboard for admins.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
