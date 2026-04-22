import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { togglePostLike, togglePostDislike } from "../api/votes";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
    const { currentUser } = useAuth();

    // Sync local state with the post arrays from the database
    const [likes, setLikes] = useState(post.likes || []);
    const [dislikes, setDislikes] = useState(post.dislikes || []);

    const hasLiked = likes.includes(currentUser?.id);
    const hasDisliked = dislikes.includes(currentUser?.id);

    const handleVote = async (e, type) => {
        e.preventDefault();
        e.stopPropagation();

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
        <Link to={`/p/${post._id}`}>
            <div className="bg-gray-900 p-4 rounded-md border border-gray-700 hover:border-gray-500 transition mb-4">
                {/* Post Header & Body */}
                <h4 className="text-lg font-bold text-blue-400">{post.title}</h4>
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">{post.body}</p>

                {/* Vote & Meta Row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-4">
                        {/* LIKE BUTTON */}
                        <button
                            onClick={(e) => handleVote(e, "like")}
                            className={`flex items-center gap-1.5 transition ${hasLiked ? "text-blue-500" : "text-gray-400 hover:text-gray-200"}`}
                        >
                            <ThumbsUp size={18} fill={hasLiked ? "currentColor" : "none"} />
                            <span className="text-sm font-bold">{likes.length}</span>
                        </button>

                        {/* DISLIKE BUTTON */}
                        <button
                            onClick={(e) => handleVote(e, "dislike")}
                            className={`flex items-center gap-1.5 transition ${hasDisliked ? "text-red-500" : "text-gray-400 hover:text-gray-200"}`}
                        >
                            <ThumbsDown size={18} fill={hasDisliked ? "currentColor" : "none"} />
                            <span className="text-sm font-bold">{dislikes.length}</span>
                        </button>
                    </div>

                    {/* Date & Tags */}
                    <div className="flex flex-col items-end gap-1">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
                        <div className="flex gap-1">
                            {post.tags?.map((tag) => (
                                <span key={tag} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
                    #{tag}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}