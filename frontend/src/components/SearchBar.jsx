import React, { useState } from "react";
import { getPostFeed } from "../api/posts";

export default function SearchBar({ setPosts }) {
  const [input, setInput] = useState("");

  const handleSearch = async (value) => {
    setInput(value);

    {/*
    Already-loaded posts get filtered (rather than searched).
    Doesn't end up searching the backend, but of course this could be changed.
    This is evident when you search before scrolling, which ends up loading
    any unloaded posts, even if they don't match the filter query.
    */}

    const res = await getPostFeed(1, 100);

    if (res.error) return;

    if (!value.trim()) {
      setPosts(res.data);
      return;
    }

    const filtered = res.data.filter((post) =>
      post.title.toLowerCase().includes(value.toLowerCase())
    );

    setPosts(filtered);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Filter posts by name..."
        className="w-full p-2 border rounded"
      />
    </div>
  );
}