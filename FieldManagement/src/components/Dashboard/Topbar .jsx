import React from "react";
const loginName = localStorage.getItem("email");

const Topbar = () => {
  return (
    <div className="w-full bg-gray-200 p-4 shadow-md flex items-center justify-between">
      <h2 className="text-xl font-semibold hidden lg:block">
        Welcome to Your Dashboard
      </h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded ml-auto">
        {loginName}
      </button>
    </div>
  );
};

export default Topbar;
