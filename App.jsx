// src/App.jsx
import React from 'react';

function App() {
  return (
    <div className="app-container">
      {/* navigation bar */}
      <header className="navbar">
        <div className="logo">Compile</div>
        {/* Asynch live search here */}
        <input type="text" placeholder="Search courses, tags, or posts..." />
        <nav>
          <button>Login</button>
          <button>Sign Up</button>
        </nav>
      </header>

      <div className="main-layout">
        {/* sidebar for categories */}
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            <li>Tech Help / Coding</li>
            <li>CS Concepts</li>
            <li>Career & Job Market</li>
            <li>Venting / Uneasy Subjects</li>
          </ul>
        </aside>

        {/* primary discussion feed */}
        <main className="feed">
          <h2>Recent Discussions</h2>
          
          {/* single thread card ex */}
          <article className="thread-card">
            <h4>How do I invert a binary tree?</h4>
            <p>Posted by CS_Student_99 in Tech Help</p>
            <div className="thread-actions">
              <button>Upvote</button>
              <button>Downvote</button>
              <span>15 Comments</span>
            </div>
          </article>
          
        </main>
      </div>
    </div>
  );
}

export default App;
