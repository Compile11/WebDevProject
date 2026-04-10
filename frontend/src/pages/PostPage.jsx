import { useState } from "react";
import { createNewPost } from "../../api/posts";

export default function PostPage() {
  const [postData, setPostData] = useState({
    title: "",
    body: "",
    author: "",
    tags: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      ...postData,
      author: postData.author || "Anonymous Student",
      tags: postData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const result = await createNewPost(newPost);

    if (result.error) {
      console.error(result.error);
      return;
    }

    console.log("Created post:", result.data);

    setPostData({
      title: "",
      body: "",
      author: "",
      tags: "",
    });
  };

  return (
    <div className="mx-[200px] pt-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

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
          placeholder="Author"
          value={postData.author}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, author: e.target.value }))
          }
          className="border rounded px-3 py-2"
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
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
