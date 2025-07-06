import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { login } from "../../redux/userSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import airplaneLoading from "../../assets/animationloading.lottie";

const Login = ({ setLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // 👁️ visibility toggle
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      dispatch(login({ user: res.data.user, token: res.data.token }));
      setPageLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Login failed");
      setPageLoading(false);
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
            LOGIN
          </h2>
          <p className="text-gray-600 mb-6 font-semibold text-sm flex justify-center items-center">
            Join Together || Fly Together || Fly In A Group
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />

            {/* 👁️ Password with toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded pr-10"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-700 transition"
            >
              Login
            </button>

            {error && (
              <p className="text-red-500 font-semibold text-sm text-center">
                {error}
              </p>
            )}
            <p>
              Don't have an account ?{" "}
              <span
                onClick={() => setLogin(false)}
                className="text-blue-500 cursor-pointer font-semibold"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
