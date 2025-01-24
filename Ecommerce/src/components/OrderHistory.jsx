import React, { useState, useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { FaClipboardList } from "react-icons/fa";
import axios from "axios";
import { LuIndianRupee } from "react-icons/lu";

const OrderHistory = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  const panshopOwner_id = localStorage.getItem("id");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/panShopLogin/orderHistroy/${panshopOwner_id}`
        );
        setHistoryData(response.data.orders || []);
      } catch (error) {
        setError("Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [panshopOwner_id, apiUrl]);

  useEffect(() => {
    const sortedData = [...historyData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const filtered = sortedData.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() + 1 === selectedMonth &&
        orderDate.getFullYear() === selectedYear
      );
    });

    setFilteredData(filtered);
  }, [historyData, selectedMonth, selectedYear]);

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const handleMonthChange = (event) => setSelectedMonth(Number(event.target.value));
  const handleYearChange = (event) => setSelectedYear(Number(event.target.value));

  return (
    <div className="flex">
      <button
        onClick={toggleDrawer}
        className="btn-bg text-black px-4 py-2 rounded-lg w-full transition duration-300 ease-in-out hover:bg-gray-700"
        aria-label="Toggle Order History Drawer"
      >
        <FaClipboardList />
      </button>

      {/* Overlay */}
      {openDrawer && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full md:w-2/3 lg:w-1/3 bg-gray-900 z-50 transform transition-transform ease-in-out duration-300 ${
          openDrawer ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ overflowY: "auto" }}
        aria-hidden={!openDrawer}
      >
        <div className="flex justify-between items-center px-10 py-8 border-b border-gray-300 bg-gray-900 text-white">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <SlArrowLeft onClick={toggleDrawer} className="cursor-pointer" />
            <h1>Order History</h1>
          </div>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="p-2 rounded bg-gray-800 text-white"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="p-2 rounded bg-gray-800 text-white"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((order, index) => (
                  <div
                    key={index}
                    className="btn-bg shadow-lg rounded-lg overflow-hidden"
                  >
                    <div className="border-gray-300 pt-4">
                      <h2 className="font-bold mb-1 text-xl text-center">
                        Products Details
                      </h2>
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between border-b text-xl font-bold border-black py-2">
                          <p>Product Name</p>
                          <p>Quantity</p>
                          <p>Price</p>
                         
                        </div>
                        {order.products.map((product, pIndex) => (
                          <div
                            key={pIndex}
                            className="flex items-center justify-between border-b font-semibold border-black py-2"
                          >
                            <p>{product.productName}</p>
                            <p>{product.quantity}</p>
                            <p className="flex items-center">
                              <LuIndianRupee />
                              {product.price}
                            </p>
                            
                           
                          </div>
                        ))}
                        <div className="flex items-center justify-between  text-lg font-bold  py-2">
                         <p className="font-bold my-2  text-center text-xl"> your Order_ID : {order.orderId}</p>
                         <p className="font-bold my-2 text-xl text-center">OTP:{order.otp}</p>
                        </div>
                      </div>
                    </div>
                    <p className="px-6 py-2">
                      Date & Time:{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="py-3 font-bold px-6 flex items-center">
                      Total Price: <LuIndianRupee />
                      {order.totalPrice}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white">
                  No order history available for the selected month and year.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
