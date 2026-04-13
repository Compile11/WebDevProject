import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getAllPosts, getPostsByUserId } from "../api/posts";
import { updateUserUsername } from "../api/user";

export default function ProfilePage() {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  // Security Bounce
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // 1. Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.username || "");
  const [message, setMessage] = useState("");

  // 2. NEW: Activity Feed State
  const [myPosts, setMyPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // 3. NEW: Fetch and filter posts when the page loads
  useEffect(() => {
    async function loadUserPosts() {
      const result = await getPostsByUserId(currentUser.id);
      setMyPosts(result.data);
    }
    setIsLoadingPosts(false);
    loadUserPosts();
  }, [currentUser]);

  const handleSave = async () => {
    const result = await updateUserUsername({ username: newUsername });
    if (result.error) {
      setMessage(`ERROR: ${result.error}`);
      console.log(result);
      return;
    }

    setMessage("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] text-gray-200 px-2">
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
              <h2 className="text-2xl font-bold text-white">
                {currentUser.username}
              </h2>
            )}

            <p className="text-gray-400 mt-1">{currentUser.email}</p>
            <span className="inline-block mt-3 bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full text-gray-300">
              Compile Member
            </span>
          </div>
        </div>

        {/* Account Settings / Edit Buttons */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Account Settings
          </h3>

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
            <h3 className="text-xl font-semibold text-white">
              Your Recent Posts
            </h3>
            <span className="bg-blue-900 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
              {myPosts.length} Posts
            </span>
          </div>

          <div className="space-y-4">
            {isLoadingPosts ? (
              <p className="text-gray-400 text-sm">Loading activity...</p>
            ) : myPosts.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                You haven't created any posts yet.
              </p>
            ) : (
              myPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-900 p-4 rounded-md border border-gray-700 hover:border-gray-500 transition"
                >
                  <h4 className="text-lg font-bold text-blue-400">
                    {post.title}
                  </h4>
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                    {post.body}
                  </p>
                  <span className="text-gray-300 text-xs">
                    {new Date(post.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="mt-3 flex gap-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                      >
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
