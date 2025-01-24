import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const Deliveryboy = () => {
  return (
    <div className="flex h-screen">
      <div>
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4 bg-gray-100 ">
        <h1 className="text-2xl font-bold mt-12 m-auto">Delivery List</h1>
      </div>
    </div>
  );
};

export default Deliveryboy;
