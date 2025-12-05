import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Mail, Phone, Calendar, MapPin, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
    const { currentUser } = useAuth();

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 h-32"></div>

                    {/* Profile Content */}
                    <div className="px-8 pb-8">
                        <div className="flex items-end justify-between -mt-16 mb-6">
                            <div className="flex items-end space-x-4">
                                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                        SS
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">Satyam Singh</h1>
                                    <p className="text-gray-600">B.Tech Student</p>
                                </div>
                            </div>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <Edit className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        </div>

                        {/* Profile Details */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>

                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-gray-900">{currentUser?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="text-gray-900">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date of Birth</p>
                                        <p className="text-gray-900">January 15, 2003</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="text-gray-900">Coimbatore, Tamil Nadu</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h2>

                                <div>
                                    <p className="text-sm text-gray-500">Student ID</p>
                                    <p className="text-gray-900 font-medium">CSE2021045</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Department</p>
                                    <p className="text-gray-900">Computer Science & Engineering</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Current Semester</p>
                                    <p className="text-gray-900">Semester 5</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">CGPA</p>
                                    <p className="text-gray-900 font-semibold">8.7</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Expected Graduation</p>
                                    <p className="text-gray-900">May 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;

