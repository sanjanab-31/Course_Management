import React from 'react';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';

const StudentLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 font-['Poppins']">
            {/* Fixed Sidebar */}
            <StudentSidebar />

            {/* Main Content Area with margin to account for fixed sidebar */}
            <main className="flex-1 ml-56 overflow-y-auto">
                {/* Sticky Header */}
                <StudentHeader />

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;
