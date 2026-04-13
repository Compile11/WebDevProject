import { Create } from "../components/Form"
import { useState, useEffect } from "react"
import { getAllPosts } from "../api/posts";
import CommentsSection from "../components/CommentsSection"

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

      <Create
        setPosts={setPosts}
      />

      {posts.length === 0 ? (
        <p>Loading posts...</p>
      ) : (
        posts?.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "15px",
              borderRadius: "5px",
            }}
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
  )
}
