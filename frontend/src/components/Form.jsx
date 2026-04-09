import { useState } from "react";
import { createNewPost } from "../../api/posts"

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

    const result = await createNewPost(post);

    if (result.error) {
      console.error(result.error);
      return;
    }

    setPosts((prev) => [result.data, ...prev])

    setTitle("")
    setBody("")
    setAuthor("")
    setTags("")
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
