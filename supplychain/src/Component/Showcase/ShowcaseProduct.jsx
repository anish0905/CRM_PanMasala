import React, { useEffect, useState } from "react";
import axios from "axios"; // Make sure to import axios
import ShopCaseMap from "./ShowCaseMap";
import ProductDeteails from "./ProductDetails";
import DistributorSidebar from "../../pages/Distributer/sidebar/DistributorSidebar";
import DistributorBarModal from "../../pages/Distributer/sidebar/DistributorBarModal";

const ShowcaseProduct = () => {
  const BASE_URL = import.meta.env.VITE_API_URL; // Base URL for API
  const [showCases, setShowCase] = useState([]); // Initialize with an empty array
  const [error, setError] = useState(null); // To handle errors if any
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [itemsPerPage] = useState(5);
  const [showCaseModalOpen, setShowCaseModalOpen] = useState(false);
  const [selectLocation, setSelectLocation] = useState();
  const [showProductModel, setShowProductModel] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);

  useEffect(() => {
    fetchShowcaseProduct();
  }, []);

  const fetchShowcaseProduct = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/showCase/showcase`); // Await the response

      setShowCase(resp.data.data); // Set the fetched data
    } catch (error) {
      console.error("Error fetching showcase list:", error);
      setError("Failed to fetch showcase list"); // Set error message
    }
  };

  // Handle the search filtering
  const filteredShowCases = showCases.filter((showCase) =>
    showCase.productName?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  // Sort by rating in descending order
  const sortedShowCases = filteredShowCases.sort((a, b) => {
    const aRating =
      a.reviews.reduce((sum, review) => sum + review.rating, 0) /
        a.reviews.length || 0;
    const bRating =
      b.reviews.reduce((sum, review) => sum + review.rating, 0) /
        b.reviews.length || 0;
    return bRating - aRating; // Sort in descending order
  });

  // Get the current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShowCases.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ★
          </span>
        ); // Filled star (gold)
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        ); // Empty star (gray)
      }
    }
    return stars;
  };

  const handleLocationModal = (location) => {
    setShowCaseModalOpen(true);
    setSelectLocation(location);
  };

  const ShowProduct = async (product) => {
    setShowProductModel(true);
    setSelectProduct(product);
  };

  const onClose = () => {
    setShowProductModel(false);
    setSelectProduct(null);
  };

  return (
    <div className="flex gap-6 bg-[#dbeafe] w-full">
      <div className="h-screen md:block lg:block hidden">
        <DistributorSidebar />
      </div>
      <div className="lg:ml-80 md:ml-40 font-serif w-full lg:p-10 md:p-5 p-4">
        <div className="flex items-center flex-wrap lg:justify-end md:justify-end justify-center lg:gap-10 md:gap-5 gap-1 lg:h-28 h-16 bg-[#93c5fd] rounded-xl lg:my-5 md:my-5 my-2">
          <div className="lg:hidden md:hidden block">
            <DistributorBarModal />
          </div>
          <p className="lg:text-2xl mr-4 md:text-xl text-xs font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[#dbeafe]">
            Show Case
          </p>
        </div>
        {error && <p className="text-red-600">{error}</p>}{" "}
        {/* Display error if any */}
        {/* Search bar */}
        {/* Table to render showcase items */}
        <div className="overflow-x-auto bg-[#1E40AF] p-4 rounded-md">
          <div className="my-4">
            <input
              type="text"
              placeholder="Search by product name"
              className="border p-2 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#1e87ff] text-white rounded-md p-4">
                <th className="border border-gray-300 p-2">Product Name</th>
                <th className="border border-gray-300 p-2">Product Smells</th>
                <th className="border border-gray-300 p-2">Product Testing</th>
                <th className="border border-gray-300 p-2">
                  Product Similarity
                </th>

                <th className="border border-gray-300 p-2">Reviews</th>
                <th className="border border-gray-300 p-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((showCase, index) => (
                  <tr key={index} className="hover:bg-gray-100 bg-white">
                    <td className="border border-gray-300 p-2">
                      <p>{showCase.productName}</p>
                      {/* <button
                                                onClick={() => ShowProduct(showCase?.productId)}
                                                className="ml-2 bg-blue-500 p-2 my-2 rounded-md text-white "
                                            >
                                                View Product
                                            </button> */}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {showCase.productSmells}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {showCase.productTesting}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {showCase.productSimilarity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {showCase.reviews.map((review, revIndex) => (
                        <div key={revIndex}>
                          <div className="text-center">
                            {" "}
                            {renderStars(review.rating)}
                          </div>{" "}
                          {/* Display rating as stars */}
                          {new Date(review.timestamp).toLocaleString()}
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {showCase.locations.map((location, locIndex) => (
                        <div key={locIndex} className="">
                          <button
                            onClick={() => handleLocationModal(location)}
                            className="bg-blue-500 p-2 my-2 rounded-md text-white "
                          >
                            View Location
                          </button>
                          <br />
                          {new Date(location.timestamp).toLocaleString()}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border border-gray-300 p-2 text-center"
                  >
                    No showcase items available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {showCaseModalOpen && selectLocation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-50 bg-white w-[80%] p-8 rounded-lg shadow-lg">
                <ShopCaseMap
                  selectLocation={selectLocation}
                  setShowCaseModalOpen={setShowCaseModalOpen}
                />
              </div>
            </div>
          )}

          {showProductModel && selectProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-50 bg-white w-[80%] p-8 rounded-lg shadow-lg">
                <ProductDeteails product={selectProduct} onClose={onClose} />
              </div>
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center gap-2 my-4">
          {Array.from(
            { length: Math.ceil(filteredShowCases.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`border px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseProduct;
