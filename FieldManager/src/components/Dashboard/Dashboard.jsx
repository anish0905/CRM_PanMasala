import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "./Topbar ";
import DashboardContent from "./DashboardContent";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-blue-900 ">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
