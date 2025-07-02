import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { createPost } from "../controller/post.controller";

const router = express.Router();

router.post("/create", authenticateUser, createPost);

export default router;
