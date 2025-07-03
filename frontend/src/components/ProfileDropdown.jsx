import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoggedIn } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!isLoggedIn) {
    return (
      <button
        onClick={() => navigate("/authentication")}
        className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-sm text-sm hover:bg-purple-700 transition"
      >
        Login / Register
      </button>
    );
  }

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <img
        onClick={() => setOpen(!open)}
        src={user?.profileImage || "https://via.placeholder.com/32"}
        alt="profile"
        className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer shadow-md"
      />

      <div
        className={`absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg z-50 transform transition-all duration-300 origin-top ${
          open
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => {
            navigate("/update-profile");
            setOpen(false);
          }}
          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
        >
          Update Profile
        </button>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
