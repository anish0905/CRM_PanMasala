import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineDeliveryDining, MdDashboard, MdInventory } from "react-icons/md";
import { VscThreeBars } from "react-icons/vsc";
import { FiLogOut } from "react-icons/fi";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./SuperStockistSideBar.css";

import { FaLocationDot } from "react-icons/fa6";

export const SuperStockistSideBar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [manageInventory, setManageInventory] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleManageInventoryDropdown = () => {
    setManageInventory((prevState) => !prevState);
  };

  const handleItemClick = (path) => {
    navigate(path);
    setManageInventory(false); // Close the dropdown on item click
  };

  return (
    
      <div className="navbar">
        <div className="top-3 right-2 bg-slate-950 shadow-md rounded-md fixed h-6 w-6 flex justify-center items-center menu-burger">
          <VscThreeBars
            className="text-white font-bold text-xl"
            onClick={toggleSidebar}
          />
        </div>

        <div
          className={`sidebar-container ${showSidebar ? "show-sidebar" : ""
            } flex-col h-full transition-all duration-300 ease-in-out`}
        >
          <div className="sidebar-header">
            <RxCross1 className="menu-burger" onClick={toggleSidebar} />
            <img src={logo} alt="Company Logo" />
          </div>

          <ul className="sidebar-menu mx-4 flex flex-col flex-grow mt-6 Navlist">
            <NavItem
              to="/SuperStockist-Order"
              icon={<MdDashboard style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Dashboard"
              activeRoute={location.pathname}
            />
            <div className="relative">
              <span
                className=" flex items-center gap-4  p-4  hover:bg-blue-500 hover:text-white cursor-pointer rounded-full transition duration-300 ease-in-out "
                onClick={toggleManageInventoryDropdown}
              >
                <MdInventory style={{ color: "#66cccc", fontSize: "2rem" }} />
                <span className="text-lg font-semibold">Manage Inventory</span>
              </span>
              {manageInventory && (
                <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
                  <DropdownItem
                    text="My Inventory"
                    onClick={() => handleItemClick("/manage/superStockist/Inventory")}
                  />
                  
                  <DropdownItem
                    text="Stockist Inventory"
                    onClick={() => handleItemClick("/manage/stockist/stock/superstockist")}
                  />
                </div>
              )}
            </div>
            <NavItem
              to="/superStockitDetailsDeliveryboyDetails"
              icon={<MdOutlineDeliveryDining style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Delivery Details"
              activeRoute={location.pathname}
            />
            <NavItem
              to="/fetchLocation"
              icon={<FaLocationDot  style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Fetch Location"
              activeRoute={location.pathname}
            />
            <NavItem
              onClick={handleLogOut}
              icon={<FiLogOut style={{ color: "#66cccc", fontSize: "2rem" }} />}
              text="Logout"
              isButton
            />
            
          </ul>
        </div>
      </div>
    
  );
};

const NavItem = ({ to, icon, text, onClick, isButton = false, activeRoute }) => {
  const navItemStyle =
    "py-3 px-4 my-2 hover:bg-blue-500 hover:text-white flex items-center cursor-pointer rounded-full transition duration-300 ease-in-out";

  return isButton ? (
    <button onClick={onClick} className={navItemStyle}>
      <span className="flex items-center">
        <span className="mr-8 icon">{icon}</span>
        <span className="text-lg font-semibold">{text}</span>
      </span>
    </button>
  ) : (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${navItemStyle} ${isActive || activeRoute === to ? "bg-blue-500 text-white" : ""}`
      }
    >
      <span className="flex items-center">
        <span className="mr-8 icon">{icon}</span>
        <span className="text-lg font-semibold">{text}</span>
      </span>
    </NavLink>
  );
};



const DropdownItem = ({ text, onClick }) => (
  <div
    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer rounded-full"
    onClick={onClick}
  >
    {text}
  </div>
);
