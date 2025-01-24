import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRupeeSign } from "react-icons/fa";

const OverdueOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState("");
  const inputRefs = useRef([]);
  // const deliveryEmail = localStorage.getItem("email");
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
        const now = new Date();
        const overdueOrders = data.filter(
          (order) =>
            order.status === "confirmed" && new Date(order.deliveryTime) < now
        );

        setOrders(overdueOrders);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleOTPSubmit = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setOtp("");
  };

  const handleInputChange = (index, value, keyCode) => {
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    if (!value && index > 0 && keyCode === 8) {
      inputRefs.current[index - 1].focus();
      inputRefs.current[index - 1].value = "";
    }
    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    try {
      const otpNumber = Number(otp);
      const response = await fetch(
        `http://localhost:5001/api/panshop/order/${selectedOrder._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: otpNumber }),
        }
      );

      if (!response.ok) {
        throw new Error("OTP did not match the data");
      }

      const data = await response.json();
      toast.success("OTP matched and order status updated!");
      closeModal();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.order._id ? data.order : order
        )
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto overflow-y-auto h-screen p-4 sm:p-6">
      <ToastContainer />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center underline text-blue-600">
        Overdue Orders
      </h1>
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Pan Shop Owner Name</th>
              <th className="px-4 py-2 text-left">Owner Address</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Delivery Time</th>
              <th className="px-4 py-2 text-left">Total Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-blue-50 border-b">
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.panShopOwnerName}</td>
                <td className="px-4 py-2">{order.panShopOwneraddress}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">{order.deliveryTime}</td>
                <td className="px-4 py-2 flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {order.totalPrice}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handleOTPSubmit(order)}
                  >
                    Submit OTP
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 sm:p-8 shadow-lg rounded w-[90%] sm:w-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-blue-700">
              Enter OTP
            </h2>
            <form onSubmit={submitOtp}>
              <div className="flex space-x-2 justify-center">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    className="border rounded w-10 h-10 sm:w-12 sm:h-12 text-center text-gray-800"
                    onChange={(e) =>
                      handleInputChange(index, e.target.value, e.keyCode)
                    }
                  />
                ))}
              </div>
              <div className="mt-6 flex justify-between sm:justify-center space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverdueOrders;
