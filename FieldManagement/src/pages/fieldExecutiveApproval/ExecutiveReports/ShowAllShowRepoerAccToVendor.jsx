import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FEASidebar from "../../../components/Sidebar/FEASidebar";

const ShowAllShowRepoerAccToVendor = () => {
  const [reviewData, setReviewData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email");

  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  useEffect(() => {
    const filtered = reviewData.filter((item) =>
      item.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shop_owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shop_address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, reviewData]);

  const fetchData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/inspectionShop/executiveId/${id}`
      );
      setReviewData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  const handleOnclicked = (item) => {
     
    navigate("/Field-Executive-Approval/showcaseReport/field-executive-report/product-View",{
       
      state: { productReview:item.showCaseTestId }
    })

    
  };

  return (
    <div className="min-h-screen bg-blue-100 flex w-full">
      {/* Sidebar */}
      <div>
        <FEASidebar />
      </div>
      <div className="flex flex-col lg:mt-8 gap-10 w-full p-6">
        <header className="bg-[#93c5fd] rounded-md shadow p-4 flex justify-between items-center w-full ">
          <h1 className="llg:text-xl md:text-base text-xs font-bold text-gray-800 pl-12">
            Field Executive Report
          </h1>
          <div className="lg:text-2xl md:text-xl text-xs text-white font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out mr-4">
            {email}
          </div>
        </header>

        {/* Search Bar */}
        <div className="flex justify-between mb-4 w-full flex-wrap-reverse gap-4">
          <input
            type="text"
            placeholder="Search by shop name, owner, or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 w-20"
        >
          Back
        </button>
        </div>

        {/* Back Button */}
        

        {loading && <p className="text-gray-500">Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item, index) => (
              <div
                key={item._id || index}
                className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                  Shop Name: {item.shop_name || "N/A"}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Vendor Name:</strong> {item.shop_owner_name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {item.shop_address || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Contact:</strong> {item.shop_contact_number || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      item.status === "approved"
                        ? "text-green-500"
                        : item.status === "rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {item.status || "N/A"}
                  </span>
                </p>

                <div className="mt-4 flex justify-center mb-4 w-full flex-wrap-reverse gap-4">
                {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                  View Location
                </button> */}
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                  onClick={()=>handleOnclicked(item)} >
                  Product  Review
                </button>
              </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default ShowAllShowRepoerAccToVendor;
