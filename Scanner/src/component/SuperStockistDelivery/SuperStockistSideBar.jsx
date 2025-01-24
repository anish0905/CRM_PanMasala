import React, { useState } from "react";
import "./SuperStockistSideBar.css"; // Assuming you have a CSS file for styling
import { RxCross1 } from "react-icons/rx";
import logo from "../../assets/logo.png";
import { MdOutlineDeliveryDining, MdDashboard, MdHistory } from "react-icons/md"; // Icons for Dashboard and Orders
import { FiLogOut, FiUser } from "react-icons/fi"; // Icons for Logout and Profile
import { VscThreeBars } from "react-icons/vsc"; // Burger menu icon
import { HiBell, HiSupport } from "react-icons/hi"; // Icons for Notifications and Help
import { useLocation, useNavigate } from "react-router-dom";

export const SuperStockistSideBar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handlelogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <div className="top-3 left-5 bg-slate-950 shadow-md rounded-md fixed h-6 w-6 flex justify-center items-center content-center menu-burger">
          <VscThreeBars
            className="text-white font-bold text-xl"
            onClick={toggleSidebar}
          />
        </div>

        <div
          className={`sidebar-container ${showSidebar ? "show-sidebar" : ""} flex-col h-full transition-all duration-300 ease-in-out`}
        >
          <div className="sidebar-header">
            <RxCross1 className="menu-burger" onClick={toggleSidebar} />
            <img src={logo} alt="Logo" />
          </div>

          <ul className="sidebar-menu mx-4 flex flex-col flex-grow mt-6 Navlist">
            <NavItem
              href="/Dashboard"
              icon={<MdDashboard style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Dashboard"
              activeRoute={location.pathname}
            />
            <NavItem
              href="/My-Orders"
              icon={<MdOutlineDeliveryDining style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Orders"
              activeRoute={location.pathname}
            />
            
   
           
            <NavItem
              href="/help"
              icon={<HiSupport style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Help"
              activeRoute={location.pathname}
            />
            <NavItem
              href="#"
              icon={<FiLogOut style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Logout"
              onClick={handlelogOut}
              isButton
            />
          </ul>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ href, icon, text, onClick, isButton = false, activeRoute }) => {
  const isActive = href === activeRoute; // Compare the current path with the href
  const activeClass = isActive ? "bg-blue-500 text-white" : ""; // Add active background class

  if (isButton) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:text-white rounded-full ${activeClass}`}
      >
        <span className="flex items-center">
          <span className="mr-8 icon">{icon}</span>
          <span className="text-lg font-semibold">{text}</span>
        </span>
      </button>
    );
  }

  return (
    <a
      href={href}
      className={`flex items-center p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:text-white rounded-full ${activeClass}`}
    >
      <span className="flex items-center">
        <span className="mr-8 icon">{icon}</span>
        <span className="text-lg font-semibold">{text}</span>
      </span>
    </a>
  );
};
