import { useNavigate } from "react-router-dom"
import { deletePost } from "../api/posts"

export default function DeleteModal({ setShowDeleteModal, postId }) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await deletePost(postId)
      navigate("/")
    } catch (err) {
      console.error("Failed to delete post:", err)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-[#222428] p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white">Delete Post</h2>

        <p className="mt-3 text-gray-400">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-400 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
