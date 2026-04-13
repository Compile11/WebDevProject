import { Create } from "../components/Form";
import { useState, useEffect } from "react";
import { getAllPosts } from "../api/posts";
import CommentsSection from "../components/CommentsSection";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const result = await getAllPosts();
      if (result.error) {
        console.error(result.error);
        return;
      }

      setPosts(result.data);
    }

    loadPosts();
  }, []);

  return (
    <>
      <h1>Compile Discussion Board</h1>

      {posts.length === 0 ? (
        <p>Loading posts...</p>
      ) : (
        posts?.map((post) => (
          <div
            key={post._id}
            className="border border-gray-300 my-2.5 p-[15px] rounded-md"
          >
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <small>Posted by {post.userId?.username}</small>
            <br />
            <small>Tags: {post.tags.join(", ")}</small>

            <CommentsSection postId={post._id} />
          </div>
        ))
      )}
    </>
  );
}
