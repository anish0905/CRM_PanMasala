import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/attica-logo.png";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { GiShop, GiGlassBall } from "react-icons/gi";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import FieldManagerLocation from "../FieldManagerLocation";
import axios from "axios";
import Swal from "sweetalert2";

// Utility function to assign icons based on names
const getIconByName = (name) => {
  const icons = {
    Dashboard: <RxDashboard style={{ color: "#eab308", fontSize: "2rem" }} />,
    Showcase: <GiGlassBall style={{ color: "#eab308", fontSize: "2rem" }} />,
    "Show Case Report": (
      <GiGlassBall style={{ color: "#eab308", fontSize: "2rem" }} />
    ),
    Logout: <FaSignOutAlt style={{ color: "gray", fontSize: "2rem" }} />,
    "Field Executive": (
      <GiShop style={{ color: "#eab308", fontSize: "2rem" }} />
    ),
    "Vendor Not Interested": (
      <GiShop style={{ color: "gray", fontSize: "2rem" }} />
    ),
    "Pending Verification": (
      <GiShop style={{ color: "#eab308", fontSize: "2rem" }} />
    ),
    "Verified Vendor": (
      <GiShop style={{ color: "#eab308", fontSize: "2rem" }} />
    ),
    "Reject Vendor": <GiShop style={{ color: "red", fontSize: "2rem" }} />,
  };
  return (
    icons[name] || <RxDashboard style={{ color: "gray", fontSize: "2rem" }} />
  );
};

const FEASidebar = ({ onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVendorMenuOpen, setIsVendorMenuOpen] = useState(false);
  const [isShowCaseReportMenuOpen, setisShowCaseReportMenuOpen] =
    useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const URI = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("fieldManager_Id");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleItemClick = (route) => {
    if (route) {
      navigate(route);
    }
    if (onClose) {
      onClose();
    }
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Show confirmation dialog with SweetAlert
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
        // If user cancels, call the logout API
        const resp = await axios.post(
          `${URI}/api/fieldManager/logout/${userId}`
        );
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Swal.fire("Error", "An error occurred while logging out", "error");
    }
  };

  const getRouteWidth = () => {
    return location.pathname === "/Field-Executive-Approval-Dashboard"
      ? "100%"
      : "80%";
  };

  const menuItems = [
    { text: "Dashboard", route: "/Field-Executive-Approval-Dashboard" },
    // {
    //   text: "Field Executive",
    //   route: "/Field-Executive-Approval/field-executive",
    // },
    // { text: "Show Case Report", route: "/Field-Executive-Approval/showcase" },
  ];
  const venderPenddingAndRejectedmenu = [
    {
      text: "Pending Verification",
      route: "/Field-Executive-Approval/Pending-Verification",
    },
    {
      text: "Vendor Not Interested",
      route: "/Field-Executive-Approval/Vendor-Not-Interested",
    },
    {
      text: "Field Executive",
      route: "/Field-Executive-Approval/field-executive",
    },
  ];

  const ShowCaseMenuItems = [
    {
      text: "Field Executive Reports",
      route: "/Field-Executive-Approval/showcaseReport/field-executive-report",
    },
    {
      text: "Product Reports",
      route: "/showcaseReports/ProductReports",
    },
    {
      text: "Report",
      route: "/Field-Executive/message",
    },
  ];
  const vendorMenuItems = [
    // {
    //   text: "Pending Verification",
    //   route: "/Field-Executive-Approval/Pending-Verification",
    // },
    // {
    //   text: "Vendor Not Interested",
    //   route: "/Field-Executive-Approval/Vendor-Not-Interested",
    // },
    {
      text: "Approved Vendor",
      route: "/Field-Executive-Approval/Verified-Verification",
    },
    {
      text: "Reject Vendor",
      route: "/Field-Executive-Approval/Reject-Verification",
    },
  ];

  return (
    <>
      <FieldManagerLocation />

      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-10 left-8 z-50 ${
          isSidebarOpen ? "" : "bg-[#1e40af]"
        } text-white p-3 rounded-full shadow-md`}
      >
        {isSidebarOpen ? "" : <FaBars />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full ${getRouteWidth()} lg:w-80 bg-white text-black shadow-gray-400 border-r border-gray-200 transition-transform duration-300 shadow-md ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static z-40`}
        style={{
          height: "100%",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="sidebar-header p-6 flex items-center justify-between bg-gray-600">
          <img src={logo} alt="Logo" className="w-3/4 h-auto" />
          <button
            onClick={toggleSidebar}
            className={`lg:hidden text-white p-2 rounded-full shadow-md ${
              isSidebarOpen ? "bg-red-700" : ""
            }`}
          >
            {isSidebarOpen ? <IoCloseSharp /> : <FaBars />}
          </button>
        </div>

        <ul className="sidebar-menu mx-4 flex flex-col flex-grow mt-6">
          {menuItems.map((item, index) => (
            <NavItem
              key={index}
              icon={getIconByName(item.text)}
              text={item.text}
              onClick={() => handleItemClick(item.route)}
            />
          ))}

          {/* Pending and Rejected Vender list*/}
          {venderPenddingAndRejectedmenu.map((item, index) => (
            <NavItem
              key={index}
              icon={getIconByName(item.text)}
              text={item.text}
              onClick={() => handleItemClick(item.route)}
            />
          ))}

          {/* showcase report DropDown   */}
          <div>
            <div
              className="nav-item flex items-center p-4 transition duration-300 ease-in-out hover:bg-gray-700 rounded-full mb-2 cursor-pointer m-3"
              onClick={() =>
                setisShowCaseReportMenuOpen(!isShowCaseReportMenuOpen)
              }
            >
              <span className="flex items-center w-full">
                <span className="mr-2">
                  <GiShop style={{ color: "#eab308", fontSize: "2rem" }} />
                </span>
                <span className="text-lg font-semibold">Show Case Report</span>
                <span className="ml-auto">
                  {isShowCaseReportMenuOpen ? (
                    <AiOutlineUp />
                  ) : (
                    <AiOutlineDown />
                  )}
                </span>
              </span>
            </div>
            {isShowCaseReportMenuOpen && (
              <div className="ml-4">
                {ShowCaseMenuItems.map((item, index) => (
                  <div
                    key={index}
                    className="nav-item w-full flex items-center p-4 transition duration-300 ease-in-out hover:bg-gray-700 rounded-full cursor-pointer"
                    onClick={() => handleItemClick(item.route)}
                  >
                    <span className="mr-2">{getIconByName(item.text)}</span>
                    <span className="text-md font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* vendor dropdown */}
          <div>
            <div
              className="nav-item flex items-center p-4 transition duration-300 ease-in-out hover:bg-gray-700 rounded-full mb-2 cursor-pointer m-3"
              onClick={() => setIsVendorMenuOpen(!isVendorMenuOpen)}
            >
              <span className="flex items-center w-full">
                <span className="mr-2">
                  <GiShop style={{ color: "#eab308", fontSize: "2rem" }} />
                </span>
                <span className="text-lg font-semibold">Vendors</span>
                <span className="ml-auto">
                  {isVendorMenuOpen ? <AiOutlineUp /> : <AiOutlineDown />}
                </span>
              </span>
            </div>
            {isVendorMenuOpen && (
              <div className="ml-4">
                {vendorMenuItems.map((item, index) => (
                  <div
                    key={index}
                    className="nav-item w-full flex items-center p-4 transition duration-300 ease-in-out hover:bg-gray-700 rounded-full cursor-pointer"
                    onClick={() => handleItemClick(item.route)}
                  >
                    <span className="mr-2">{getIconByName(item.text)}</span>
                    <span className="text-md font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <LogoutItem
            icon={getIconByName("Logout")}
            text="Logout"
            onClick={handleLogout}
          />
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

export default FEASidebar;
