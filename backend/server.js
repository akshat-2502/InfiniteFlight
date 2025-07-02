import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
connectDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Infinite Flight");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port :- ", process.env.PORT);
});
