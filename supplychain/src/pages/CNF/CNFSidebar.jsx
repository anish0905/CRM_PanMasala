import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./CNFSidebar.css";
// import "../../Styles/Styles.css";
import logo from "../../assets/logo.png";
import { FaShoppingCart, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import {
  MdOutlineManageAccounts,
  MdOutlineEventAvailable,
  MdInventory,
} from "react-icons/md";

import { TbReport } from "react-icons/tb";
import { GiGlassBall, GiShop } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import Swal from 'sweetalert2';

const CNFSidebar = ({ onClose }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [distributorDropdown, setDistributorDropdown] = useState(false);
  const [vendorDropdown, setVendorDropdown] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [trackerDropdown, setTrackerDropdown] = useState(false);
  const [nearByDropdown, setNearByDropdown] = useState(false);
  const [manageInventory, setManageInventory] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggledistributorDropdown = () =>
    setDistributorDropdown(!distributorDropdown);
  const toggleVendorDropdown = () => setVendorDropdown(!vendorDropdown);
  const toggleShopDropdown = () => setShopDropdown(!shopDropdown);
  const toggleTrackerDropdown = () => setTrackerDropdown(!trackerDropdown);
  const toggleNearByDropdown = () => setNearByDropdown(!nearByDropdown);
  const togglemanageInventoryDropdown = () =>
    setManageInventory(!manageInventory);

  const handleItemClick = (route) => {
    if (route) {
      navigate(route);
    }
    if (onClose) {
      onClose();
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const handleLogout = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to log out? Make sure to finish your tasks before logging out.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!',
        cancelButtonText: 'Causal logout!',
      }).then((result) => {
        if (result.isConfirmed) {
          
          navigate('/Attendance/CNF/logout'); // Navigate to logout route
        } else if (result.isDismissed) {
          localStorage.clear(); 
          navigate('/'); // Navigate to home page
        }
      });
    };

  return (
    <div className="sidebar flex flex-col h-full w-64 bg-gray-800 text-black shadow-lg">
      <div className="sidebar-header p-4 flex items-center justify-center bg-gray-900">
        <img src={logo} alt="Logo" className="w-full h-full" />
      </div>
      <ul className="sidebar-menu mx-4 flex flex-col flex-grow mt-6 ">
        <NavItem
          icon={<RxDashboard style={{ color: "#eab308", fontSize: "2rem" }} />}
          text="Dashboard"
          onClick={() => handleItemClick("/managementDashboard")}
        />

        <NavItem
          icon={<GiGlassBall style={{ color: "#eab308", fontSize: "2rem" }} />}
          text="Show Case"
          onClick={() => handleItemClick("/showCase")}
        />
        <NavItem
          icon={
            <FaShoppingCart style={{ color: "#047857", fontSize: "2rem" }} />
          }
          text="Orders"
          onClick={() => handleItemClick("/orderHistory")}
        />
        <div className="relative">
          <span
            className="nav-item nav-item-dropdown flex items-center gap-4 cursor-pointer p-4 transition duration-300 ease-in-out transform rounded-full mb-2"
            onClick={togglemanageInventoryDropdown}
          >
            <MdInventory style={{ color: "blue", fontSize: "2rem" }} />
            <span className="text-lg font-semibold">Manage Inventory</span>
          </span>
          {manageInventory && (
            <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
              <DropdownItem
                text="My Inventory"
                onClick={() => handleItemClick("/manage/Inventory")}
              />

              <DropdownItem
                text="Super Stockist Inventory"
                onClick={() =>
                  handleItemClick("/manage/superStockit/Inventory")
                }
              />
              <DropdownItem
                text="Stockist Inventory"
                onClick={() =>
                  handleItemClick("/manage/stockist/stock/management")
                }
              />
            </div>
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <span
            className="nav-item nav-item-dropdown flex items-center gap-4 cursor-pointer p-4 transition duration-300 ease-in-out transform rounded-full mb-2"
            onClick={toggleDropdown}
          >
            <FaUserPlus style={{ color: "violet", fontSize: "2rem" }} />
            <span className="text-lg font-semibold">Super Stockist</span>
          </span>
          {showDropdown && (
            <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
              <DropdownItem
                text="Add Super Stockist"
                onClick={() =>
                  handleItemClick("/manage/superstockist/Registration/CNF")
                }
              />
              <DropdownItem
                text="superStockist details"
                onClick={() =>
                  handleItemClick("/manage/superstockist/Super-Stockist/CNF")
                }
              />
            </div>
          )}
        </div>

        <div className="relative">
          <span
            className="nav-item nav-item-dropdown flex items-center gap-4 cursor-pointer p-4 transition duration-300 ease-in-out transform rounded-full mb-2"
            onClick={toggledistributorDropdown}
          >
            <MdOutlineManageAccounts
              style={{ color: "#047857", fontSize: "2rem" }}
            />
            <span className="text-lg font-semibold">Distributor</span>
          </span>
          {distributorDropdown && (
            <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
              <DropdownItem
                text="Distributor"
                onClick={() =>
                  handleItemClick(
                    "/manage/cnf/distributor/supertockist-distributor/CNF"
                  )
                }
              />
            </div>
          )}
        </div>

        <NavItem
          icon={
            <CgProfile style={{ color: "#047857", fontSize: "2rem" }} />
           
          }
          text="My Profile"
          onClick={() =>
            handleItemClick("/manage/userProfile/cnf")
           
          }
        />
        <LogoutItem
          icon={<FaSignOutAlt style={{ color: "gray", fontSize: "2rem" }} />}
          text="Logout"
          onClick={handleLogout}
        />
      </ul>
    </div>
  );
};

const NavItem = ({ icon, text, onClick }) => (
  <div
    className="nav-item flex items-center p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:text-white rounded-full mb-2 cursor-pointer"
    onClick={onClick}
  >
    <span className="flex items-center">
      <span className="mr-8">{icon}</span>
      <span className="text-lg font-semibold">{text}</span>
    </span>
  </div>
);

const DropdownItem = ({ text, onClick }) => (
  <div
    className="block px-6 py-3 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer rounded-full"
    onClick={onClick}
  >
    {text}
  </div>
);

const LogoutItem = ({ icon, text, onClick }) => (
  <div
    className="nav-item flex items-center p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:text-white rounded-full mb-2 cursor-pointer"
    onClick={onClick}
  >
    <span className="flex items-center">
      <span className="mr-8">{icon}</span>
      <span className="text-lg font-semibold">{text}</span>
    </span>
  </div>
);

export default CNFSidebar;
