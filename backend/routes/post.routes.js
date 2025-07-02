import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  addComment,
  createPost,
  getAllPosts,
} from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", authenticateUser, createPost);
router.post("/:postId/comment", authenticateUser, addComment);
router.get("/", getAllPosts);

export default router;
