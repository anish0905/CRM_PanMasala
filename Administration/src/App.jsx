import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Admin/Login";
import AdminDashbord from "./pages/Admin/AdminDashbord";
import SubAdminDashboard from "./pages/SubAdmin/dashboard/Dashboard";
import SuperStockistDetails from "./pages/SubAdmin/superStockist/SuperStockistDetails";

import SubAdminDetails from "./pages/Admin/subAdmin/SubAdminDetails";
import CNFDetails from "./pages/Admin/CNF/CNFDetails";
import AddProduct from "./pages/Admin/Product/AddProduct";
import VendorRegisterIntrsted from "./pages/Admin/Vendor/VendorRegisterIntrsted";
import VendorRegisterIntrsteds from "./pages/SubAdmin/Vendor/VendorRegisterIntrsted";
import VendorNotInterested from "./pages/Admin/Vendor/VendorNotIntrested";
import FEADetails from "./pages/Admin/FEA/FEADetails";
import { ContentHistory } from "./pages/Admin/Vendor/ContentHistory";
import AttendanceRecordDashboard from "./pages/Admin/Attendance/AttendanceRecordDashboard";
import DistributorDetails from "./pages/Admin/Distributor/DistributorDetails";
import ShowCase from "./pages/SubAdmin/showCase/ShowCase";

import MakeAttendance from "./pages/Attendance/Camera/Makeattendance";
import Addinventory from "./pages/Admin/inventory/Addinventory";
import AdminInventory from "./pages/Admin/inventory/AdminInventroy";
import StockHistory from "./pages/Admin/inventory/StockHistory";
import DispatchInventory from "./pages/Admin/inventory/DispatchInventory";
function App() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const location = useLocation();
  const { pathname } = location;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Attendance/:role/:work" element={<MakeAttendance />} />
      <Route path="/AdminDashBoard" element={<AdminDashbord />} />

      <Route path="/SubadminDashBoard" element={<SubAdminDashboard />} />
      <Route path="/showCase" element={<ShowCase />} />
      <Route
        path="/manage/Sub-Admin/:name/:role"
        element={<SubAdminDetails />}
      />
      <Route path="/manage/CNF/:name/:role" element={<CNFDetails />} />

      <Route
        path="/manage/superstockist/:name/:role"
        element={<SuperStockistDetails />}
      />
      <Route path="/Add-product" element={<AddProduct />} />

      <Route path="/mange/vendor/:name" element={<VendorRegisterIntrsted />} />

      <Route
        path="/mange/vendors/:name"
        element={<VendorRegisterIntrsteds />}
      />

      <Route
        path="/mange/vendor/Not-intrested"
        element={<VendorNotInterested />}
      />

      <Route
        path="/Field-Executive-Approval/:name/:work"
        element={<FEADetails />}
      />

      <Route path="/manage/vendor/history/" element={<ContentHistory />} />

      <Route
        path="/Attendance-Dashboard"
        element={<AttendanceRecordDashboard />}
      />
      <Route
        path="/manage/Distributor/:name/:role"
        element={<DistributorDetails />}
      />

      <Route
        path="/add-inventory/:role"
        element={<Addinventory />}
      />
      <Route
        path="/my-inventory/:role"
        element={<AdminInventory />}
      />

      <Route
        path="/Stock-History/:role"
        element={<StockHistory />}
      />

      <Route
        path="/Dispatch-Inventory/:role"
        element={<DispatchInventory />}
      />


    </Routes>


  );
}

export default App;
