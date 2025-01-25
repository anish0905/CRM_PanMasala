import React from "react";
import SuperStockistSidebar from "./SSsidebar/SuperStockistSidebar";

const SuperStockistDashbord = () => {
  return (
    <>
      <div>
        <div className="h-screen lg:fixed  top-0 left-0  lg:w-64">
          <SuperStockistSidebar/>
        </div>
        <div className="flex-1 p-6 lg:ml-96 overflow-y-auto">
          <div>
            <h1>Super Stockist Dashbord</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperStockistDashbord;
