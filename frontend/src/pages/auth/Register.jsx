import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // use plain axios here for multipart
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import airplaneLoading from "../../assets/animationloading.lottie";

const Register = ({ setLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageLoading(true);
    setError("");

    if (!profileImage) {
      setError("Please upload a profile image.");
      setPageLoading(false); // also stop loader
      return; // ✅ this must be here
    }

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("country", formData.country);
      data.append("profileImage", profileImage); // actual file

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("token", res.data.token);
      dispatch(login({ user: res.data.user, token: res.data.token }));
      setPageLoading(false);
      navigate("/");
    } catch (err) {
      setPageLoading(false);
      console.error(err);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <>
      {pageLoading ? (
        <DotLottieReact src={airplaneLoading} loop autoplay />
      ) : (
        <div className="w-[90%] md:w-1/2 flex relative flex-col justify-center p-10">
          <button
            onClick={() => navigate("/")}
            className="absolute top-2 left-2 text-white cursor-pointer font-bold w-30 rounded-xl py-2 px-3 bg-blue-600 flex justify-center items-center"
          >
            <ArrowLeft /> HOME
          </button>
          <h2 className="text-3xl font-extrabold mb-2 mt-6 font-sans flex justify-center text-zinc-700">
            CREATE AN ACCOUNT
          </h2>
          <p className="text-gray-600 mb-6 font-semibold text-sm flex justify-center items-center">
            Join Together || Fly Together || Fly In A Group
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded pr-10"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            {profileImage && (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-full mt-2"
              />
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Register
            </button>
            <p>
              Already have an account ?{" "}
              <span
                onClick={() => setLogin(true)}
                className="text-blue-500 cursor-pointer font-semibold"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
