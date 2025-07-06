import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import axiosInstance from "../utils/axiosInstance";

const FeedView = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0); // each page = 10 posts
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/posts?skip=${page * 10}&limit=10`);
      setPosts((prev) => [...prev, ...res.data.posts]);
      setHasMore(res.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // fetch initial
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom && !loading && hasMore) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && (
        <p className="text-sm text-gray-400 mt-4">Loading more posts...</p>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">You’ve reached the end.</p>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-sm text-gray-400 mt-4">No posts yet.</p>
      )}
    </div>
  );
};

export default FeedView;
