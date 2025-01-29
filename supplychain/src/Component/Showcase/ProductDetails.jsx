import React, { useEffect, useState } from "react";
import axios from "axios";
// import { BASE_URL } from "../../../constants";


const ProductModelDeteails = ({ show, onClose, product }) => {
  if (!show) return null;

  console.log(product)

  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    if (product?.productId) {
      getProductDetails(product?._id);
    }
  }, [product]);

  const getProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/producteomm/${productId}`);
      setProductDetails(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const renderProductDetails = () => {
    if (!productDetails) {
      return <p className="text-gray-600">Loading product details...</p>;
    }

    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <img
          src={
            productDetails.image
              ? `${BASE_URL}/uploads/${productDetails.image}`
              : "https://via.placeholder.com/300"
          }
          alt={productDetails.title || "Product"}
          className="w-full max-w-sm rounded-lg object-cover "
        />
        <h2 className="text-2xl font-semibold text-gray-800">{productDetails.title || "Product Name"}</h2>
        <p className="text-gray-600 text-sm">{productDetails.description || "Description not available."}</p>
        <p className="text-lg font-bold text-gray-800">
        ₹{productDetails.price || "Price"}
        </p>
        <p
          className={`text-sm font-medium ${
            productDetails.status === "active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {productDetails.status || "Status"}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>

        {/* Modal Content */}
        {renderProductDetails()}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModelDeteails;
