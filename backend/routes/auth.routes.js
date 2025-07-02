import express from "express";
import { loginUser, registerUser } from "../controller/auth.controller.js";
import parser from "../middleware/cloudinaryUpload.js";
const router = express.Router();

router.post("/register", parser.single("profileImage"), registerUser);
router.post("/login", loginUser);

export default router;
