import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./main/WelcomePage";
import HomePage from "./main/home"; // หากไฟล์ชื่อ home.js
import UserPage from "./main/user"; // นำเข้าไฟล์ user.js

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} /> {/* เส้นทางสำหรับ user.js */}
      </Routes>
    </Router>
  );
}

export default App;
