import React from 'react';
import TeacherSidebar from './TeacherSidebar';
import TeacherHeader from './TeacherHeader';

const TeacherLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 font-['Poppins']">
            {/* Fixed Sidebar */}
            <TeacherSidebar />

            {/* Main Content Area with margin to account for fixed sidebar */}
            <main className="flex-1 ml-56 overflow-y-auto">
                {/* Sticky Header */}
                <TeacherHeader />

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
