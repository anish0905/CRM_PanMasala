import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/CNF/Login";

import CNFDashbord from "./pages/CNF/CNFDashbord";
// import SubAdminDashboard from "./pages/SubAdmin/dashboard/Dashboard";
import SuperStockistDashbord from "./pages/SuperStockists/SuperStockistDashbord";
import SuperStockistDetails from "./pages/CNF/superStockist/SuperStockistDetails"
function App() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const location = useLocation();
  const { pathname } = location;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/CNFDashBoard" element={<CNFDashbord />} />
      <Route
        path="/SuperStockistDashBoard"
        element={<SuperStockistDashbord />}
      />
      {/* 
      <Route path="/SubadminDashBoard" element={<SubAdminDashboard />} /> */}
      {/* <Route
        path="/manage/Sub-Admin/:name/:role"
        element={<SubAdminDetails />}
      />
      <Route path="/manage/CNF/:name/:role" element={<CNFDetails />} /> */}

      <Route
        path="/manage/superstockist/:name/:role"
        element={<SuperStockistDetails />}
      />
    </Routes>
  );
}

export default App;
