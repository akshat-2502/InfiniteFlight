import { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const CreatePostModal = ({ onClose, onCreated }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.warning("Caption is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");
      onClose();
      onCreated?.(); // Refresh feed or trigger re-fetch
    } catch (err) {
      console.error("Post create error:", err);
      toast.error(err?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-4">
      <div className="bg-zinc-900 text-white rounded-2xl shadow-lg w-full max-w-md p-6 relative border border-zinc-700">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        {/* Caption */}
        <textarea
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 mb-4 text-sm resize-none placeholder-gray-400 text-white"
          rows="4"
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Image Upload */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer text-purple-400 hover:text-purple-300">
            <ImagePlus size={18} />
            <span>Upload Image (optional)</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 w-full rounded-lg border border-zinc-700"
            />
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;
