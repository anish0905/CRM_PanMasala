import React from "react";

const ProductItem = ({ imgSrc, title, description, price }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 p-5">
      {/* Product Image */}
      <img
        src={`http://localhost:5001/${imgSrc}`}
        alt={title}
        className="w-full h-40 object-cover"
      />
      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-blue-600 font-bold mt-2">₹{price}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition duration-200">
          +
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
