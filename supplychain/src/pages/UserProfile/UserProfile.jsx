import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DistributorSidebar from "../Distributer/sidebar/DistributorSidebar";
import CNFSidebar from "../CNF/CNFSidebar";
import SuperStockistSidebar from "../SuperStockists/SSsidebar/SuperStockistSidebar";
import SMSDrawer from "../../Component/SMS_Drawer";
import CNFSideBarModal from "../CNF/CNFSideBarModal";
import SuperStockistBarModal from "../SuperStockists/SSsidebar/SuperStockistBarModal";
import DistributorBarModal from "../Distributer/sidebar/DistributorBarModal";
import Avatr from "../../../src/assets/profilePic.png";
import AttendanceRecord from "../Attendance/attendanceRecord/AttendanceRecord";

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [showAttendance, setShowAttendance] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [role]);

  const fetchUserDetails = async () => {
    try {
      let response;
      const lowercaseRole = role.toLowerCase();

      if (lowercaseRole === "distributor") {
        response = await axios.get(`${BASE_URL}/api/distributor/currentDistributor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (lowercaseRole === "superstockist") {
        response = await axios.get(`${BASE_URL}/api/superstockist/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (lowercaseRole === "cnf") {
        response = await axios.get(`${BASE_URL}/api/cnfAgent/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        throw new Error("Invalid role");
      }

      setUserDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSidebar = () => {
    switch (role.toLowerCase()) {
      case "distributor":
        return <DistributorSidebar />;
      case "superstockist":
        return <SuperStockistSidebar />;
      case "cnf":
        return <CNFSidebar />;
      default:
        return null;
    }
  };

  const renderSidebarModal = () => {
    switch (role.toLowerCase()) {
      case "distributor":
        return <DistributorBarModal />;
      case "superstockist":
        return <SuperStockistBarModal />;
      case "cnf":
        return <CNFSideBarModal />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block fixed h-screen bg-gray-800 text-white shadow-lg">
        {renderSidebar()}
      </div>

      {/* Main content */}
      <div className="lg:ml-96 p-6 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow p-6 flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Profile - {userDetails?.username || "Loading..."}</h1>
          <div className="flex gap-4 items-center">
            <SMSDrawer />
            <div className="lg:hidden block">{renderSidebarModal()}</div>
          </div>
        </div>

        {/* Loading, error, or user details */}
        {loading ? (
          <div className="flex justify-center items-center mt-12">
            <div className="animate-pulse bg-gray-300 rounded-xl h-48 w-96"></div>
          </div>
        ) : error ? (
          <p className="text-center text-xl text-red-500 mt-8">{error}</p>
        ) : userDetails ? (
          <div className="mx-auto bg-white p-8 rounded-lg shadow-xl mt-6">
            <div className="flex justify-center items-center mb-6">
              <img
                src={userDetails.profilePic || Avatr}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { label: "Name", value: userDetails.username },
                { label: "Email", value: userDetails.email },
                { label: "Mobile No", value: userDetails.mobileNo },
                { label: "Country", value: userDetails.country },
                { label: "State", value: userDetails.state },
                { label: "District", value: userDetails.district },
                { label: "City", value: userDetails.city },
                { label: "Address", value: userDetails.address },
                { label: "Pin Code", value: userDetails.pinCode },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-gray-700">{item.label}</p>
                  <p className="text-lg text-gray-900">{item.value}</p>
                </div>
              ))}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAttendance(!showAttendance)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  {showAttendance ? 'Hide Attendance' : 'Check Attendance'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showAttendance && (
          <div className="mt-8">
            <AttendanceRecord />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;