import Post from "../models/Post.js";
import User from "../models/User.js";

//gettig current user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//updating user data

export const updateMyProfile = async (req, res) => {
  try {
    const { username, country } = req.body; // Only extract text fields
    const updatedData = {};

    if (username) updatedData.username = username;
    if (country) updatedData.country = country;

    // If image was uploaded via Cloudinary
    if (req.file && req.file.path) {
      updatedData.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//get post by specific user
export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const totalPosts = await Post.countDocuments({ postedBy: userId });

    const posts = await Post.find({ postedBy: userId })
      .populate("postedBy", "username country profileImage")
      .populate("comments.commentedBy", "username country profileImage")
      .sort({ createdAt: -1 })
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
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
