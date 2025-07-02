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
    const posts = await Post.find()
      .populate("postedBy", "username country") //show user and country
      .populate("comments.commentedBy", "username country") //coment
      .sort({ createdAt: -1 }); //latest first

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
