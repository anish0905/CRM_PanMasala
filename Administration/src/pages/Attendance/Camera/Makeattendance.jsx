import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewCamera from "./NewCamera";
import axios from "axios";
import Swal from "sweetalert2";

const MakeAttendance = () => {
  const navigate = useNavigate();
  const { role, work } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId");

  const isLogin = work === "Attendance"; // Determine action based on 'work'

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

  const handleRedirection = () => {
    if (role === "subadmin") {
      navigate("/SubadminDashBoard");
    }
  };

  useEffect(() => {
    fetchAttendanceDetails();
  }, []);

  useEffect(() => {
    if (isLogin && attendance.length > 0) {
      handleRedirection(); // Redirect only for login if attendance exists
    }
  }, [attendance, isLogin]);

  const handleCapture = async (capturedData) => {
    try {
      if (!capturedData || !capturedData.image) {
        setError("No image captured.");
        return;
      }

      const apiEndpoint = isLogin
        ? `${BASE_URL}/api/attendance/login`
        : `${BASE_URL}/api/attendance/logout/${attendance[0]?._id}`;

      if (!isLogin && (!attendance[0] || !attendance[0]._id)) {
        setError("No attendance record found. Cannot perform logout.");
        return;
      }

      const payload = {
        user_id: userId,
        role: role.toLowerCase(),
        [`${isLogin ? "login" : "logout"}Img`]: capturedData.image,
        [`${isLogin ? "login" : "logout"}Location`]: {
          latitude: capturedData.location.latitude,
          longitude: capturedData.location.longitude,
        },
      };

      const response = await (isLogin ? axios.post : axios.put)(
        apiEndpoint,
        payload
      );

      Swal.fire({
        icon: "success",
        title: isLogin ? "Login Successful" : "Logout Successful",
        text: `You have successfully ${isLogin ? "logged in" : "logged out"}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (isLogin) {
        setTimeout(handleRedirection, 1000);
      } else {
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`Failed to ${isLogin ? "login" : "logout"}.`);
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
