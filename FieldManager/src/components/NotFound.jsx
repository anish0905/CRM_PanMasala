import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navagate = useNavigate()

    const handleGoBack = () => {
        navagate(-1)
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* <img
        src="https://via.placeholder.com/500x300.png?text=404+Not+Found"
        alt="404 Not Found"
        className="w-full max-w-md"
      /> */}
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Page Not Found</h1>
      <p className="text-gray-600 mt-2">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={handleGoBack}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
