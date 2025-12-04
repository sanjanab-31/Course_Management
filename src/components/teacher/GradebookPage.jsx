import React from 'react';
import DashboardLayout from '../DashboardLayout';

const GradebookPage = () => {
    return (
        <DashboardLayout>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Gradebook</h2>
                <p className="text-gray-600">Manage student grades here.</p>
            </div>
        </DashboardLayout>
    );
};

export default GradebookPage;
