import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getComments, createComment } from "../api/comments";

export default function CommentsSection({ postId }) {
  // 1. All hooks must live right here at the top of the component
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 2. The GET Request: Fetches comments when the page loads
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await getComments(postId)
        setComments(data)
      } catch (err) {
        console.error("Failed to load comments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [postId]);

  // 3. The POST Request: Sends new comment to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCommentText.trim()) return;

    if (!currentUser) {
      alert("You must be logged in to post a comment!");
      return;
    }

    try {
      const savedComment = await createComment({
        postId,
        text: newCommentText
      })

      setComments((prev) => [...prev, savedComment])
      setNewCommentText("")
    } catch (err) {
      console.error("Failed to post comment:", err)
      alert(err.message || "Failed to post comment")
    }

  };

  if (isLoading)
    return (
      <div className="text-gray-400 text-sm mt-4">Loading comments...</div>
    );

  return (
    <div className="border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Discussion ({comments.length})
      </h3>

      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-500 text-sm italic">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-300 dark:bg-gray-800 p-3 rounded-lg border border-gray-400 dark:border-gray-700"
            >
              {currentUser?.role === 'admin' && (
                  <button
                      onClick={() => {
                        if(window.confirm("Delete comment?")) deleteComment(comment._id).then(() => window.location.reload());
                      }}
                      className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
              )}
              <span className="text-blue-400 font-bold text-sm mr-2">
                {comment.userId?.username}
              </span>
              <span className="text-gray-600 dark:text-gray-500 text-xs">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              <p className="text-gray-800 dark:text-gray-300 mt-1 text-sm">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add to the discussion..."
          className="w-full p-2 bg-gray-300 dark:bg-gray-800 border border-gray-600 rounded text-gray-800 dark:text-white placeholder-gray-800 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
          required
        />
        <button
          type="submit"
          className="self-end bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          Post Reply
        </button>
      </form>
    </div>
  );
}
