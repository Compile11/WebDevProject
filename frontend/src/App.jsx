import { useState, useEffect } from 'react';
import Create from "./components/Form"

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch the posts from your running backend
    fetch('http://localhost:5000/api/posts')
        .then((response) => response.json())
        .then((data) => setPosts(data))
        .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Compile Discussion Board</h1>

        // temporarily rendering form for testing, can be deleted
        <Create />

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
