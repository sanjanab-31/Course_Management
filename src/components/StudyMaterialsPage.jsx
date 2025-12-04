import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Download, FileText, File } from 'lucide-react';

const StudyMaterialsPage = () => {

    const materials = [
        {
            id: 1,
            title: 'Binary Trees - Lecture Notes',
            course: 'Data Structures',
            type: 'PDF',
            size: '2.5 MB',
            uploadedOn: 'Nov 28, 2025'
        },
        {
            id: 2,
            title: 'SQL Query Examples',
            course: 'Database Management',
            type: 'PDF',
            size: '1.8 MB',
            uploadedOn: 'Nov 30, 2025'
        },
        {
            id: 3,
            title: 'Process Scheduling Slides',
            course: 'Operating Systems',
            type: 'PPT',
            size: '4.2 MB',
            uploadedOn: 'Dec 1, 2025'
        }
    ];

    return (
        <DashboardLayout>

            <div className="space-y-4">
                {materials.map((material) => (
                    <div key={material.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {material.type === 'PDF' ? (
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    ) : (
                                        <File className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{material.title}</h3>
                                    <p className="text-sm text-gray-600">{material.course}</p>
                                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                        <span>{material.type}</span>
                                        <span>•</span>
                                        <span>{material.size}</span>
                                        <span>•</span>
                                        <span>Uploaded {material.uploadedOn}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center space-x-2">
                                <Download className="w-5 h-5" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default StudyMaterialsPage;
