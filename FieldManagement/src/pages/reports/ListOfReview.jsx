import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import Sidebar from "../../components/Sidebar/Sidebar";

const renderStars = (rating) => {
  const maxStars = 10;
  return (
    <div className="flex items-center">
      {Array.from({ length: maxStars }, (_, index) => (
        <span
          key={index}
          className={`text-xl ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        ({rating} / {maxStars})
      </span>
    </div>
  );
};

const ListOfReview = () => {
  const URI = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const review = location.state?.review;
  const product = location.state?.Product;
  const email = localStorage.getItem("email");
  console.log(product);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 bg-gray-100">
        <div className="lg:ml-4 md:ml-20 font-serif w-full lg:p-10 md:p-5 p-2">
          {/* Header Section */}
          <div className="flex items-center flex-wrap lg:justify-end md:justify-end justify-center lg:gap-10 md:gap-5 gap-1 lg:h-28 h-16 bg-[#93c5fd] rounded-xl lg:my-5 md:my-5 my-2">
            <Button
              color="blue"
              className="lg:text-2xl md:text-xl text-xs font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out mr-4"
            >
              {email}
            </Button>
          </div>
          <div className="lg:w-[80%] m-auto justify-center">
            {/* Review Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-4 lg:text-xl">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Review Details
              </h2>
              {/* <div className="text-center mb-4">
                <img
                  src={`${URI}/uploads/${product.image}`} // Modify this path according to your setup
                  alt={product?.title}
                  className="max-w-full h-auto rounded-lg"
                />
              </div> */}

              {/* Display Product Name */}
              <h3 className="text-xl font-semibold  mb-4">
                Product Name:{" "}
                <span className="font-thin"> {product?.title}</span>
              </h3>
              {review ? (
                <div className="space-y-4">
                  {/* Fragrance Ratings */}
                  <div className="pb-2 lg:flex">
                    <strong>Fragrance Ratings:</strong>
                    <ul className="list-none pl-5 mr-10">
                      {review.data.fragrance.map((item) => (
                        <li key={item._id}>{renderStars(item.rating)}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Taste and Flavor Ratings */}
                  <div className="pb-2 lg:flex">
                    <strong>Taste and Flavor Ratings:</strong>
                    <ul className="list-none pl-5 mr-10">
                      {review.data.tasteAndFlavor.map((item) => (
                        <li key={item._id}>{renderStars(item.rating)}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Product Similarity */}
                  <div className="pb-2">
                    <strong className="mr-5">Product Similarity:</strong>
                    {review.data.productSimilarity}
                  </div>

                  {/* Overall Reviews */}
                  <div className="pb-2 lg:flex">
                    <strong>Overall Reviews:</strong>
                    <ul className="list-none pl-5 mr-10">
                      {review.data.reviews.map((item) => (
                        <li key={item._id}>{renderStars(item.rating)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No review data available.
                </p>
              )}
            </div>
          </div>

          {/* Buttons Section */}
          {/* <div className="flex justify-center space-x-4 mt-4">
            <button
              className="px-6 py-3 bg-green-500 text-white font-semibold text-sm uppercase rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ease-in-out"
              onClick={() => navigate("/Add-New-Vendor")}
            >
              Register the Vendor
            </button>
            <button
              className="px-6 py-3 bg-red-500 text-white font-semibold text-sm uppercase rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
              onClick={() => navigate("/vendor-not-intrested")}
            >
              Vendor Not Interested
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ListOfReview;
