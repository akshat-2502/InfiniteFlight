import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import flightRoutes from "./routes/flight.routes.js";
dotenv.config();
connectDatabase();

const app = express();
app.use(
  cors({
    origin: "https://infiniteflight.onrender.com", // replace when frontend is deployed
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Infinite Flight");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/flights", flightRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
