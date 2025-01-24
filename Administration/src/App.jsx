import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Admin/Login";
import AdminDashbord from "./pages/Admin/AdminDashbord";
import SubAdminDashboard from "./pages/SubAdmin/dashboard/Dashboard";
import SuperStockistDetails from "./pages/SubAdmin/superStockist/SuperStockistDetails";

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

      <Route path="/SuperStockistDetails" element={<SuperStockistDetails />} />
    </Routes>
  );
}

export default App;
