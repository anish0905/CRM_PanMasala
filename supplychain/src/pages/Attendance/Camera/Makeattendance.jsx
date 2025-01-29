import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewCamera from "./NewCamera";
import axios from "axios";
import Swal from "sweetalert2";

const MakeAttendance = () => {
  const navigate = useNavigate();
  const { role, work } = useParams(); // 'work' will determine if it's 'Attendance'
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId");

  const isLogin = attendance.length === 0; // Determine if this is a login or logout action

  // Fetch attendance data
  const fetchAttendanceDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance/user/${userId}`
      );
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance details:", error);
      setError("Unable to fetch attendance details.");
    }
  };

  // Redirect based on role
  const handleRedirection = () => {
    if (role === "CNF") {
      navigate("/CNFDashBoard");
    } else if (role === "Distributor") {
      navigate("/DistributorDashBoard");
    } else if (role === "SuperStockist") {
      navigate("/SuperStockistDashBoard");
    }
  };

  useEffect(() => {
    fetchAttendanceDetails();
  }, []);

  useEffect(() => {
    if (attendance.length > 0) {
      handleRedirection();
    }
  }, [attendance]);

  const handleCapture = async (capturedData) => {
    try {
      if (!capturedData || !capturedData.image) {
        setError("No image captured.");
        return;
      }

      // Determine API endpoint based on action
      const apiEndpoint = isLogin
        ? `${BASE_URL}/api/attendance/login`
        : `${BASE_URL}/api/attendance/logout/${attendance[0]?._id}`;

      // Prepare payload
      const payload = {
        user_id: userId,
        [`${isLogin ? "login" : "logout"}Img`]: capturedData.image,
        [`${isLogin ? "login" : "logout"}Location`]: {
          lat: capturedData.location.latitude,
          lng: capturedData.location.longitude,
        },
      };

      // API call
      const response = await (isLogin ? axios.post : axios.put)(
        apiEndpoint,
        payload
      );

      Swal.fire({
        icon: "success",
        title: isLogin ? "Login Successful" : "Logout Successful",
        text: `You have successfully completed the ${
          isLogin ? "login" : "logout"
        } process.`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (isLogin) {
        // Redirect after login
        setTimeout(handleRedirection, 3000);
      } else {
        // Clear local storage and redirect after logout
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error(
        `Error during ${isLogin ? "login" : "logout"} process:`,
        error
      );
      setError(`Failed to complete ${isLogin ? "login" : "logout"} process.`);
    }
  };

  return (
    <div>
      {(work === "Attendance" || work === "logout") && (
        <NewCamera onCapture={handleCapture} role={role} />
      )}
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
};

export default MakeAttendance;