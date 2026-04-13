import React from 'react';
import {useAuth} from '../context/AuthContext';
import {Navigate} from 'react-router-dom';

export default function ProfilePage() {
    const {currentUser} = useAuth();

    if(!currentUser){
        return <Navigate to="/auth" />;
    }
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-gray-200 p-8">
            <div className="max-w-3xl mx-auto">

                {/* Header Section */}
                <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

                {/* Profile Info Card */}
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8 flex items-center gap-6">

                    {/* Big Avatar */}
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                        {currentUser.username.charAt(0).toUpperCase()}
                    </div>

                    {/* User Details */}
                    <div>
                        <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
                        <p className="text-gray-400 mt-1">{currentUser.email}</p>
                        <span className="inline-block mt-3 bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full text-gray-300">
              Compile Member
            </span>
                    </div>
                </div>

                {/* Placeholder for future features */}
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
                    <p className="text-gray-400 text-sm italic mb-4">
                        More features coming soon! (e.g., Change Password, View My Posts)
                    </p>

                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition">
                        Edit Profile
                    </button>
                </div>

            </div>
        </div>
    )
}