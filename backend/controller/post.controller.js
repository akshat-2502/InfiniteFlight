import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { caption, image } = req.body;
    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }
    const post = new Post({
      caption,
      image,
      postedBy: req.user._id,
    });

    await post.save();

    res.status(201).json({ message: "Post Created Successfully", post });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//COMMENT

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    post.comments.push({
      text,
      commentedBy: req.user._id,
    });

    await post.save();
    res.status(201).json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Getting All Post

export const getAllPosts = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate("postedBy", "username country") //show user and country
      .populate("comments.commentedBy", "username country") //coment
      .sort({ createdAt: -1 }) //latest first
      .skip(skip)
      .limit(limit);

    const hasMore = skip + limit < totalPosts;

    res.status(200).json({
      posts,
      totalPosts,
      skip,
      limit,
      hasMore,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Like and Unlike Post

export const toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found!" });

    const alreadyLiked = post.likes.includes(userId.toString());
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE POST

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    //checking ownership
    if (post.postedBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Cannot delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.commentedBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Cannot delete this comment" });
    }
    comment.deleteOne();
    await post.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get Single Post

export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("postedBy", "username country")
      .populate("comments.commentedBy", "username country");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//EDIT POST

export const editPost = async (req, res) => {
  try {
    const { id } = req.params; //post id
    const { caption, image } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Cannot edit this post" });
    }
    if (caption) post.caption = caption;
    if (image) post.image = image;

    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ message: "Server error" });
  }
};
