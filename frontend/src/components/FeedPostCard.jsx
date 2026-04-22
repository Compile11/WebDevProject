import { formatTime } from "../utils/formatTime";
import {Link, useNavigate} from "react-router-dom";

export default function FeedPostCard({ post }) {
  const navigate = useNavigate();

  const handleUserClick = (e) =>{
    e.preventDefault();
    e.stopPropagation();
    navigate(`/user/${post.userId?._id}`);
  };
  return (
      <div
          onClick={() => navigate(`/p/${post._id}`)}
          className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-lg p-4 my-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
      >
        {/* AVATAR & USERNAME (Now Clickable!) */}
        <div
            onClick={handleUserClick}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity z-10 relative w-fit"
        >
          {post.userId?.profilePic ? (
              <img src={post.userId.profilePic} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-white">
                {post.userId?.username?.[0]?.toUpperCase() || "U"}
              </div>
          )}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:underline">
          {post.userId?.username || "Unknown"}
        </span>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none max-w-[60%]">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate w-full">
            {post.title}
          </h2>
          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1 w-full">
            {post.body}
          </p>
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
          {formatTime(post.createdAt)}
        </div>
      </div>
  );
}
