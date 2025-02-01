import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewCamera from "./NewCamera";
import axios from "axios";
import Swal from "sweetalert2";

const MakeAttendance = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("fieldManager_Id");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!role) navigate("/");
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/attendance/user/${userId}`);
      setAttendance(res.data);
    } catch (err) {
      setError("Failed to load attendance records");
    }
  };

  const handleCapture = async ({ image, location }) => {
    try {
      const isLogin = name === "login";
      const hasOpenAttendance = attendance.some((a) => !a.logoutTime);

      if (isLogin && hasOpenAttendance) {
        Swal.fire(
          "Error",
          "You already have an open attendance session",
          "error"
        );
        return navigate(
          role === "Admin"
            ? "/Field-Executive-Approval-Dashboard"
            : "/fieldManagerDashboard"
        );
      }

      if (!isLogin && !hasOpenAttendance) {
        Swal.fire("Error", "No open attendance session to close", "error");
        return navigate("/");
      }

      let NewRole = role === "Admin" ? "fea" : "fieldexecutive";

      const payload = {
        user_id: userId,
        role: NewRole,
        [`${isLogin ? "login" : "logout"}Img`]: image,
        [`${isLogin ? "login" : "logout"}Location`]: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
      };

      let response;
      if (isLogin) {
        response = await axios.post(
          `${BASE_URL}/api/attendance/login`,
          payload
        );
      } else {
        const attendanceId = attendance.find((a) => !a.logoutTime)?._id;
        response = await axios.put(
          `${BASE_URL}/api/attendance/logout/${attendanceId}`,
          payload
        );
        await axios.post(`${BASE_URL}/api/fieldManager/logout/${userId}`);
      }

      Swal.fire({
        icon: "success",
        title: `${isLogin ? "Login" : "Logout"} Successful`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (isLogin) {
        navigate(
          role === "Admin"
            ? "/Field-Executive-Approval-Dashboard"
            : "/fieldManagerDashboard"
        );
      } else {
        localStorage.clear();
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      setError(errorMessage);

      // Use a valid error message, avoiding `null`
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div>
      {(name === "login" || attendance.some((a) => !a.logoutTime)) && (
        <NewCamera
          cameraType={name === "login" ? "environment" : "user"}
          onCapture={handleCapture}
          onClose={() => navigate(-1)}
        />
      )}
      {error && <div className="error-banner">{error}</div>}
    </div>
  );
};

export default MakeAttendance;
