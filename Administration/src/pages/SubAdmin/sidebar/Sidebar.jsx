import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Sidebar.css";
// import "../../Styles/Styles.css";
import logo from "../../../assets/logo.png";
import { FaShoppingCart, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import {
  MdOutlineDeliveryDining,
  MdOutlineManageAccounts,
  MdOutlineEventAvailable,
  MdInventory,
} from "react-icons/md";
import { GiGlassBall, GiShop } from "react-icons/gi";
import { TbReport } from "react-icons/tb";
import Swal from "sweetalert2";

const Sidebar = ({ onClose }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [manageDropdown, setManageDropdown] = useState(false);
  const [vendorDropdown, setVendorDropdown] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [trackerDropdown, setTrackerDropdown] = useState(false);
  const [nearByDropdown, setNearByDropdown] = useState(false);
  const [manageInventory, setManageInventory] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const togglemanageDropdown = () => setManageDropdown(!manageDropdown);
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
      title: "Are you sure?",
      text: "Do you want to log out? Make sure to finish your tasks before logging out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "Causal logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/Attendance/subadmin/logout"); // Navigate to logout route
        navigate("/Attendance/subadmin/logout"); // Navigate to logout route
      } else if (result.isDismissed) {
        localStorage.clear();
        navigate("/"); // Navigate to home page
        localStorage.clear();
        navigate("/"); // Navigate to home page
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
          onClick={() => handleItemClick("/SubadminDashBoard")}
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
                onClick={() => handleItemClick("/my-inventory/subAdmin")}
              />

              <DropdownItem
                text="Stock History"
                onClick={() => handleItemClick("/Stock-History/subAdmin")}
              />

              <DropdownItem
                text="Dispatch Inventory"
                onClick={() => handleItemClick("/Dispatch-Inventory/subAdmin")}
              />
              <DropdownItem
                text="Dispatch History"
                onClick={() => handleItemClick("/Dispatch-History/subAdmin")}
              />

              <DropdownItem
                text="CNF Inventory"
                onClick={() => handleItemClick("/manage/CNF/inventory/sub-Admin")}
              />

              <DropdownItem
                text="Super Stockist Inventory"
                onClick={() => handleItemClick("/manage/superstockist/inventory/Sub-Admin")}
              />


              <DropdownItem
                text="Distributor Inventory"
                onClick={() => handleItemClick("/manage/Distributor/inventory/Sub-Admin")}
              />
               <DropdownItem
                text="All Users Inventory"
                onClick={() =>
                  handleItemClick("/manage/allUserInvetory/subAdmin")
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
            <span className="text-lg font-semibold">CNF</span>
          </span>
          {showDropdown && (
            <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
              <DropdownItem
                text="CNF"
                onClick={() =>
                  handleItemClick("/manage/CNF/Registration/sub-Admin")
                }
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
            <span className="text-lg font-semibold">Super Stockist</span>
          </span>
          {manageDropdown && (
            <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
              <DropdownItem
                text="Super Stockist Details"
                onClick={() =>
                  handleItemClick(
                    "/manage/superstockist/Registration/Sub-Admin"
                  )
                }
              />
            </div>
          )}
        </div>

        <div className="relative">
          <span
            className="nav-item nav-item-dropdown flex items-center gap-4 cursor-pointer p-4 transition duration-300 ease-in-out transform rounded-full mb-2"
            onClick={toggleVendorDropdown}
          >
            <MdOutlineManageAccounts
              style={{ color: "#047857", fontSize: "2rem" }}
            />
            <span className="text-lg font-semibold">Manage Vendors</span>
          </span>
          {vendorDropdown && (
            <div className="flex justify-start ml-10 flex-col font-semibold text-xl text-black">
              <DropdownItem
                text="Pending Vendor"
                onClick={() => handleItemClick("/mange/vendor/pending")}
              />
              <DropdownItem
                text="Re-verification vendor"
                onClick={() => handleItemClick("/mange/vendor/re-verify")}
              />
              <DropdownItem
                text="Approved Vendor"
                onClick={() => handleItemClick("/mange/vendor/approved")}
              />
              <DropdownItem
                text="Rejected Vendor"
                onClick={() => handleItemClick("/mange/vendor/rejected")}
              />
              <DropdownItem
                text="Vendor Not Intrested"
                onClick={() => handleItemClick("/mange/vendor/Not-intrested")}

              // onClick={() => handleItemClick("/mange/vendors/pending")}
              />
              <DropdownItem
                text="Re-verification vendor"
                onClick={() => handleItemClick("/mange/vendors/re-verify")}
              />
              <DropdownItem
                text="Approved Vendor"
                onClick={() => handleItemClick("/mange/vendors/approved")}
              />
              <DropdownItem
                text="Rejected Vendor"
                onClick={() => handleItemClick("/mange/vendors/rejected")}
              />
              <DropdownItem
                text="Vendor Not Intrested"
                onClick={() => handleItemClick("/mange/vendors/Not-intrested")}
              />
            </div>
          )}
        </div>

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
    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer rounded-full"
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

export default Sidebar;
