import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  //checking if header exist and start with bearer
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized : Token is missing" });
  }

  const token = authHeader.split(" ")[1]; //extract token after bearer

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next(); //proced to route controller
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized : Token is missing" });
  }
};
