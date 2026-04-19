import { useState, useEffect, useRef } from "react";
import { getPostFeed } from "../api/posts";
import FeedPostCard from "../components/FeedPostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const observerRef = useRef(null);

  const loadPosts = async (currentPage) => {
    if (
      (isFetchingMore && currentPage !== 1) ||
      (!hasMore && currentPage !== 1)
    )
      return;

    if (currentPage === 1) {
      setIsInitialLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    setError("");

    const res = await getPostFeed(page, 20);

    if (res.error) {
      setError(res.error);

      if (currentPage === 1) {
        setIsInitialLoading(false);
      } else {
        setIsFetchingMore(false);
      }
      return;
    }

    setPosts((prev) => (currentPage === 1 ? res.data : [...prev, ...res.data]));

    setHasMore(res.pagination.hasNextPage);
    setPage(currentPage + 1);

    if (currentPage === 1) {
      setIsInitialLoading(false);
    } else {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !isFetchingMore &&
          !isInitialLoading
        ) {
          loadPosts(page);
        }
      },
      { threshold: 1 },
    );

    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [page, hasMore, isFetchingMore, isInitialLoading]);

  if (isInitialLoading) {
    return (
      <div className="mt-8 space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-full h-[74px] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 pb-6">
      {posts.map((post) => (
        <FeedPostCard post={post} />
      ))}

      {error && <p>{error}</p>}

      {isFetchingMore && <p>Loading posts...</p>}

      <div ref={observerRef} style={{ height: "20px" }} />

      {!hasMore && <p>No more posts :(</p>}
    </div>
  );
}
