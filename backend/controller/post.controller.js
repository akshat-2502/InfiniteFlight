import Post from "../models/Post";

export const createPost = async (req, res) => {
  try {
    const { caption, image } = req.body;
    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }
    const post = new Post.create({
      caption,
      image,
      postedBy: req.user._id,
    });

    await post.save();

    res.statis(201).json({ message: "Post Created Successfully", post });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};
