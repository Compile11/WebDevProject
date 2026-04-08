import { useState, useEffect } from 'react';
import { getAllPosts } from "./api/post/get"

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const result = await getAllPosts()
      if (result.error) {
        console.error(result.error)
        return
      }

      setPosts(result.data)
    }

    loadPosts()
  }, []);

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Compile Discussion Board</h1>

        {posts.length === 0 ? (
            <p>Loading posts...</p>
        ) : (
            posts.map((post) => (
                <div key={post._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '5px' }}>
                  <h2>{post.title}</h2>
                  <p>{post.body}</p>
                  <small>Posted by {post.author}</small>
                  <br />
                  <small>Tags: {post.tags.join(', ')}</small>
                </div>
            ))
        )}
      </div>
  );
}

export default App;
