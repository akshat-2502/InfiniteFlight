import mongoose from "mongoose";

// Comment Subschema
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Post Schema
const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    image: { type: String }, // Optional image URL or path
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
