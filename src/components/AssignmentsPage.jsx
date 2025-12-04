import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const AssignmentsPage = () => {
    const navigate = useNavigate();

    const assignments = [
        {
            id: 1,
            title: 'Binary Trees Implementation',
            course: 'Data Structures',
            dueDate: 'Dec 5, 2025',
            status: 'pending',
            priority: 'high'
        },
        {
            id: 2,
            title: 'Database Normalization Exercise',
            course: 'DBMS',
            dueDate: 'Dec 6, 2025',
            status: 'pending',
            priority: 'medium'
        },
        {
            id: 3,
            title: 'Process Scheduling Algorithms',
            course: 'Operating Systems',
            dueDate: 'Dec 8, 2025',
            status: 'submitted',
            priority: 'low'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins'] p-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Assignments</h1>

            <div className="space-y-4">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                                    {assignment.status === 'submitted' ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center space-x-1">
                                            <CheckCircle className="w-3 h-3" />
                                            <span>Submitted</span>
                                        </span>
                                    ) : (
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${assignment.priority === 'high'
                                                ? 'bg-red-100 text-red-700'
                                                : assignment.priority === 'medium'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {assignment.priority.toUpperCase()} PRIORITY
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-3">{assignment.course}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {assignment.dueDate}</span>
                                </div>
                            </div>
                            <button className={`px-6 py-3 rounded-lg font-semibold ${assignment.status === 'submitted'
                                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}>
                                {assignment.status === 'submitted' ? 'View Submission' : 'Submit Assignment'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignmentsPage;
