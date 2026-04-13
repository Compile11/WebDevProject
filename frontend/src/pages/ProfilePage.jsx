import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getAllPosts } from "../api/posts";

export default function ProfilePage() {
    const { currentUser } = useAuth();

    // 1. Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(currentUser?.username || '');
    const [message, setMessage] = useState('');

    // 2. NEW: Activity Feed State
    const [myPosts, setMyPosts] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    // 3. NEW: Fetch and filter posts when the page loads
    useEffect(() => {
        async function loadUserPosts() {
            const result = await getAllPosts();
            if (!result.error && currentUser) {
                // Filter the massive list of posts down to JUST the ones this user wrote!
                const filteredPosts = result.data.filter(
                    (post) => post.author === currentUser.username || post.author === currentUser.email
                );
                setMyPosts(filteredPosts);
            }
            setIsLoadingPosts(false);
        }
        loadUserPosts();
    }, [currentUser]);

    // Security Bounce
    if (!currentUser) {
        return <Navigate to="/auth" />;
    }

    const handleSave = async () => {
        try {
            // FIXED: You need to grab the token before you can use it in the fetch call!
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: newUsername }),
            });
            if (response.ok) {
                setMessage('Profile updated successfully. (You may need to log out and back in for the top nav to update!)');
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setMessage(`ERROR: ${errorData.message}`);
            }
        } catch(err) {
            setMessage("Network error. Is the server running?");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-gray-200 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

                {/* Display Status Messages */}
                {message && (
                    <div className="p-3 mb-4 text-sm rounded bg-blue-900/50 text-blue-400 border border-blue-800">
                        {message}
                    </div>
                )}

                {/* Profile Identity Card */}
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8 flex items-center gap-6">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                        {currentUser.username.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full max-w-xs p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
                        )}

                        <p className="text-gray-400 mt-1">{currentUser.email}</p>
                        <span className="inline-block mt-3 bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full text-gray-300">
                            Compile Member
                        </span>
                    </div>
                </div>

                {/* Account Settings / Edit Buttons */}
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>

                    {isEditing ? (
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* NEW: User Activity Feed */}
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">Your Recent Posts</h3>
                        <span className="bg-blue-900 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                            {myPosts.length} Posts
                        </span>
                    </div>

                    <div className="space-y-4">
                        {isLoadingPosts ? (
                            <p className="text-gray-400 text-sm">Loading activity...</p>
                        ) : myPosts.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">You haven't created any posts yet.</p>
                        ) : (
                            myPosts.map((post) => (
                                <div key={post._id} className="bg-gray-900 p-4 rounded-md border border-gray-700 hover:border-gray-500 transition">
                                    <h4 className="text-lg font-bold text-blue-400">{post.title}</h4>
                                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">{post.body}</p>
                                    <div className="mt-3 flex gap-2">
                                        {post.tags?.map(tag => (
                                            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}