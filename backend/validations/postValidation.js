import Joi from "joi";

// Schema for creating a post
export const createPostSchema = Joi.object({
  caption: Joi.string().required().max(1000),
  image: Joi.string().uri().optional().allow(""), // allow "" for no image
});

// Schema for adding a comment
export const commentSchema = Joi.object({
  text: Joi.string().required().max(300),
});
