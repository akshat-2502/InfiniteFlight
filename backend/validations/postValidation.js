import Joi from "joi";

// Schema for creating a post
export const createPostSchema = Joi.object({
  caption: Joi.string().required().max(1000),
});

// Schema for adding a comment
export const commentSchema = Joi.object({
  text: Joi.string().required().max(300),
});
