import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getPostsByUserId } from "../api/posts";
import { updateUser } from "../api/user";
import { Edit, Check, BadgeCheck } from "lucide-react";
import PostCard from "../components/PostCard";

export default function ProfilePage() {
  const { currentUser, setCurrentUser, authLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [usernameField, setUsernameField] = useState("");
  const [bioField, setBioField] = useState("");
  const [message, setMessage] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    async function loadUserPosts() {
      if (currentUser?.id) {
        const result = await getPostsByUserId(currentUser.id);
        if (result && result.data) {
          setMyPosts(result.data);
        }
      }
    }
    setUsernameField(currentUser?.username || "");
    setBioField(currentUser?.bio || "");
    setIsLoadingPosts(false);
    loadUserPosts();
  }, [currentUser]);

  if (authLoading) return <div className="text-white p-10">Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;

  const hasChanges = usernameField !== currentUser.username || bioField !== currentUser.bio || profilePicFile !== null;

  const handleSave = async () => {
    if (!hasChanges) return;

    // Use FormData so the image file actually uploads
    const formData = new FormData();
    formData.append("username", usernameField);
    formData.append("bio", bioField);
    if (profilePicFile) formData.append("profilePic", profilePicFile);

    const result = await updateUser({
      username: usernameField,
      bio: bioField,
      profilePic: profilePicFile // The actual file object from e.target.files[0]
    });

    if (result.error) {
      setMessage(`ERROR: ${result.error}`);
      return;
    }

    setCurrentUser(result.data);
    setMessage("Profile updated successfully");
    setIsEditing(false);
    setProfilePicFile(null);
  };

  return (
      <div className="min-h-[calc(100vh-64px)] text-gray-200 px-2 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 mt-8">Your Profile</h1>

          {/* Display Status Messages */}
          {message && (
              <div className={`p-3 mb-4 text-sm rounded border ${message.startsWith("ERROR") ? "bg-red-900/50 text-red-400 border-red-800" : "bg-blue-900/50 text-blue-400 border-blue-800"}`}>
                {message}
              </div>
          )}

          {/* Profile Identity Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8 flex items-center gap-6">

            {/* AVATAR CONTAINER */}
            <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32">
              {isEditing ? (
                  <label className="group relative w-full h-full cursor-pointer overflow-hidden rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-inner block">
                    {profilePicFile ? (
                        <img src={URL.createObjectURL(profilePicFile)} alt="Preview" className="w-full h-full object-cover border-4 border-blue-500 rounded-full" />
                    ) : currentUser?.profilePic ? (
                        <img src={currentUser.profilePic} alt="Profile" className="w-full h-full object-cover border-4 border-transparent group-hover:border-blue-500 transition-all rounded-full" />
                    ) : (
                        <div className="absolute inset-0 bg-blue-600 flex items-center justify-center border-4 border-transparent group-hover:border-blue-500 transition-all">
                          {usernameField.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="w-6 h-6 text-white mb-1" />
                      <span className="text-white text-xs font-bold">CHANGE PHOTO</span>
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => setProfilePicFile(e.target.files[0])} className="hidden" />
                  </label>
              ) : (
                  <div onClick={() => setIsEditing(true)} className="group relative w-full h-full cursor-pointer overflow-hidden rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-inner block border-2 border-transparent hover:border-blue-500 transition-all">
                    {currentUser?.profilePic ? (
                        <img src={currentUser.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
                          {currentUser?.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="w-8 h-8 text-white mb-1" />
                      <span className="text-white text-xs font-bold">EDIT PROFILE</span>
                    </div>
                  </div>
              )}
            </div>

            {/* INFO SECTION */}
            <div className="flex-1">
              {isEditing ? (
                  <div className="flex flex-col gap-2 max-w-md">
                    <input type="text" value={usernameField} onChange={(e) => setUsernameField(e.target.value)} className="p-2 bg-gray-900 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 font-bold" />
                    <textarea value={bioField} onChange={(e) => setBioField(e.target.value)} placeholder="Bio..." className="p-2 bg-gray-900 border border-gray-600 rounded text-white text-sm h-20" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 rounded flex items-center justify-center gap-1 text-sm"><Check size={16}/> Save Changes</button>
                      <button onClick={() => { setIsEditing(false); setProfilePicFile(null); }} className="flex-1 bg-gray-600 text-white py-1.5 rounded text-sm">Cancel</button>
                    </div>
                  </div>
              ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      {currentUser.username}
                      {currentUser.isVerified && <BadgeCheck size={22} className="text-blue-500 fill-blue-500/10" title="Verified Student" />}
                    </h2>
                    <p className="text-gray-400 mb-4">{currentUser.email}</p>
                    <p className="text-gray-300 text-sm italic border-l-2 border-blue-500 pl-3">{currentUser?.bio || "Add a bio!"}</p>
                    <span className="inline-block mt-4 bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full text-gray-300">Compile Member</span>
                  </div>
              )}
            </div>
          </div>

          {/* User Activity Feed */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Your Recent Posts</h3>
              <span className="bg-blue-900 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">{myPosts.length} Posts</span>
            </div>

            <div className="space-y-4">
              {isLoadingPosts ? (
                  <p className="text-gray-400 text-sm">Loading activity...</p>
              ) : myPosts.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No posts yet.</p>
              ) : (
                  /* THE CHANGED MAPPING LOGIC */
                  myPosts.map((post) => (
                      <PostCard key={post._id} post={post} />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}