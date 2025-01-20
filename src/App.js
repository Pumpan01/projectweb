import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./main/WelcomePage"; // หน้า Welcome
import HomePage from "./main/home"; // นำเข้า home.js
import UserManagement from "./main/user"; // นำเข้า user.js
import RepairPage from "./main/repair"; // นำเข้า repair.js
import Announcements from "./main/announcements"; // นำเข้า announcements.js

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} /> {/* หน้าเริ่มต้น */}
        <Route path="/home" element={<HomePage />} /> {/* เส้นทางสำหรับ home.js */}
        <Route path="/user" element={<UserManagement />} /> {/* เส้นทางสำหรับ user.js */}
        <Route path="/repair" element={<RepairPage />} /> {/* เส้นทางสำหรับ repair.js */}
        <Route path="/announcements" element={<Announcements />} /> {/* เส้นทางสำหรับ announcements.js */}
      </Routes>
    </Router>
  );
}

export default App;
