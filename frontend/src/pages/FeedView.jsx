import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PostCard from "../components/PostCard";

const FeedView = () => {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // 👈 New state
  const limit = 10;

  const fetchPosts = async () => {
    setLoading(true); // 👈 Start loading
    try {
      const res = await axiosInstance.get(`/posts?skip=${skip}&limit=${limit}`);
      const newPosts = res.data.posts || [];

      setPosts((prev) => [...prev, ...newPosts]);
      setSkip((prev) => prev + limit);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false); // 👈 End loading
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = (postId) => {
    setPosts((prev) =>
      prev.filter((post) => post._id.toString() !== postId.toString())
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
      ))}

      {hasMore && (
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="text-center text-purple-400 py-4 hover:underline disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default FeedView;
