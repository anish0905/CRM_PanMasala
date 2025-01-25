import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Admin/Login";
import AdminDashbord from "./pages/Admin/AdminDashbord";
import SubAdminDashboard from "./pages/SubAdmin/dashboard/Dashboard";
import SuperStockistDetails from "./pages/SubAdmin/superStockist/SuperStockistDetails";

import SubAdminDetails from "./pages/Admin/subAdmin/SubAdminDetails";
import CNFDetails from "./pages/Admin/CNF/CNFDetails";
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
      <Route
        path="/manage/Sub-Admin/:name/:role"
        element={<SubAdminDetails />}
      />
      <Route path="/manage/CNF/:name/:role" element={<CNFDetails />} />

      <Route
        path="/manage/superstockist/:name/:role"
        element={<SuperStockistDetails />}
      />
    </Routes>
  );
}

export default App;
