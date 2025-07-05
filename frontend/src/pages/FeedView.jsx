import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

const FeedView = ({ refreshKey }) => {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get(`/posts?skip=0&limit=20`);
      setPosts(res.data.posts);
      setSkip(20);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshKey]); // ✅ refetch when refreshKey changes

  return (
    <div className="p-6 flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {!hasMore && (
        <p className="text-center text-gray-500 mt-4">No more posts</p>
      )}
    </div>
  );
};

export default FeedView;
