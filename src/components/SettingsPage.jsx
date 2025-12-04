import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Bell, Lock, User } from 'lucide-react';

const SettingsPage = () => {

    return (
        <DashboardLayout>

            <div className="max-w-2xl space-y-6">
                {/* Account Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <User className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Satyam Singh"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="student@srieshwar.edu.in"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Bell className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-700">Email notifications</span>
                            <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-700">Assignment reminders</span>
                            <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-700">Class schedule updates</span>
                            <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                        </label>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Lock className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Security</h2>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                        Change Password
                    </button>
                </div>

                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                    Save Changes
                </button>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
