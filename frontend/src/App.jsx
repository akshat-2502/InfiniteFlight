import React from "react";
import Authorization from "./pages/auth/Authorization";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authentication" element={<Authorization />} />
      </Routes>
    </Router>
  );
};

export default App;
