import rateLimit from "express-rate-limit";

// Limit: max 5 post creations per minute per IP
export const postRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    message: "Too many posts created. Please wait a minute and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const commentRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Max 10 comments per minute
  message: {
    message: "Too many comments. Please wait a minute and try again.",
  },
});
