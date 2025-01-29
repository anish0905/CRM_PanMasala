import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/CNF/Login";

import CNFDashbord from "./pages/CNF/CNFDashbord";
// import SubAdminDashboard from "./pages/SubAdmin/dashboard/Dashboard";
import SuperStockistDetails from "./pages/CNF/superStockist/SuperStockistDetails";
import SuperStockistdashboard from "./pages/SuperStockists/SuperStockistdashboard";
import DistributorDetails from "./pages/SuperStockists/distributor/DistributorDetails";
import DistributerDashBoard from "./pages/Distributer/dashboard/DistributerDashBoard";
import DistributorProductReport from "./Component/Showcase/ShowcaseProductReport";
import FEA from "./pages/Distributer/FEA&FE/FEA.Details";
import FE from "./pages/Distributer/FEA&FE/FE.Details";
import FEARegistaionForm from "./pages/Distributer/FEA&FE/FEA_Register_Form";
import Distributors from "./pages/CNF/distributors/Distributors";
import DistributorsDetails from "./pages/CNF/distributors/DistributorsDetails";
import MakeAttendance from "./pages/Attendance/Camera/Makeattendance";
import ShowcaseProduct from "./Component/Showcase/ShowcaseProduct";
import ShowcaseProductReport from "./Component/Showcase/ShowcaseProductReport";
import ShowCase from "./Component/Showcase/ShowCase";
import AttendanceRecord from "./pages/Attendance/attendanceRecord/AttendanceRecord";
import UserProfile from "./pages/UserProfile/userProfile";

function App() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const location = useLocation();
  const { pathname } = location;

  return (
    <Routes>
      <Route path="/showCase" element={<ShowCase />} />
      <Route path="/Attendance/:role/:work" element={<MakeAttendance />} />
      <Route path="/" element={<Login />} />
      <Route path="/CNFDashBoard" element={<CNFDashbord />} />
      <Route
        path="/SuperStockistDashBoard"
        element={<SuperStockistdashboard />}
      />
      // showcase
      <Route
        path="/ShowcaseProductReport"
        element={<ShowcaseProductReport />}
      />
      <Route path="/ShowcaseProduct" element={<ShowcaseProduct />} />
      // Distributer
      <Route path="/DistributorDashBoard" element={<DistributerDashBoard />} />
      <Route
        path="/DistributorProductReport"
        element={<DistributorProductReport />}
      />
      <Route path="/FEA" element={<FEA />} />
      <Route path="/DistributerDashBoard" element={<DistributerDashBoard />} />
      <Route path="/FEA/:work" element={<FEA />} />
      <Route path="/FEARegistaionForm" element={<FEARegistaionForm />} />
      <Route path="/FE" element={<FE />} />
      <Route
        path="/manage/superstockist/:name/:role"
        element={<SuperStockistDetails />}
      />
      <Route
        path="/manage/distributor/:name/:role"
        element={<DistributorDetails />}
      />
      <Route
        path="/manage/cnf/distributor/:name/:role"
        element={<Distributors />}
      />
      <Route
        path="/manage/cnf/distributor/:id"
        element={<DistributorsDetails />}
      />

      <Route
        path="/manage/userProfile/:role"
        element={<UserProfile />}
      />

    </Routes>
  );
}

export default App;
