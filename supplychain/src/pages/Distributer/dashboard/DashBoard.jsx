import React, { useEffect, useState } from "react";
import axios from "axios";
import Img from "../../../assets/avataaars.png";
import DistributorSidebar from "../sidebar/DistributorSidebar";
import DistributorBarModal from "../sidebar/DistributorBarModal";

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="flex gap-6 bg-blue-100 w-full">
      <div className="h-screen hidden md:block lg:block">
        <DistributorSidebar />
      </div>
      <div className="lg:ml-80 md:ml-40 font-serif w-full lg:p-10 md:p-5">
        <div className="flex items-center flex-wrap justify-center lg:justify-end gap-5 h-20  bg-blue-300 rounded-xl">
          <img alt="User Avatar" src={Img} className="rounded-full w-16 h-16" />
          <p className="lg:text-2xl md:text-xl text-sm font-bold border-4 border-blue-400 p-2 rounded-lg bg-blue-100 mr-5">
            {localStorage.getItem("email")}
          </p>
          <div className="lg:hidden md:hidden block">
            <DistributorBarModal />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
