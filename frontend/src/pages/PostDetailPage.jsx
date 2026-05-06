import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../api/posts";
import CommentsSection from "../components/CommentsSection";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { togglePostLike, togglePostDislike } from "../api/votes";
import { useAuth } from "../context/AuthContext";
import MarkdownPost from "../components/ui/MarkdownPost";
import SubscriptionBadge from "../components/subscription/SubscriptionBadge";

export default function PostDetailPage({ setTitle }) {
  const { postId } = useParams();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  useEffect(() => {
    async function fetchPost() {
      const res = await getPostById(postId);

      if (res.error) {
        console.error(res.error);
        setError(res.error);
        return;
      }

      setPost(res.data);
      setTitle(res.data.title);
      setLikes(res.data.likes || []);
      setDislikes(res.data.dislikes || []);
    }

    fetchPost();
    return () => setTitle(null);
  }, [postId, setTitle]);

  const handleVote = async (type) => {
    if (!currentUser) return alert("Please log in to vote!");

    try {
      const apiCall = type === "like" ? togglePostLike : togglePostDislike;
      const { data } = await apiCall(post._id);

      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (err) {
      console.error("Voting failed:", err);
    }
  };

  if (error) return <p className="text-red-500 mt-10 text-center">{error}</p>;
  if (!post)
    return (
      <p className="text-gray-400 mt-10 text-center animate-pulse">
        Loading...
      </p>
    );

  const hasLiked = likes.some((id) => id.toString() === currentUser?.id);
  const hasDisliked = dislikes.some((id) => id.toString() === currentUser?.id);

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6 pb-20">
      {/* PANEL 1: THE ORIGINAL POST (Header + Body) */}
      <div className="border-[3px] border-gray-400 dark:border-gray-700 bg-gray-200 dark:bg-[#222428] rounded-lg overflow-hidden">
        {/* --- Top Part: Header --- */}
        <div className="p-6 relative">
          <div className="flex justify-between items-start">
            {/* Avatar & Username */}
            <div className="flex items-center gap-4">
              {post.userId?.profilePic ? (
                <img
                  src={post.userId.profilePic}
                  className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                  alt="User"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-blue-500 bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                  {post.userId?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span className="flex items-center text-blue-400 font-bold text-lg gap-1.5">
                <span>{post.userId?.username || "Unknown Student"}</span>
                <SubscriptionBadge user={post.userId} />
              </span>
            </div>

            {/* Center: Title & Tags */}
            <div className="text-center max-w-[550px]">
              <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                {post.title}
              </h1>
              <div className="flex gap-2 justify-center mt-2 flex-wrap">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border border-gray-600 px-2 py-0.5 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Timestamp */}
            <span className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Bottom of Header: Votes */}
          <div className="mt-8 flex gap-4 text-sm text-gray-400 font-medium">
            <button
              onClick={() => handleVote("like")}
              className={`flex items-center gap-1.5 transition cursor-pointer ${hasLiked ? "text-blue-500" : "text-gray-700 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-200"}`}
            >
              <ThumbsUp size={18} fill={hasLiked ? "currentColor" : "none"} />
              <span>Likes: {likes.length}</span>
            </button>

            <div className="border-l dark:border-gray-700 pl-4">
              <button
                onClick={() => handleVote("dislike")}
                className={`flex items-center gap-1.5 transition cursor-pointer ${hasDisliked ? "text-red-500" : "text-gray-700 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-200"}`}
              >
                <ThumbsDown
                  size={18}
                  fill={hasDisliked ? "currentColor" : "none"}
                />
                <span>Dislikes: {dislikes.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Bottom Part: The Body (Separated by a border) --- */}
        <div className="border-t-[3px]  border-gray-400 dark:border-gray-700 p-8 min-h-[150px] ">
          <div className="prose prose-invert max-w-none">
            <MarkdownPost content={post.body} />
          </div>
        </div>
      </div>
      {/* NEW: FULL-SIZE POST IMAGE */}
      {post.image && (
        <div className="mb-8 rounded-lg overflow-hidden border border-gray-700 bg-gray-200 dark:bg-[#222428] flex justify-center p-2">
          <img
            src={post.image}
            alt="Post attachment"
            className="max-h-[600px] w-auto object-contain rounded"
          />
        </div>
      )}

      {/* PANEL 2: THE COMMENTS SECTION */}
      <div className="border-[3px] border-gray-400 dark:border-gray-700 bg-gray-200 dark:bg-[#222428] rounded-lg p-6">
        <CommentsSection postId={post._id} />
      </div>
    </div>
  );
}
