import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { togglePostLike, togglePostDislike } from "../api/votes";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  // Sync local state with the post arrays from the database
  const [likes, setLikes] = useState(post.likes || []);
  const [dislikes, setDislikes] = useState(post.dislikes || []);

  const hasLiked = likes.includes(currentUser?.id);
  const hasDisliked = dislikes.includes(currentUser?.id);

  const handleVote = async (type) => {
    if (!currentUser) return alert("Please log in to vote!");

    try {
      const apiCall = type === "like" ? togglePostLike : togglePostDislike;
      const { data } = await apiCall(post._id);

      // Backend returns: { likes: [...], dislikes: [...] }
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (err) {
      console.error("Voting failed:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition mb-4 shadow-sm cursor-pointer group">
      <h4 
        className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        onClick={() => navigate(`/p/${post._id}`)}
      >
        {post.title}
      </h4>

      <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 line-clamp-3">
        {post.body}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVote("like")}
            className={`flex items-center gap-1.5 transition ${hasLiked
                ? "text-blue-500"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            <ThumbsUp size={18} fill={hasLiked ? "currentColor" : "none"} />
            <span className="text-sm font-bold">{likes.length}</span>
          </button>

          <button
            onClick={() => handleVote("dislike")}
            className={`flex items-center gap-1.5 transition ${hasDisliked
                ? "text-red-500"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            <ThumbsDown
              size={18}
              fill={hasDisliked ? "currentColor" : "none"}
            />
            <span className="text-sm font-bold">{dislikes.length}</span>
          </button>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-gray-500 dark:text-gray-500 text-[10px] uppercase tracking-wider">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>

          <div className="flex gap-1">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
