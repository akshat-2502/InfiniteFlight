import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "infinite-flight/posts", // This folder will be created automatically in your Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

const parser = multer({ storage });

export default parser;
