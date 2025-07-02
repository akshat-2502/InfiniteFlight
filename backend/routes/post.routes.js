import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  editPost,
  getAllPosts,
  getSinglePost,
  toggleLikePost,
} from "../controller/post.controller.js";
import {
  commentRateLimiter,
  postRateLimiter,
} from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create", authenticateUser, postRateLimiter, createPost);

router.post(
  "/:postId/comment",
  authenticateUser,
  commentRateLimiter,
  addComment
);

router.get("/", getAllPosts);
router.put("/:id/like", authenticateUser, toggleLikePost);
router.delete("/:id", authenticateUser, deletePost);
router.delete("/:postId/comment/:commentId", authenticateUser, deleteComment);
router.get("/:id", getSinglePost);
router.put("/:id", authenticateUser, editPost);

export default router;
