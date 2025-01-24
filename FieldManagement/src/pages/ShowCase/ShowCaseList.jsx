import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";

const ShowCaseList = () => {
  const [showCases, setShowCases] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchShowCaseData();
  }, []);

  const fetchShowCaseData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/showcase/ratings`);
      setShowCases(response.data || []); // Update this to the correct response data structure
    } catch (error) {
      console.error("Error fetching showcase data:", error);
      setError("Failed to fetch showcase data");
    }
  };
  const renderStars = (rating) => {
    const maxRating = 10;
    const filledStarsCount = Math.floor(rating); // Full stars
    const fractionalPart = rating % 1; // Fractional part for partial fill
    const emptyStarsCount =
      maxRating - filledStarsCount - (fractionalPart > 0 ? 1 : 0); // Remaining empty stars

    // Create a function to apply styles dynamically for the fractional star
    const starStyle = (percentage) => ({
      display: "inline-block",
      position: "relative",
      width: "1em",
      height: "1em",
      background: `linear-gradient(90deg, #facc15 ${percentage}%, #e5e7eb ${percentage}%)`,
      WebkitBackgroundClip: "text",
      color: "transparent",
    });

    const filledStars = Array.from({ length: filledStarsCount }, (_, i) => (
      <span
        key={`filled-${i}`}
        className="text-yellow-500"
        title={`Rating: ${rating.toFixed(1)}`} // Tooltip for filled stars
      >
        ★
      </span>
    ));

    const halfStar = fractionalPart > 0 && (
      <span
        key="half"
        style={starStyle(fractionalPart * 100)}
        className="text-gray-400 text-2xl"
        title={`Rating: ${rating.toFixed(1)}`} // Tooltip for half star
      >
        ★
      </span>
    );

    const emptyStars = Array.from({ length: emptyStarsCount }, (_, i) => (
      <span
        key={`empty-${i}`}
        className="text-gray-400"
        title={`Rating: ${rating.toFixed(1)}`} // Tooltip for empty stars
      >
        ☆
      </span>
    ));

    return (
      <span className="text-2xl cursor-pointer">
        {filledStars}
        {halfStar}
        {emptyStars}
      </span>
    );
  };

  const filteredShowCases = showCases.filter((showCase) => {
    const { productEommDetails } = showCase;
    const searchText = searchTerm.toLowerCase();
    return (
      productEommDetails?.title?.toLowerCase().includes(searchText) ||
      productEommDetails?.description?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-blue-100 flex w-full">
      <div className="h-screen lg:fixed   top-0 left-0 lg:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 lg:ml-80  overflow-y-auto">
        <header className="bg-blue-300 rounded-md shadow-md p-4 flex justify-between items-center">
          <h1 className="text-lg lg:text-xl font-bold text-gray-800">
            Showcase Report
          </h1>
          <div className="text-sm lg:text-lg font-bold text-white border-4 border-blue-900 px-4 py-2 rounded-lg bg-blue-700">
            {localStorage.getItem("email") || "Guest"}
          </div>
        </header>

        {error && <p className="text-red-600">{error}</p>}

        <div className="overflow-x-auto my-4 p-4 ">
          <input
            type="text"
            placeholder="Search by title or description"
            className="border p-2 rounded-md w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredShowCases.length > 0 ? (
              filteredShowCases.map((showCase) => (
                <div
                  key={showCase.productId}
                  className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center"
                >
                  <img
                    src={`${BASE_URL}/uploads/${showCase.productEommDetails.image}`}
                    alt={showCase.productEommDetails.title}
                    className="w-full max-h-64 max-w-60 object-center rounded-md mb-4 "
                  />
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {showCase.productEommDetails.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    {showCase.productEommDetails.description}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    ₹{showCase.productEommDetails.price}
                  </p>
                  <div className="mt-4 text-center">
                    <p className="font-semibold">Fragrance:</p>
                    <span className="text-">
                      {" "}
                      {renderStars(showCase.averageFragranceRating)}
                    </span>
                    <p className="font-semibold mt-2">Taste/Flavor:</p>
                    <span className="text-2xl">
                      {renderStars(showCase.averageTasteAndFlavorRating)}
                    </span>
                    <p className="font-semibold mt-2 ">Kick and High</p>
                    <span className="text-2xl">
                      {renderStars(showCase.averageReviewsRating)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No data found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCaseList;
