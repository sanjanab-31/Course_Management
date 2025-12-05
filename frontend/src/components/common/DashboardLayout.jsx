import React from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 font-['Poppins']">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area with margin to account for fixed sidebar */}
            <main className="flex-1 ml-56 overflow-y-auto">
                {/* Sticky Header */}
                <DashboardHeader />

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
