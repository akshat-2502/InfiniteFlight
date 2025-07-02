import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { addComment, createPost } from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", authenticateUser, createPost);
router.post("/:postId/comment", authenticateUser, addComment);

export default router;
