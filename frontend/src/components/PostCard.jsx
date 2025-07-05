import { useState } from "react";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import moment from "moment";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const PostCard = ({ post }) => {
  const {
    _id,
    caption,
    image,
    createdAt,
    postedBy,
    likes,
    comments: initialComments,
  } = post;

  const user = useSelector((state) => state.user.user);

  const [likesState, setLikesState] = useState(
    Array.isArray(likes) ? [...likes] : []
  );
  const [likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const isLiked =
    user &&
    likesState
      .map((like) => (typeof like === "object" ? like._id : like))
      .includes(user._id);

  const handleToggleLike = async () => {
    if (!user) {
      toast.info("Please login to like posts.");
      return;
    }

    setLikeLoading(true);
    try {
      await axiosInstance.put(`/posts/${_id}/like`);
      setLikesState((prev) => {
        const ids = prev.map((l) => (typeof l === "object" ? l._id : l));
        return ids.includes(user._id)
          ? ids.filter((id) => id !== user._id)
          : [...ids, user._id];
      });
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Failed to toggle like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.info("Please login to comment.");
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await axiosInstance.post(`/posts/${_id}/comment`, {
        text: newComment.trim(),
      });
      setComments(res.data.comments || []);
      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/posts/${_id}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="bg-zinc-800 text-gray-100 w-full md:w-[80%] mx-auto rounded-2xl shadow-lg transition-all duration-200 border border-zinc-700 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center uppercase">
            {postedBy?.username?.[0] || "U"}
          </div>
          <div>
            <p className="font-semibold text-sm">{postedBy?.username}</p>
            <p className="text-xs text-gray-400">{postedBy?.country}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">{moment(createdAt).fromNow()}</p>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-6 pt-4 text-sm leading-relaxed text-gray-200">
          {caption}
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt="post"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Likes + Comments Count */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-700 text-sm text-gray-400">
        <button
          onClick={handleToggleLike}
          disabled={likeLoading}
          className="flex items-center gap-1 text-red-400 disabled:opacity-50"
        >
          <Heart
            size={16}
            fill={isLiked ? "currentColor" : "none"}
            strokeWidth={isLiked ? 1.5 : 2}
          />
          <span>
            {likesState.length} {likesState.length === 1 ? "like" : "likes"}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <MessageCircle size={16} />
          <span>
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div className="px-6 py-3 text-sm space-y-3 border-t border-zinc-700 max-h-60 overflow-y-auto">
        {comments.length > 0 ? (
          <>
            {comments.length > 2 && !showAllComments && (
              <p
                className="text-purple-400 cursor-pointer text-sm"
                onClick={() => setShowAllComments(true)}
              >
                View all {comments.length} comments
              </p>
            )}

            {(showAllComments ? comments : comments.slice(-2)).map((c) => {
              const displayName =
                typeof c.commentedBy === "object"
                  ? c.commentedBy.username
                  : user?._id === c.commentedBy
                  ? user.username
                  : "User";

              return (
                <div key={c._id} className="flex justify-between items-start">
                  <div>
                    <p>
                      <span className="font-semibold">{displayName}:</span>{" "}
                      {c.text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {moment(c.createdAt).fromNow()}
                    </p>
                  </div>
                  {user &&
                    user._id === (c.commentedBy?._id || c.commentedBy) && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                </div>
              );
            })}
          </>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Add Comment */}
      <div className="flex items-center gap-2 px-6 py-3 border-t border-zinc-700">
        <input
          type="text"
          placeholder={user ? "Add a comment..." : "Login to comment"}
          className="flex-1 rounded-full px-4 py-2 text-sm bg-zinc-700 text-white border border-zinc-600 placeholder-gray-400"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          disabled={!user || commentLoading}
        />
        <button
          onClick={handleAddComment}
          className="text-purple-400 hover:text-purple-300 disabled:opacity-50"
          disabled={!user || commentLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
