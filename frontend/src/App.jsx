import React, { useEffect } from "react";
import Authorization from "./pages/auth/Authorization";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "./redux/userSlice";
import HomePage from "./pages/HomePage";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUserFromLocalStorage());
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
