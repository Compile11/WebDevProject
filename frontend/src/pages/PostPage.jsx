import { useState } from "react";
import { createNewPost } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { Loader } from "lucide-react";

export default function PostPage() {
  const [postData, setPostData] = useState({
    title: "",
    body: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("hello");

    if (!currentUser) {
      setError("Login or signup to post!");
      setIsLoading(false);
      return;
    }

    const newPost = {
      ...postData,
      tags: postData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      await createNewPost(newPost);

      setPostData({
        title: "",
        body: "",
        tags: "",
      });

      setSuccess("Post created!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-[200px] pt-6">
      {error && (
        <div className="mb-4 rounded bg-red-100 px-3 py-2 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded bg-green-100 px-3 py-2 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={postData.title}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border rounded px-3 py-2"
          required
        />

        <textarea
          placeholder="Body"
          value={postData.body}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, body: e.target.value }))
          }
          className="border rounded px-3 py-2 min-h-[150px]"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={postData.tags}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, tags: e.target.value }))
          }
          className="border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="flex items-center justify-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" size={18} /> : "Submit"}
        </button>
      </form>
    </div>
  );
}
