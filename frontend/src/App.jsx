import { useState, useEffect } from "react";
import { getAllPosts } from "../api/posts";
import { Create } from "./components/Form";
import { NavBar } from "./components/navigation/NavBar";

function App() {
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
    <div className="min-h-screen w-screen">
      <NavBar />
      <div style={{ paddingLeft: "200px", paddingRight: "200px", fontFamily: "sans-serif" }}>
        <h1>Compile Discussion Board</h1>
        // temporarily rendering form for testing, can be deleted
        <Create 
          setPosts={setPosts}
          posts={posts}
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
              <small>Posted by {post.author}</small>
              <br />
              <small>Tags: {post.tags.join(", ")}</small>
            </div>
          ))
        )}
      </div>
    </div>  
  );
}

export default App;
