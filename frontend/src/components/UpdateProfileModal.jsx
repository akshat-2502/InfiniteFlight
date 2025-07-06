import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { X } from "lucide-react";
import { updateUser } from "../redux/userSlice";

const UpdateProfileModal = ({ onClose }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        country: user.country || "",
      });
      setPreviewImage(user.profileImage || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("country", form.country);
      if (selectedFile) {
        formData.append("image", selectedFile); // 🔥 this is the key change
      }

      await dispatch(updateUser(formData));
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-zinc-800 p-6 rounded-xl w-full max-w-md relative animate-fade-in-up">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-white">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Profile Image
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-purple-500 flex items-center justify-center text-gray-400 hover:border-purple-400 transition"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-center text-sm px-2">
                  Tap here to upload
                </span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
