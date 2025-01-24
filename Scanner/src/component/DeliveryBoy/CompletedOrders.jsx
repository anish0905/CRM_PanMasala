import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRupeeSign } from "react-icons/fa";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const id = localStorage.getItem("CurrentUserId");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/qrGeneraterBoy/order/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const completedOrders = data.filter(
          (order) => order.status === "delivered"
        );
        setOrders(completedOrders);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-10 overflow-x-auto">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center underline text-blue-600">
        Completed Orders
      </h1>
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-100 text-blue-700">
            <th className="border border-gray-300 px-4 py-2">Order ID</th>
            <th className="border border-gray-300 px-4 py-2">Pan Shop Owner</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Delivery Time</th>
            <th className="border border-gray-300 px-4 py-2">Products</th>
            <th className="border border-gray-300 px-4 py-2">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-blue-50">
              <td className="border border-gray-300 px-4 py-2 text-center">
                {order._id}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {order.panShopOwnerName}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {order.panShopOwneraddress}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {order.status}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {order.deliveryTime}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <ul className="list-disc pl-5">
                  {order.products.map((product) => (
                    <li key={product._id}>
                      {product.productName} - Qty: {product.quantity} - Price:{" "}
                      <FaRupeeSign />
                      {product.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center font-bold flex items-center justify-center">
                <FaRupeeSign className="mr-1" />
                {order.totalPrice}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedOrders;
