import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  //checking if header exist and start with bearer
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized : Token is missing" });
  }

  const token = authHeader.split(" ")[1]; //extract token after bearer

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next(); //proced to route controller
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized : Token is missing" });
  }
};
