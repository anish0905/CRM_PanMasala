import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Ensure axios is imported
import { SuperStockistSideBar } from "./SuperStockistSideBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const id = localStorage.getItem("CurrentUserId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/panshop/order/getAllOrdersuperStockistDeliverBoybyId/${id}`);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // If still loading or there's an error, display a loading message or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <SuperStockistSideBar />

      {/* Main Content */}
      <div className="lg:ml-96 w-full p-6 bg-gray-100 mt-24 lg:mt-0">
        {/* Dashboard Content */}
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          Delivery Boy Dashboard
        </h1>

        {/* Order Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Total Orders</h2>
            <p className="text-gray-600">{orders.length}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Orders</h2>
            <p className="text-gray-600">
              {orders.filter(order => order.deliveryBoyOrderStatus === "pending").length}
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delivered Orders</h2>
            <p className="text-gray-600">
              {orders.filter(order => order.deliveryBoyOrderStatus === "delivered").length}
            </p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Orders</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter(order => order.deliveryBoyOrderStatus !== "delivered")
                .map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.stockistDetails.username}</td>
                    <td className="px-4 py-2 text-yellow-500">{order.deliveryBoyOrderStatus}</td>
                    <td className="px-4 py-2">{order.superStockistdeliveryTime || "N/A"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
