import React from 'react';
import { GraduationCap } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Poppins']">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-blue-600 p-3 rounded-full">
                        <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sri Eshwar Course Management
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {title}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-blue-600">
                    {subtitle && (
                        <div className="mb-6 text-center">
                            <h3 className="text-xl font-semibold text-gray-800">{subtitle}</h3>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
