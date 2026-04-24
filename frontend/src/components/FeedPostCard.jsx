import { useState } from "react";
import { formatTime } from "../utils/formatTime";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { togglePostLike, togglePostDislike } from "../api/votes";
import { useAuth } from "../context/AuthContext";
import {getFlairStyle} from "../utils/flairColors";

export default function FeedPostCard({ post }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // 1. Local state to handle real-time vote updates
  const [likes, setLikes] = useState(post.likes || []);
  const [dislikes, setDislikes] = useState(post.dislikes || []);

  const hasLiked = likes.some(id => id.toString() === currentUser?.id);
  const hasDisliked = dislikes.some(id => id.toString() === currentUser?.id);

  // 2. The Vote Handler
  const handleVote = async (e, type) => {
    e.preventDefault();
    e.stopPropagation(); // <-- This stops the click from opening the post!

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

  const handleUserClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/user/${post.userId?._id}`);
  };

  return (
      <div
          onClick={() => navigate(`/p/${post._id}`)}
          className="w-full bg-[#222428] hover:bg-[#2a2d32] rounded-lg p-4 shadow-sm transition-colors cursor-pointer border border-gray-800 hover:border-gray-600 flex flex-col gap-3"
      >
        {/* HEADER: Avatar, Username, Time */}
        <div className="flex items-center gap-3">
          <div onClick={handleUserClick} className="shrink-0 z-10 hover:opacity-80 transition-opacity">
            {post.userId?.profilePic ? (
                <img src={post.userId.profilePic} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-600" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-500 flex items-center justify-center text-sm font-bold text-blue-400">
                  {post.userId?.username?.[0]?.toUpperCase() || "U"}
                </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-gray-100 hover:text-blue-400 transition-colors line-clamp-1">
              {post.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-400">
            <span onClick={handleUserClick} className="hover:underline z-10">
              {post.userId?.username || "Unknown Student"}
            </span>
              <span>•</span>
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* BODY SNIPPET */}
        <p className="text-sm text-gray-300 line-clamp-2 ml-13">
          {post.body}
        </p>
        {/* FLAIR AND TAGS COMBINED */}
        <div className="ml-auto flex gap-2 items-center">

          {/* Render the single colored Flair */}
          {post.flair && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getFlairStyle(post.flair)}`}>
              {post.flair}
            </span>
          )}

          {/* Render up to 2 standard free-text tags */}
          {post.tags && post.tags.length > 0 && post.tags.slice(0, 2).map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
              #{tag}
            </span>
          ))}

        </div>

        {/* FOOTER: Stats & Votes */}
        <div className="flex items-center gap-4 ml-13 mt-1 text-xs font-medium text-gray-500">

          {/* THUMBS UP */}
          <div
              onClick={(e) => handleVote(e, "like")}
              className={`flex items-center gap-1.5 transition hover:text-gray-200 ${hasLiked ? "text-blue-500" : ""}`}
          >
            <ThumbsUp size={14} fill={hasLiked ? "currentColor" : "none"} />
            <span>{likes.length}</span>
          </div>

          {/* THUMBS DOWN */}
          <div
              onClick={(e) => handleVote(e, "dislike")}
              className={`flex items-center gap-1.5 transition hover:text-gray-200 ${hasDisliked ? "text-red-500" : ""}`}
          >
            <ThumbsDown size={14} fill={hasDisliked ? "currentColor" : "none"} />
            <span>{dislikes.length}</span>
          </div>

          <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <MessageSquare size={14} />
            <span>Reply</span>
          </div>

          {/* FIXED: The duplicate key error is solved by adding the index to the key */}
          {post.tags && post.tags.length > 0 && (
              <div className="ml-auto flex gap-2">
                {post.tags.slice(0, 2).map((tag, index) => (
                    <span key={`${tag}-${index}`} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}