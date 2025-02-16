import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SuperStockistSidebar.css";
// import "../../Styles/Styles.css";
import logo from "../../../assets/logo.png";
import { FaShoppingCart, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { RiUserLocationFill } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { GiGlassBall } from "react-icons/gi";
import {
  MdOutlineDeliveryDining,
  MdOutlineManageAccounts,
  MdOutlineEventAvailable,
  MdInventory,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Swal from 'sweetalert2';

const SuperStockistSidebar = ({ onClose }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [manageDropdown, setManageDropdown] = useState(false);
  const [vendorDropdown, setVendorDropdown] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [trackerDropdown, setTrackerDropdown] = useState(false);
  const [AttendanceDropdown, setAttendanceDropdown] = useState(false);
  const [nearByDropdown, setNearByDropdown] = useState(false);
  const [manageInventory, setManageInventory] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const togglemanageDropdown = () => setManageDropdown(!manageDropdown);
  const toggleVendorDropdown = () => setVendorDropdown(!vendorDropdown);
  const toggleShopDropdown = () => setShopDropdown(!shopDropdown);
  const toggleTrackerDropdown = () => setTrackerDropdown(!trackerDropdown);
  const toggleAttendanceDropdown = () =>
    setAttendanceDropdown(!AttendanceDropdown);
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
         
         navigate('/Attendance/superStockist/logout'); // Navigate to logout route
       } else if (result.isDismissed) {
         localStorage.clear(); 
         navigate('/'); // Navigate to home page
       }
     });
   };

  return (
    <div className="sidebar flex flex-col h-full w-80 bg-gray-800 text-black shadow-lg">
      <div className="sidebar-header p-4 flex items-center justify-center bg-gray-900 sm:mb-1.5">
        <img src={logo} alt="Logo" className="w-full h-full" />
      </div>
      <ul className="sidebar-menu mx-4 my-1 flex flex-col flex-grow mt-6 ">
        <NavItem
          icon={<RxDashboard style={{ color: "#eab308", fontSize: "2rem" }} />}
          text="Dashboard"
          onClick={() => handleItemClick("/SuperStockistDashBoard")}
        />

        <NavItem
          icon={<GiGlassBall style={{ color: "#eab308", fontSize: "2rem" }} />}
          text="Show-Case "
          onClick={() => handleItemClick("/ShowcaseProduct")}
        />
        <NavItem
          icon={
            <FaShoppingCart style={{ color: "#047857", fontSize: "2rem" }} />
          }
          text="Orders"
          onClick={
            () => handleItemClick()
            // "/order"
          }
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
                text="Received Inventory"
                onClick={() => handleItemClick("/add-inventory/superstockist")}
              />
              <DropdownItem
                text="My Inventory"
                onClick={() => handleItemClick("/my-inventory/superstockist")}
              />


              <DropdownItem
                text="Stock History"
                onClick={() => handleItemClick("/Stock-History/superstockist")}
              />

              <DropdownItem
                text="Dispatch Inventory"
                onClick={() => handleItemClick("/Dispatch-Inventory/superstockist")}
              />

              <DropdownItem
                text="Dispatch History"
                onClick={() => handleItemClick("/Dispatch-History/superstockist")}
              />


              <DropdownItem
                text="Distributor Inventory"
                onClick={() =>
                  handleItemClick("/manage/distributor/inventory/superStockist")
                }
              />
              <DropdownItem
                text="Requirest inventory"
                onClick={() => handleItemClick("/requiest/superstockist")}
              />
            </div>
          )}
        </div>
        <div className="relative">
          <span
            className="nav-item nav-item-dropdown flex items-center gap-4 cursor-pointer p-4 transition duration-300 ease-in-out transform rounded-full mb-2"
            onClick={togglemanageDropdown}
          >
            <MdOutlineManageAccounts
              style={{ color: "#047857", fontSize: "2rem" }}
            />
            <span className="text-lg font-semibold">Manage Distributor </span>
          </span>
          {manageDropdown && (
            <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
              <DropdownItem
                text="Add-Distributor "
                onClick={() =>
                  handleItemClick(
                    "/manage/distributor/Registration/superStockist"
                  )
                }
              />
               
              <DropdownItem
                text="Distributor Details"
                onClick={() => handleItemClick("/manage/distributor/user/superStockist")}
              />
              <DropdownItem
                text="Distributor Inventory"
                onClick={() =>
                  handleItemClick("/manage/distributor/inventory/superStockist")
                }
              />
              {/* <DropdownItem text="Report" onClick={() => handleItemClick("")} /> */}

            </div>
          )}
        </div>


        <NavItem
          icon={
            <CgProfile style={{ color: "#047857", fontSize: "2rem" }} />
           
          }
          text="My Profile"
          onClick={() =>
            handleItemClick("/manage/userProfile/superstockist")
           
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
    className="nav-item flex items-center p-4 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-95 hover:text-white rounded-full mb-2 cursor-pointer"
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
    className=" nav-item-dropdown block px-6 py-3 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer rounded-full"
    onClick={onClick}
  >
    {text}
  </div>
);

const LogoutItem = ({ icon, text, onClick }) => (
  <div
    className="nav-item flex items-center p-4 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-95 hover:text-white rounded-full mb-2 cursor-pointer"
    onClick={onClick}
  >
    <span className="flex items-center">
      <span className="mr-8">{icon}</span>
      <span className="text-lg font-semibold">{text}</span>
    </span>
  </div>
);

export default SuperStockistSidebar;
