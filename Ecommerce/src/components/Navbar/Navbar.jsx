import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-xl font-bold">MyStore</div>

        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-2 top-2 text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16.65 9.35a7.3 7.3 0 1114.6 0 7.3 7.3 0 01-14.6 0z"
              />
            </svg>
          </button>
        </div>

        {/* Order History and Add to Cart */}
        <div className="flex items-center space-x-6">
          {/* Order History */}
          <button className="text-gray-300 hover:text-white transition duration-300 font-medium">
            Order History
          </button>

          {/* Add to Cart */}
          <button className="relative text-gray-300 hover:text-white transition duration-300 font-medium">
            cart
            {/* Cart Item Count Badge */}
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
              3
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
