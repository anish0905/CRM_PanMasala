import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowCart from "../cart/ShowCart";
import { IoIosLogOut } from "react-icons/io";
import LOGO from "../../assets/logo.png";
import OrderHistory from "../OrderHistory";

const Navbar1 = ({ onSearch }) => {
  const navigation = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigation("/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery); // Pass search query to parent
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex mb-5 px-4 md:px-20 flex-col md:flex-row items-center bg-[#0b0e2e] shadow-lg py-4">
      <div className="flex w-full items-center justify-between mb-4 md:mb-0">
        <div className="flex items-center gap-4">
          <img
            src={LOGO}
            alt="Logo"
            className="h-16 object-contain cursor-pointer"
            onClick={() => navigation("/")}
          />
        </div>
        <div className="lg:hidden md:hidden flex items-center justify-center space-x-4">
          <ShowCart />
          <OrderHistory />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative flex-grow w-full flex items-center mb-4 md:mb-0">
        <input
          type="search"
          placeholder="Search by title, category, or subcategory"
          className="w-full px-2 py-2 pl-10 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="absolute right-0 flex items-center justify-center bg-[#C8A357] text-white p-2 px-2 rounded-r-sm text-md"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="hidden md:flex lg:w-1/4 items-center justify-center space-x-4">
        <ShowCart />
        <OrderHistory />
        <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-100 ">
          <IoIosLogOut className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Navbar1;
