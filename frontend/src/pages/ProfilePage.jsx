import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getPostsByUserId } from "../api/posts";
import { updateUserUsername } from "../api/user";
import { Edit, Check } from "lucide-react";

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
  const [usernameField, setUsernameField] = useState(
    currentUser?.username || "",
  );
  const [message, setMessage] = useState("");
  const [bioField, setBioField] = useState("");

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
  const hasChanges =
    usernameField !== currentUser.username || bioField !== "";

  const handleSave = async () => {
    const result = await updateUserUsername({ username: usernameField });
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
          <div className="group relative w-24 h-24 cursor-pointer overflow-hidden rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner">
            <div className="absolute inset-0 bg-blue-600 transition-opacity group-hover:opacity-30" />

            <span className="relative z-10 transition-all group-hover:opacity-30">
              {currentUser.username.charAt(0).toUpperCase()}
            </span>

            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              onClick={() => {
                if (isEditing && hasChanges) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing && hasChanges ? (
                <Check className="w-10 h-10 text-green-400" />
              ) : (
                <Edit className="w-6 h-6" />
              )}
            </div>
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
                <h2 className="text-2xl font-bold text-white">
                  {usernameField}
                </h2>
                <p className="text-gray-400 mt-1">{currentUser.email}</p>
                <p className="text-gray-300 mt-3 text-sm italic border-l-2 border-blue-500 pl-3">
                  {bioField ||
                    "No bio added yet. Click Edit Profile to add one!"}
                </p>
              </div>
            )}

            <p className="text-gray-400 mt-1">{currentUser.email}</p>
            <span className="inline-block mt-3 bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full text-gray-300">
              Compile Member
            </span>
          </div>
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
