import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  getPostsByUser,
  updateMyProfile,
} from "../controller/user.controller.js";
const router = express.Router();

router.get("/me", authenticateUser, getMyProfile);
router.put("/update", authenticateUser, updateMyProfile);
router.get("/:userId/posts", getPostsByUser);

export default router;
