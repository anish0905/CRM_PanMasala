import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../SubAdmin/sidebar/Sidebar";
import SidebarModal from "../sidebar/SidebarModel";
import RightSideDrawer from "../../../components/RightSideDrawer";

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const userDetails = localStorage.getItem("email");

  return (
    <div className="flex gap-6 min-h-screen bg-blue-100 w-full">
      <div className="h-screen hidden  lg:block">
        <Sidebar />
      </div>
      <div className="lg:ml-80  font-serif w-full lg:p-10 md:p-5">
        <div className="flex items-center justify-between  px-5  gap-5 h-20  bg-blue-300 rounded-xl">
        <h1 className="md:text-lg text-xs lg:text-xl font-bold text-gray-800 ">
                Sub-Admin Dashboard
              </h1>
         
          <div className="flex gap-2 ">
                <RightSideDrawer />
                <div className="lg:flex items-center gap-2 md:flex hidden  ">
                  <div className="text-sm lg:text-lg font-bold text-white border-4 border-blue-900 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out">
                    {userDetails || "Guest"}
                  </div>
                </div>
                <div className="lg:hidden  block">
            <SidebarModal />
          </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
