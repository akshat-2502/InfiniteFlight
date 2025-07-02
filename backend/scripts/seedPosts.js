import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../models/Post.js";
import User from "../models/User.js";

dotenv.config();

// connect to DB
await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

// get a user to use as postedBy
const user = await User.findOne();
if (!user) {
  console.log("No user found. Please create a user first.");
  process.exit(1);
}

// create 50 dummy posts
const posts = [];

for (let i = 1; i <= 50; i++) {
  posts.push({
    caption: `Sample Post ${i}`,
    image: "", // you can use a static image URL if needed
    postedBy: user._id,
    comments: [],
    likes: [],
  });
}

await Post.insertMany(posts);
console.log("50 dummy posts inserted.");

process.exit();
