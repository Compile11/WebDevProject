import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getAllPosts } from "../api/posts";

export default function ProfilePage() {
    const { currentUser } = useAuth();

    // 1. THE FIX: Prioritize local storage so the bio survives page refreshes!
    const activeUser = JSON.parse(localStorage.getItem('user')) || currentUser;

    // 2. State for the Profile Fields
    const [isEditing, setIsEditing] = useState(false);
    const [usernameField, setUsernameField] = useState(activeUser?.username || '');
    const [bioField, setBioField] = useState(activeUser?.bio || '');
    const [message, setMessage] = useState('');

    // 3. Activity Feed State
    const [myPosts, setMyPosts] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    useEffect(() => {
        async function loadUserPosts() {
            const result = await getAllPosts();
            if (!result.error && currentUser) {
                const filteredPosts = result.data.filter(
                    (post) => post.author === currentUser.username || post.author === currentUser.email
                );
                setMyPosts(filteredPosts);
            }
            setIsLoadingPosts(false);
        }
        loadUserPosts();
    }, [currentUser]);

    if (!currentUser) {
        return <Navigate to="/auth" />;
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: usernameField, bio: bioField }),
            });

            if (response.ok) {
                const updatedUser = await response.json();

                // Save the new data securely in the browser
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Update UI instantly without reloading!
                setMessage('Profile updated successfully!');
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setMessage(`ERROR: ${errorData.message}`);
            }
        } catch(err) {
            setMessage("Network error. Is the server running?");
        }
    };

    // If they click cancel, reset the text boxes back to the saved data
    const handleCancel = () => {
        const savedUser = JSON.parse(localStorage.getItem('user')) || currentUser;
        setUsernameField(savedUser.username || '');
        setBioField(savedUser.bio || '');
        setIsEditing(false);
        setMessage('');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-gray-200 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

                {message && (
                    <div className="p-3 mb-4 text-sm rounded bg-blue-900/50 text-blue-400 border border-blue-800">
                        {message}
                    </div>
                )}

                {/* Profile Identity Card */}
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8 flex items-center gap-6">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner shrink-0">
                        {usernameField.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        {isEditing ? (
                            <div className="flex flex-col gap-2 max-w-md">
                                <input
                                    type="text"
                                    value={usernameField}
                                    onChange={(e) => setUsernameField(e.target.value)}
                                    className="p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                />
                                <textarea
                                    value={bioField}
                                    onChange={(e) => setBioField(e.target.value)}
                                    placeholder="Tell the community about yourself..."
                                    className="p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none h-20"
                                    maxLength={200}
                                />
                            </div>
                        ) : (
                            <div>
                                {/* We now display the React state directly! */}
                                <h2 className="text-2xl font-bold text-white">{usernameField}</h2>
                                <p className="text-gray-400 mt-1">{currentUser.email}</p>
                                <p className="text-gray-300 mt-3 text-sm italic border-l-2 border-blue-500 pl-3">
                                    {bioField || "No bio added yet. Click Edit Profile to add one!"}
                                </p>
                            </div>
                        )}

                        <span className="inline-block mt-4 bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full text-gray-300">
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
                                onClick={handleCancel}
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

                {/* User Activity Feed */}
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