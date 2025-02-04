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
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("FEA_id");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!role) navigate("/");
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/attendance/user/${userId}`
      );
      setAttendance(data);

      // Redirect if trying to login with existing open session
      if (name === "login" && data.some((a) => !a.logoutTime)) {
        Swal.fire(
          "Error",
          "You already have an open attendance session",
          "error"
        );
        redirectToDashboard();
      }
    } catch (err) {
      setError("Failed to load attendance records");
    } finally {
      setLoadingAttendance(false);
    }
  };

  const redirectToDashboard = () => {
    navigate(
      role === "fea"
        ? "/Field-Executive-Approval-Dashboard"
        : "/fieldManagerDashboard"
    );
  };

  const handleCapture = async ({ image, location }) => {
    try {
      const isLogin = name === "login";
      const hasOpenAttendance = attendance.some((a) => !a.logoutTime);

      // Login validations
      if (isLogin) {
        if (hasOpenAttendance) return; // Already handled in fetchAttendance
      }
      // Logout validations
      else {
        if (!hasOpenAttendance) {
          Swal.fire("Error", "No open attendance session to close", "error");
          return navigate("/fieldManagerDashboard");
        }
      }

      const roleMapping = role === "fea" ? "fea" : "fieldExecutive";
      const payload = {
        user_id: userId,
        role: roleMapping,
        [`${isLogin ? "login" : "logout"}Img`]: image,
        [`${isLogin ? "login" : "logout"}Location`]: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
      };

      if (isLogin) {
        await axios.post(`${BASE_URL}/api/attendance/login`, payload);
      } else {
        const attendanceId = attendance.find((a) => !a.logoutTime)?._id;
        if (!attendanceId) throw new Error("Invalid attendance ID");

        await axios.put(
          `${BASE_URL}/api/attendance/logout/${attendanceId}`,
          payload
        );

        // Only call field manager specific logout
        if (role === "fieldManager") {
          await axios.post(`${BASE_URL}/api/fieldManager/logout/${userId}`);
        }
      }

      Swal.fire({
        icon: "success",
        title: `${isLogin ? "Login" : "Logout"} Successful`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (isLogin) {
        redirectToDashboard();
      } else {
        localStorage.clear();
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      Swal.fire("Error", errorMessage, "error");
    }
  };

  if (loadingAttendance) {
    return <div className="loading">Loading attendance data...</div>;
  }

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
