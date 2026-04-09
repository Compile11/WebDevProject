import { useState } from "react";

export const Create = ({ setPosts }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const post = { title, body, author, tags: tagsArray };

    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const savedPost = await response.json();

      setPosts((prevPosts) => [savedPost, ...prevPosts])

      setTitle("");
      setBody("");
      setAuthor("");
      setTags("");
    } catch (error) {
      console.error("Error creating post:", error);
    } 
  }


    return (
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <label>Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <label>Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    );
  };
