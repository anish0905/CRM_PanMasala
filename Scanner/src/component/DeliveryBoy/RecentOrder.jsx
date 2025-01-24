import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRupeeSign } from "react-icons/fa";

const RecentOrder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState("");
  const inputRefs = useRef([]);
  const deliveryEmail = localStorage.getItem("email");
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
        const recentOrders = data.filter(
          (order) =>
            order.status === "confirmed" &&
            (!order.deliveryTime || new Date(order.deliveryTime) >= now)
        );
        setOrders(recentOrders);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      }
    };

    fetchOrders();
  }, [deliveryEmail]);

  const handleOTPSubmit = (order) => {
    console.log("Order selected:", order);
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
        `${API_URL}/api/panshop/order/${selectedOrder._id}`,
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
    <div className="container mx-auto overflow-y-auto h-screen p-4 md:p-10">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center underline text-blue-600">
        Recent Orders
      </h1>
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
      <div className="overflow-x-auto">
        {/* Responsive Table */}
        <div className="hidden sm:block">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">Owner Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Owner Address
                </th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">
                  Delivery Time
                </th>
                <th className="border border-gray-300 px-4 py-2">Products</th>
                <th className="border border-gray-300 px-4 py-2">
                  Total Price
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {order._id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.panShopOwnerName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.panShopOwneraddress}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.status === "confirmed" ||
                    order.status === "delivered"
                      ? "Pending"
                      : order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.deliveryTime || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc pl-4">
                      {order.products.map((product) => (
                        <li key={product._id}>
                          {product.productName} - Qty: {product.quantity} -
                          Price: <FaRupeeSign className="inline" />
                          {product.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-bold">
                    <FaRupeeSign className="inline" />
                    {order.totalPrice}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
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
      </div>

      {/* OTP Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
              Enter OTP for Order ID: {selectedOrder?._id}
            </h2>
            <form onSubmit={submitOtp}>
              <div className="flex space-x-2 justify-center">
                {Array(4)
                  .fill("")
                  .map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e.target.value,
                          e.nativeEvent.keyCode
                        )
                      }
                    />
                  ))}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrder;
