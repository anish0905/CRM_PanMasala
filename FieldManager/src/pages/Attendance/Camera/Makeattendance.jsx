import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewCamera from "./NewCamera";
import axios from "axios";
import Swal from "sweetalert2";

const MakeAttendance = () => {
  const navigate = useNavigate();
  const { name } = useParams(); // 'name' will determine if it's 'login' or 'logout'
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  const BASE_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("fieldManager_Id");

  useEffect(() => {
    // Redirect to login page if role is not available
    if (!role) {
      navigate("/");
    } else {
      fetchAttendanceDetails();
    }
  }, [role, navigate]);

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

  // Redirect based on attendance status and login/logout action
  useEffect(() => {
    if (attendance.length > 0 && name === "login") {
      if (role === "Admin") {
        navigate("/Field-Executive-Approval-Dashboard");
      } else if (role === "FieldManager") {
        navigate("/fieldManagerDashboard");
      }
    }
  }, [attendance, name, role, navigate]);

  const handleCapture = async (capturedData) => {
    try {
      if (!capturedData || !capturedData.image) {
        setError("No image captured.");
        return;
      }

      const isLogin = name === "login";
      const apiEndpoint = isLogin
        ? `${BASE_URL}/api/attendance/login`
        : `${BASE_URL}/api/attendance/logout/${attendance[0]?._id}`;

      // Handle logout API separately (if needed for logout)
      if (!isLogin) {
        // Logout request for field manager
        await axios.post(`${BASE_URL}/api/fieldManager/logout/${userId}`);
      }

      const payload = {
        user_id: userId,
        [`${isLogin ? "login" : "logout"}Img`]: capturedData.image,
        [`${isLogin ? "login" : "logout"}Location`]: {
          lat: capturedData.location.latitude,
          lng: capturedData.location.longitude,
        },
      };

      const response = await (isLogin ? axios.post : axios.put)(
        apiEndpoint,
        payload
      );

      console.log(`Successfully hit the ${name} endpoint`, response.data);

      Swal.fire({
        icon: "success",
        title: isLogin ? "Login Successful" : "Logout Successful",
        text: `You have successfully completed the ${name} process.`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Clear local storage and redirect on logout
      if (!isLogin) {
        setTimeout(() => {
          localStorage.clear();
          navigate("/"); // Redirect to login or home page on logout
        }, 3000);
      } else {
        // Redirect on login based on role
        if (role === "Admin") {
          setTimeout(() => {
            navigate("/Field-Executive-Approval-Dashboard");
          }, 3000);
        } else if (role === "FieldManager") {
          setTimeout(() => {
            navigate("/fieldManagerDashboard");
          }, 3000);
        }
      }
    } catch (error) {
      console.error(`Error hitting the ${name} endpoint:`, error);
      setError(`Failed to complete ${name} process.`);
    }
  };

  return (
    <div>
      {((name === "login" && attendance.length === 0) || name === "logout") && (
        <NewCamera onCapture={handleCapture} />
      )}
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
};

export default MakeAttendance;
