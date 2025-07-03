import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
    },
    setUserFromLocalStorage(state) {
      const userData = localStorage.getItem("user");
      if (userData) {
        state.user = JSON.parse(userData);
        state.isLoggedIn = true;
      }
    },
  },
});
export const { login, logout, setUserFromLocalStorage } = userSlice.actions;
export default userSlice.reducer;
