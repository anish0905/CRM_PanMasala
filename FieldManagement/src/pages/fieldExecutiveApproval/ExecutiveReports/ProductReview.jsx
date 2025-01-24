import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FEASidebar from "../../../components/Sidebar/FEASidebar";

const ProductReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productReview } = location.state || {};
  const email = localStorage.getItem("email");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Filtered reviews based on search term
  const filteredReviews = productReview.filter(
    (product) =>
      product.productSimilarity
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.fragrance?.some((item) =>
        item.rating.toString().includes(searchTerm)
      ) ||
      product.tasteAndFlavor?.some((item) =>
        item.rating.toString().includes(searchTerm)
      ) ||
      product.reviews?.some((review) =>
        review.rating.toString().includes(searchTerm)
      )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(10)].map((_, index) => (
          <span
            key={index}
            className={index < rating ? "text-yellow-500" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const ReviewCard = ({ product }) => (
    <div className="p-6 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center">
      <img
        src={`${BASE_URL}/uploads/${product?.productDetails.image}`}
        alt={product.productDetails.title || "Product Image"}
        className="w-full max-h-72 object-cover mb-4 rounded-md hover:scale-105 transition-transform duration-300"
      />
      <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        {product.productDetails.title || "N/A"}
      </h2>
      <p className="text-gray-600 mb-2 text-center">
        {product.productDetails.description || "No description available"}
      </p>
      <p className="text-gray-700 font-medium mb-3">
        Similarity: {product.productSimilarity || "N/A"}
      </p>
      <div className="w-full mb-2 flex flex-col justify-between items-center">
        <strong className="block mb-1 text-gray-700">Fragrance Ratings:</strong>
        {product.fragrance?.length > 0 ? (
          product.fragrance.map((item, idx) => (
            <div key={idx} className="text-gray-600 flex items-center mb-1">
              {renderStars(item.rating)}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No ratings available</p>
        )}
      </div>
      <div className="w-full mb-2 flex flex-col justify-between items-center">
        <strong className="block mb-1 text-gray-700">Taste and Flavor:</strong>
        {product.tasteAndFlavor?.length > 0 ? (
          product.tasteAndFlavor.map((item, idx) => (
            <div
              key={idx}
              className="text-gray-600 flex items-center text-2xl mb-1"
            >
              {renderStars(item.rating)}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No ratings available</p>
        )}
      </div>
      <div className="w-full flex flex-col justify-between items-center">
        <strong className="block mb-1 text-gray-700">Kick and High:</strong>
        {product.reviews?.length > 0 ? (
          product.reviews.map((review, idx) => (
            <div
              key={idx}
              className="text-gray-600 flex items-center mb-1 text-3xl"
            >
              {renderStars(review.rating)}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews available</p>
        )}
      </div>
      <div className="text-sm text-gray-500 mt-4">
        <p>{new Date(product.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex w-full">
      <div>
        <FEASidebar />
      </div>
      <div className="flex flex-col w-full p-6 space-y-6">
        <header className="bg-blue-200 rounded-md shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-700 px-10">
            Product Reviews
          </h1>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow">
            {email || "No email provided"}
          </div>
        </header>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search by product similarity, fragrance, or ratings"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-md"
          >
            Back
          </button>
        </div>
        {!productReview || productReview.length === 0 ? (
          <p className="p-4 text-center text-gray-600">
            No product review data available.
          </p>
        ) : (
          <>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
              {paginatedReviews.map((product) => (
                <ReviewCard key={product._id} product={product} />
              ))}
            </div>
            <div className="flex justify-center items-center my-4 gap-4">
              {/* Conditionally render the Previous button */}
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Previous
                </button>
              )}

              {/* Display the page number in the center */}
              <span className="font-bold text-lg">
                Page {currentPage} of {totalPages}
              </span>

              {/* Conditionally render the Next button */}
              {currentPage < totalPages && (
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReview;
