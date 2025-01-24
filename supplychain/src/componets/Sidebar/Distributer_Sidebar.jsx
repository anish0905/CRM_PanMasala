import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/attica-logo.png";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { GiTrophy } from "react-icons/gi";
import { FiRefreshCw, FiFileText } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";
import FieldManagerLocation from "../FieldManagerLocation";
import axios from "axios";
import Swal from "sweetalert2";

// Utility function to map menu names to icons
const getIconByName = (name) => {
  const icons = {
    Dashboard: <RxDashboard style={{ color: "#eab308", fontSize: "2rem" }} />,
    Showcase: <GiTrophy style={{ color: "#eab308", fontSize: "2rem" }} />,
    "Show Case Report": <FiFileText style={{ color: "#eab308", fontSize: "2rem" }} />,
    "Pending Verification": <MdPendingActions style={{ color: "#eab308", fontSize: "2rem" }} />,
    "Re-verification": <FiRefreshCw style={{ color: "#eab308", fontSize: "2rem" }} />,
    Logout: <BiLogOut style={{ color: "gray", fontSize: "2rem" }} />,
  };
  return icons[name] || <RxDashboard style={{ color: "gray", fontSize: "2rem" }} />;
};

const Sidebar = ({ onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const URI = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("fieldManager_Id");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleItemClick = (route) => {
    if (route) navigate(route);
    if (onClose) onClose();
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Have you finished your duty?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, mark as complete!",
        cancelButtonText: "No, just log out",
      });

      if (result.isConfirmed) {
        navigate("/Attendance/logout");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        const resp = await axios.post(`${URI}/api/fieldManager/logout/${userId}`);
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Swal.fire("Error", "An error occurred while logging out", "error");
    }
  };

  const getRouteWidth = () => {
    return location.pathname === "/fieldManagerDashboard" ? "100%" : "80%";
  };

  const menuItems = [
    { text: "Dashboard", route: "/fieldManagerDashboard" },
    { text: "Showcase", route: "/showcase" },
    { text: "Pending Verification", route: "/Pending-Verification" },
    { text: "Re-verification", route: "/Reverification" },
    { text: "Show Case Report", route: "/showcaseList" },
  ];

  return (
    <>
      <FieldManagerLocation />

      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-10 left-8 z-50 ${isSidebarOpen ? "" : "bg-[#1e40af]"} text-white p-3 rounded-full shadow-md`}
      >
        {isSidebarOpen ? <IoCloseSharp /> : <FaBars />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full ${getRouteWidth()} lg:w-80 bg-white text-black shadow-gray-400 border-r border-gray-200 transition-transform duration-300 shadow-md ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static z-40`}
        style={{ height: "100%", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="sidebar-header p-6 flex items-center justify-between bg-gray-600">
          <img src={logo} alt="Logo" className="w-3/4 h-auto" />
          <button
            onClick={toggleSidebar}
            className={`lg:hidden text-white p-2 rounded-full shadow-md ${isSidebarOpen ? "bg-red-700" : ""}`}
          >
            {isSidebarOpen ? <IoCloseSharp /> : <FaBars />}
          </button>
        </div>

        <ul className="sidebar-menu mx-4 flex flex-col flex-grow mt-6">
          {menuItems.map((item, index) => (
            <NavItem key={index} icon={getIconByName(item.text)} text={item.text} onClick={() => handleItemClick(item.route)} />
          ))}
          <LogoutItem icon={getIconByName("Logout")} text="Logout" onClick={handleLogout} />
        </ul>
      </div>
    </>
  );
};

const NavItem = ({ icon, text, onClick }) => (
  <div
    className="nav-item flex items-center p-4 transition duration-300 ease-in-out hover:bg-gray-700 rounded-full mb-2 cursor-pointer m-3"
    onClick={onClick}
  >
    <span className="flex items-center w-full">
      <span className="mr-2">{icon}</span>
      <span className="text-lg font-semibold">{text}</span>
    </span>
  </div>
);

const LogoutItem = ({ icon, text, onClick }) => (
  <div
    className="nav-item flex items-center p-4 transition duration-300 ease-in-out hover:bg-gray-700 rounded-full mb-4 cursor-pointer m-3"
    onClick={onClick}
  >
    <span className="flex items-center w-full">
      <span className="mr-2">{icon}</span>
      <span className="text-lg font-semibold">{text}</span>
    </span>
  </div>
);

export default Sidebar;
