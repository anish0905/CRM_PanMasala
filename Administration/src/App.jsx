import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Admin/Login";
import AdminDashbord from "./pages/Admin/AdminDashbord";
import SubAdminDashboard from "./pages/SubAdmin/dashboard/Dashboard";

function App() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const location = useLocation();
  const { pathname } = location;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/AdminDashBoard" element={<AdminDashbord />} />

      <Route path="/SubadminDashBoard" element={<SubAdminDashboard />} />
    </Routes>
  );
}

export default App;
