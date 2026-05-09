import { useState } from "react";
import { createNewPost } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { Loader } from "lucide-react";

import MarkdownEditor from "../components/ui/MarkdownEditor";

export default function PostPage() {
  const [postData, setPostData] = useState({
    title: "",
    body: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!currentUser) {
      setError("Login or signup to post!");
      setIsLoading(false);
      return;
    }

    // Construct FormData to hold the text AND the file
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("body", postData.body);
    formData.append("flair", postData.flair || "Q & A");
    formData.append("tags", postData.tags); // The backend will split this string now

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await createNewPost(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Post created!");
      setPostData({ title: "", body: "", tags: "", flair: "Q & A" });
      setImageFile(null); // Clear the image
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 px-4 lg:px-0">
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
          className="border rounded px-3 py-2 text-gray-800 dark:text-gray-200 placeholder-gray-500"
          required
        />
        {/*Dropdown for preset flair */}
        <select
        value = {postData.flair}
        onChange={(e) => setPostData((prev) => ({ ...prev, flair: e.target.value }))}
        className="border border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-500"
        >
          {["Q & A", "Articles", "Object-Oriented", "OS & Kernels", "Game Dev"].map(flair => (
              <option key={flair} value={flair}>{flair}</option>
          ))}
        </select>

        <div className="flex flex-col gap-2 border border-gray-600 bg-gray-200 dark:bg-gray-800 rounded px-3 py-3">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-300">
            Attach Image (Optional)
          </label>
          <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-300 hover:file:bg-blue-400 dark:file:bg-blue-600/20 dark:file:text-blue-400 dark:hover:file:bg-blue-600/30 transition cursor-pointer"
          />
          {imageFile && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Ready to upload: {imageFile.name}
              </div>
          )}
        </div>

        <MarkdownEditor
          content={postData.body}
          setContent={(value) =>
            setPostData((prev) => ({ ...prev, body: value }))
          }
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
