import React, { useEffect } from "react";
import Authorization from "./pages/auth/Authorization";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserFromToken } from "./redux/userSlice"; // ✅ updated import
import HomePage from "./pages/HomePage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserFromToken()); // ✅ fetch user from /users/me on load
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/authentication" element={<Authorization />} />
      </Routes>
    </Router>
  );
};

export default App;
