import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <div className="relative ml-4">
      <img
        onClick={() => setOpen(!open)}
        src={user?.profileImage || "https://via.placeholder.com/32"}
        alt="profile"
        className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer"
      />
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-2 z-50">
          {isLoggedIn ? (
            <>
              <p className="px-4 py-2 text-sm text-white hover:bg-zinc-700 cursor-pointer">
                Update Profile
              </p>
              <p
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 cursor-pointer"
              >
                Logout
              </p>
            </>
          ) : (
            <>
              <p className="px-4 py-2 text-sm text-white hover:bg-zinc-700 cursor-pointer">
                Login
              </p>
              <p className="px-4 py-2 text-sm text-white hover:bg-zinc-700 cursor-pointer">
                Register
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
