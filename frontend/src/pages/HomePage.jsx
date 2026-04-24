import { useState, useEffect, useRef } from "react";
import { getPostFeed } from "../api/posts";
import FeedPostCard from "../components/FeedPostCard";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import FilterBar from "../components/FilterBar";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [totalThreads, setTotalThreads] = useState(0);

  // THE NEW CATEGORY STATE
  const [activeCategory, setActiveCategory] = useState(null);

  const observerRef = useRef(null);

  const loadPosts = async (currentPage, currentCategory) => {
    if ((isFetchingMore && currentPage !== 1) || (!hasMore && currentPage !== 1)) return;

    if (currentPage === 1) setIsInitialLoading(true);
    else setIsFetchingMore(true);

    setError("");

    // Send the active category to newly updated api helper!
    const res = await getPostFeed(currentPage, 20, currentCategory);
    console.log("BACKEND RESPONSE: ", res);

    if (res.error) {
      setError(res.error);
      if (currentPage === 1) setIsInitialLoading(false);
      else setIsFetchingMore(false);
      return;
    }

    setPosts((prev) => (currentPage === 1 ? res.data : [...prev, ...res.data]));
    setHasMore(res.pagination?.hasNextPage || false);
    setTotalThreads(res.pagination?.totalPosts || res.data?.length || 0);
    setPage(currentPage + 1);

    if (currentPage === 1) setIsInitialLoading(false);
    else setIsFetchingMore(false);
  };

  // 1. Trigger load when page opens OR when category is clicked
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts(1, activeCategory); // <-- Triggers a fresh fetch when you click a sidebar item!
  }, [activeCategory]);
  // 2. Trigger load when scrolling down (Infinite Scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];
          if (firstEntry.isIntersecting && hasMore && !isFetchingMore && !isInitialLoading) {
            loadPosts(page, activeCategory);
          }
        },
        { threshold: 1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [page, hasMore, isFetchingMore, isInitialLoading, activeCategory]);

  // 3. Loading Skeleton
  if (isInitialLoading) {
    return (
        <div className="max-w-[1400px] mx-auto mt-8 space-y-2 px-4">
          {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full h-[74px] bg-gray-800 rounded-md animate-pulse" />
          ))}
        </div>
    );
  }

  return (
      <div className="max-w-[1400px] mx-auto mt-6 pb-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">

          <div className="col-span-1">
            <LeftSidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <FilterBar setPosts={setPosts} />

            <div className="flex justify-between items-center bg-gray-800/80 p-3 rounded-lg border border-gray-700 mb-4">
            <span className="text-white font-semibold text-sm">
              {/* Dynamically change header based on what was clicked! */}
              {activeCategory ? `${activeCategory} Discussions` : "Latest Activity"}
            </span>
            </div>

            <div className="space-y-3">
              {posts.length === 0 && !error ? (
                  <p className="text-gray-400 text-center py-10">No posts found in this category.</p>
              ) : (
                  posts.map((post) => (
                      <FeedPostCard key={post._id} post={post} />
                  ))
              )}

              {error && <p className="text-red-500 text-center py-4">{error}</p>}
              {isFetchingMore && <p className="text-gray-400 text-center py-4 animate-pulse">Loading older posts...</p>}
              <div ref={observerRef} style={{ height: "20px" }} />
              {!hasMore && posts.length > 0 && <p className="text-gray-500 text-center text-sm italic py-4">No more posts to show.</p>}
            </div>
          </div>

          <div className="col-span-1 hidden lg:block">
            <RightSidebar totalThreads={totalThreads} onlineUsers={1} />
          </div>
        </div>
      </div>
  );
}