import React, { useState, useRef } from 'react';
import StudentLayout from './StudentLayout';
import { User, Shield, Lock, Edit2, X } from 'lucide-react';

const StudentSettings = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        fullName: 'Satyam Singh',
        email: 'satyam.singh@student.klu.edu',
        phone: '+91 98765 43210',
        department: 'Computer Science Engineering',
        studentId: 'KLU2023CSE0147',
        semester: 'Semester 5',
        bio: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file smaller than 2MB');
        }
    };

    const handleChangePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleSaveChanges = () => {
        // Save logic here - you can add API call or localStorage
        console.log('Saving profile data:', profileData);
        console.log('Profile photo:', profilePhoto);
        setIsEditMode(false);
        alert('Changes saved successfully!');
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        // Optionally reset to original data
    };

    const getInitials = () => {
        return profileData.fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <StudentLayout>
            <div className="max-w-7xl mx-auto">
                {/* Profile Information View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-8">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage your account and application preferences</p>
                                </div>
                                {!isEditMode ? (
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm flex items-center gap-2 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {/* Profile Information Section */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <User className="w-5 h-5 text-gray-700" />
                                    <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                                </div>

                                {/* Profile Photo */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-4">
                                        {profilePhoto ? (
                                            <img
                                                src={profilePhoto}
                                                alt="Profile"
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
                                                {getInitials()}
                                            </div>
                                        )}
                                        <div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={handleChangePhotoClick}
                                                disabled={!isEditMode}
                                                className={`text-sm font-medium ${isEditMode
                                                    ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                                                    : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                Change Photo
                                            </button>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleInputChange}
                                            disabled={!isEditMode}
                                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditMode ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditMode}
                                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditMode ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditMode}
                                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditMode ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={profileData.department}
                                            onChange={handleInputChange}
                                            disabled={!isEditMode}
                                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditMode ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={profileData.studentId}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                                        <input
                                            type="text"
                                            name="semester"
                                            value={profileData.semester}
                                            onChange={handleInputChange}
                                            disabled={!isEditMode}
                                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditMode ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleInputChange}
                                        disabled={!isEditMode}
                                        placeholder="Tell us about yourself..."
                                        rows="4"
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${isEditMode ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Security & Privacy Section */}
                            <div className="mb-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-6">
                                    <Shield className="w-5 h-5 text-gray-700" />
                                    <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Password & Authentication</h4>
                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Change Password
                                            </button>
                                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                                                Setup Two-Factor Auth
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            {isEditMode && (
                                <div className="flex justify-start">
                                    <button
                                        onClick={handleSaveChanges}
                                        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Overview Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Overview</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Member since</span>
                                    <span className="text-sm font-medium text-gray-900">Aug 2023</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Enrolled courses</span>
                                    <span className="text-sm font-medium text-gray-900">8</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Assignments completed</span>
                                    <span className="text-sm font-medium text-gray-900">47</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Quizzes attempted</span>
                                    <span className="text-sm font-medium text-gray-900">124</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>• Completed DSA assignment</div>
                                    <div>• Attended live DBMS class</div>
                                    <div>• Scored 85% in OS quiz</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentSettings;
