import React, { useState } from "react";
import { getPostFeed } from "../api/posts";

export default function FilterBar({ setPosts }) {
  const [input, setInput] = useState("");
  const [filterType, setFilterType] = useState("title");

  const handleSearch = async (value, type = filterType) => {
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

    const query = value.toLowerCase();
    const tagsArray = query.split(/\s+/);

    const filtered = res.data.filter((post) => {
      if (type === "title") {
        return post.title?.toLowerCase().includes(query);
      }

      if (type === "content") {
        return post.body?.toLowerCase().includes(query);
      }
      if (type === "tags") {
        return (
          Array.isArray(post.tags) &&
          tagsArray.every((tag) => post.tags.some((postTag) => postTag.toLowerCase().includes(tag)))
        );
      }
      return false;
    });

    setPosts(filtered);
  };

  return (
    <div className="mb-4 flex gap-2">
      {/* Search type dropdown menu */}
      <select
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          handleSearch(input, e.target.value);
        }}
        className="p-2 border rounded"
      >
        <option value="title">Title</option>
        <option value="content">Content</option>
        <option value="tags">Tags</option>
      </select>

      {/* Search bar */}
      <input
        type="text"
        value={input}
        onChange={(e) => handleSearch(e.target.value, filterType)}
        placeholder={`Filter posts by ${filterType}`}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}