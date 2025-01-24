import React, { useEffect, useState } from "react";

import {
  FaClipboardList,
  FaCalendarDay,
  FaCalendarWeek,
  FaDoorOpen,
  FaDoorClosed,
  FaUserCheck,
} from "react-icons/fa";

const DashboardContent = () => {
  const filedManagerId = localStorage.getItem("fieldManager_Id");
  const [inspection, setInspection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openCount, setOpenCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  const [visitedCount, setVisitedCount] = useState(0);
  const [Not_Visited, setNot_Visited] = useState(0);
  const [Inspection_Completed, setInspection_Completed] = useState(0);
  const [Inspection_Incomplete, setInspection_Incomplete] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchInspectionData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/inspectionShop/getinspection/shop`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data)) {
        const filteredData = data.filter(
          (inspection) => inspection.fieldManagerId === filedManagerId
        );
        setInspection(filteredData);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching inspection data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data and update counts based on the state
  useEffect(() => {
    if (filedManagerId) {
      fetchInspectionData();
    }
  }, [filedManagerId]); // Runs when `filedManagerId` changes

  useEffect(() => {
    // Calculate counts whenever `inspection` data is updated
    if (inspection.length) {
      const openShops = inspection.filter(
        (shop) => shop.shopStatus === "open"
      ).length;
      const closedShops = inspection.filter(
        (shop) => shop.shopStatus === "closed"
      ).length;
      const visitedShops = inspection.filter(
        (shop) => shop.shopStatus === "Visited"
      ).length;
      const NotVisitedShops = inspection.filter(
        (shop) => shop.shopStatus === "Not Visited"
      ).length;
      const inspectionCompleted = inspection.filter(
        (shop) => shop.shopStatus === "Inspection_Completed"
      ).length;
      const inspectionIncomplete = inspection.filter(
        (shop) => shop.shopStatus === "Inspection_Incomplete"
      ).length;

      setOpenCount(openShops);
      setClosedCount(closedShops);
      setVisitedCount(visitedShops);
      setNot_Visited(NotVisitedShops);
      setInspection_Completed(inspectionCompleted);
      setInspection_Incomplete(inspectionIncomplete);
    }
  }, [inspection]); // Runs when `inspection` data is updated

  const calculateInspectionData = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const todayStart = new Date(now.toISOString().split("T")[0]);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    const totalCount = inspection.length;

    const last7DaysCount = inspection.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= sevenDaysAgo && createdAt <= now;
    }).length;

    const todayCount = inspection.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= todayStart && createdAt < tomorrowStart;
    }).length;

    return { totalCount, last7DaysCount, todayCount };
  };

  const { totalCount, last7DaysCount, todayCount } = calculateInspectionData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full lg:mt-20 md:mt-20 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Inspection",
            count: totalCount,
            icon: <FaClipboardList />,
          },
          {
            title: "Today's Inspection",
            count: todayCount,
            icon: <FaCalendarDay />,
          },
          {
            title: "Weekly Inspection",
            count: last7DaysCount,
            icon: <FaCalendarWeek />,
          },
          { title: "Open Shops", count: openCount, icon: <FaDoorOpen /> },
          { title: "Closed Shops", count: closedCount, icon: <FaDoorClosed /> },
          {
            title: "Visited Shops",
            count: visitedCount,
            icon: <FaUserCheck />,
          },
          {
            title: "Not Visited Shops",
            count: Not_Visited,
            icon: <FaUserCheck />,
          },
          {
            title: "Inspection Completed",
            count: Inspection_Completed,
            icon: <FaUserCheck />,
          },
          {
            title: "Inspection Incomplete",
            count: Inspection_Incomplete,
            icon: <FaUserCheck />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 transition-transform transform hover:scale-105"
          >
            <div className="text-4xl text-blue-600">{item.icon}</div>
            <div>
              <p className="text-gray-600 text-lg font-bold">{item.title}</p>
              <p className="text-2xl font-bold text-gray-800">{item.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
