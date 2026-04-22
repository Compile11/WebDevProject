import { useState, useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getPostsByUserId} from "../api/posts";
import {getUserProfile} from "../api/user";
import {BadgeCheck, ArrowLeft} from "lucide-react";
import FeedPostCard from "../components/FeedPostCard";

export default function PublicProfilePage() {
    const {userId} = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUserData() {
            setIsLoading(true);

            //fetch user info and their posts at same time
            const [profileRes, postsRes] = await Promise.all([
                getUserProfile(userId),
                getPostsByUserId(userId)
            ]);

            if(profileRes.error){
                setError(profileRes.error);
            }else{
                setProfileUser(profileRes.data);
                setUserPosts(postsRes.data || []);
            }
            setIsLoading(false);
        }
        fetchUserData();
    }, [userId]);

    if (isLoading) return <div className="text-center text-gray-400 mt-20 animate-pulse">Loading Profile...</div>;
    if (error||!profileUser) return <div className="text-center text-red-500 mt-20">{error || "User Not Found"}</div>;
    return (
        <div className="max-w-3xl mx-auto mt-8 px-4 pb-20">

            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
                <ArrowLeft size={20} /> Back
            </button>

            {/* Identity Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8 flex items-center gap-6">
                <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32">
                    {profileUser.profilePic ? (
                        <img src={profileUser.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full border-4 border-gray-600" />
                    ) : (
                        <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-5xl font-bold text-white border-4 border-gray-600">
                            {profileUser.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        {profileUser.username}
                        {profileUser.isVerified && <BadgeCheck size={22} className="text-blue-500 fill-blue-500/10" title="Verified Student" />}
                    </h2>
                    <p className="text-gray-300 text-sm italic border-l-2 border-blue-500 pl-3 mt-3">
                        {profileUser.bio || "This user hasn't added a bio yet."}
                    </p>
                    <span className="inline-block mt-4 bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full text-gray-300">Compile Member</span>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">{profileUser.username}'s Posts</h3>
                    <span className="bg-blue-900 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">{userPosts.length} Posts</span>
                </div>

                <div className="space-y-4">
                    {userPosts.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No posts yet.</p>
                    ) : (
                        userPosts.map((post) => (
                            <FeedPostCard key={post._id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}