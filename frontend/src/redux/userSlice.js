import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // 🔥 also remove token
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

// ✅ Thunk: fetch user from backend using token
export const fetchUserFromToken = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axiosInstance.get("/users/me");
    dispatch(login({ user: res.data, token }));
  } catch (error) {
    console.error("Auto-login failed", error);
    dispatch(logout());
  }
};
