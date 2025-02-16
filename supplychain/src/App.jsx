import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/CNF/Login";

import CNFDashbord from "./pages/CNF/CNFDashbord";
// import SubAdminDashboard from "./pages/SubAdmin/dashboard/Dashboard";
import SuperStockistDetails from "./pages/CNF/superStockist/SuperStockistDetails";
import SuperStockistdashboard from "./pages/SuperStockists/SuperStockistdashboard";
import SuperStockistDistributorDetails from "./pages/SuperStockists/distributor/SuperStockistDistributorDetails";
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
import AddInventory from "./pages/inventory/Addinventory";
import MyInventory from "./pages/inventory/MyInventory";
import StockHistory from "./pages/inventory/StockHistory";
import DispatchInventory from "./pages/inventory/DispatchInventory";
import DispatchHistory from "./pages/inventory/DispatchHistory";
import AllUserInventoryDashbord from "./pages/inventory/AllUserInventoryDashbord";
import DistributorDispatchInventory from "./pages/inventory/DistributorDispatchInventory";
import { RequirestInventory } from "./pages/inventory/RequirestInventory";

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
      <Route path="/DistributerDashBoard" element={<DistributerDashBoard />} />
      <Route path="/manage/:name/:work" element={<FEA />} />
      <Route path="/FEARegistaionForm" element={<FEARegistaionForm />} />
      <Route path="/FE" element={<FE />} />
      <Route
        path="/manage/superstockist/:name/:role"
        element={<SuperStockistDetails />}
      />

      <Route
        path="/manage/cnf/distributor/:name/:role"
        element={<Distributors />}
      />
      <Route
        path="/manage/cnf/:name/:id"
        element={<DistributorsDetails />}
      />

      <Route
        path="/manage/distributor/:name/:role"
        element={<SuperStockistDistributorDetails />}
      />

      <Route path="/manage/userProfile/:role" element={<UserProfile />} />


      <Route
        path="/add-inventory/:role"
        element={<AddInventory />}
      />
      <Route
        path="/my-inventory/:role"
        element={<MyInventory />}
      />
      <Route
        path="/Stock-History/:role"
        element={<StockHistory />}
      />

      <Route
        path="/Dispatch-Inventory/:role"
        element={<DispatchInventory />}
      />

      <Route
        path="/Dispatch-History/:role"
        element={<DispatchHistory />}
      />


      <Route
        path="/manage/Inventory/:id/:role/:currentUser"
        element={<AllUserInventoryDashbord />}

      />

      <Route
        path="/Dispatch-Inventory"
        element={<DistributorDispatchInventory />}

      />

      <Route
        path="/requiest/:role"
        element={<RequirestInventory />}

      />





    </Routes>
  );
}

export default App;
