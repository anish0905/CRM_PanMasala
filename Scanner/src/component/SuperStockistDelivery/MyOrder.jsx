import React, { useEffect, useState } from "react";
import axios from "axios";
import { SuperStockistSideBar } from "./SuperStockistSideBar";
import Img from "../../assets/avataaars.png"; // Correct image path if necessary
import Swal from 'sweetalert2';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('pending'); // New state for filtering by status
  const [otp, setOtp] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [orderBeingDelivered, setOrderBeingDelivered] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const id = localStorage.getItem("CurrentUserId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/panshop/order/getAllOrdersuperStockistDeliverBoybyId/${id}`);
        setOrders(response.data);
        setFilteredOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  useEffect(() => {
    filterOrdersByStatus(); // Re-filter orders when status or search changes
  }, [statusFilter, orders, search]);

  const filterOrdersByStatus = () => {
    let filtered = [...orders];
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.
      superStockistdeliveryBoyOrderStatus
      === statusFilter);
    }
    if (search) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(search.toLowerCase()) ||
          order.stockistDetails?.username.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };


  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getGoogleMapsDirections = (stockist) => {
    // Extract stockist location details
    const { address, city, state, country } = stockist.stockistDetails;
    const location = `${address}, ${city}, ${state}, ${country}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    window.open(googleMapsUrl, "_blank");
  };

  if (loading) return <div className="text-center text-xl font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;




  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.patch(`${API_URL}/api/panshop/order/cancleOrderFromTheSuperStockistDeliveyBoy/${orderId}`, {
          status: 'canceled',
        });
        if (response.status === 200) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, superStockistdeliveryBoyOrderStatus: 'canceled' } : order
            )
          );
          setFilteredOrders((prevFiltered) =>
            prevFiltered.map((order) =>
              order._id === orderId ? { ...order, superStockistdeliveryBoyOrderStatus: 'canceled' } : order
            )
          );
          Swal.fire('Canceled!', 'The order has been canceled.', 'success');
        }
      } catch (err) {
        setError("Failed to update order status. Please try again.");
      }
    }
  };


  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };


 const handleDelivered = (id) => {
  setOrderBeingDelivered(id);
    setIsOtpVisible(true);
  };

  const handleOtpSubmit = async () => {

    try {
      const response = await axios.patch(`${API_URL}/api/panshop/order/updateOrderStatus/${orderBeingDelivered}`, {
        status: 'delivered',
        otp: otp,
      });
      setIsOtpVisible(false);
      setOrderBeingDelivered(null);
      setOtp("");

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderBeingDelivered ? { ...order, superStockistdeliveryBoyOrderStatus: 'delivered' } : order
          )
        );
        setFilteredOrders((prevFiltered) =>
          prevFiltered.map((order) =>
            order._id === orderBeingDelivered ? { ...order, superStockistdeliveryBoyOrderStatus: 'delivered' } : order
          )
        );
        Swal.fire('Delivered!', 'The order has been marked as delivered.', 'success');
      }
    } catch (err) {
      setError("Failed to update order status. Please try again.");
    }


   
  }
  

  


  return (
    <div className="flex font-sans bg-gray-100 min-h-screen">
      <SuperStockistSideBar />

      <div className="lg:ml-96 w-full p-6 mt-24 lg:mt-0">
        <div className="flex items-center h-32 flex-wrap lg:justify-between px-5 md:justify-end justify-center lg:gap-10 md:gap-5 gap-1 py-5 bg-white rounded-xl lg:my-5 md:my-5 my-2 shadow-lg">
          <p className="lg:text-2xl md:text-xl text-xs font-bold">My Order</p>
          <div className="flex justify-center items-center gap-4">
            <img src={Img} className="h-20" alt="User Avatar" />
            <p className="lg:text-2xl md:text-xl text-xs font-bold border-4 border-blue-400 p-2 rounded-lg bg-blue-100">
              {localStorage.getItem("email")}
            </p>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by Order ID or Stockist Name"
            className="border border-gray-300 p-4 rounded-lg shadow-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabs for filtering by order status */}
        <div className="flex space-x-4 mb-6">
          {['pending', 'delivered', 'canceled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`w-32 py-2 rounded-lg ${statusFilter === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-300 transition`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#001D3D] text-white text-xl">

                <th className="border px-6 py-3">Status</th>
                <th className="border px-6 py-3">Delivery Time</th>

                <th className="border px-6 py-3">Stockist Details</th>

                <th className="border px-6 py-3">Products</th>
                {
                  statusFilter === "pending" && (
                    <th className="border px-6 py-3">Action</th>
                  )

                }
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">

                    <td className="border px-6 py-4 text-lg">
                      <span
                        className={`px-3 py-1 rounded-lg text-white ${order.
                          superStockistdeliveryBoyOrderStatus
                          === "pending"
                          ? "bg-yellow-500"
                          : order.
                          superStockistdeliveryBoyOrderStatus
                          === "delivered"
                            ? "bg-green-500"
                            : "bg-red-500"
                          }`}
                      >
                        {order.
                          superStockistdeliveryBoyOrderStatus
}
                      </span>
                    </td>


                    <td className="border px-6 py-4 text-lg">{new Date(order.superStockistdeliveryTime).toLocaleString()}</td>
                    <td className="border px-6 py-4 text-lg space-y-2">
                      <div className="font-semibold">Name: {order.stockistDetails?.username}</div>
                      <div className="text-gray-600">Email: {order.stockistDetails?.email}</div>

                      <div className="mt-2">
                        <span className="font-medium">Address:</span>
                        <div className="text-gray-600">
                          {order?.stockistDetails?.country}{" "}
                          {order?.stockistDetails?.state}{" "}
                          {order?.stockistDetails?.city}{" "}
                          {order?.stockistDetails?.address}{" "}
                          {order?.stockistDetails?.pinCode}
                        </div>
                      </div>

                      <button
                        onClick={() => getGoogleMapsDirections(order)}
                        className="bg-blue-500 text-white p-2 my-4 text-sm rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Get Directions
                      </button>
                    </td>


                    <td className="border px-6 py-4">
                      {/* List of Products with Quantity */}
                      <ul className="space-y-2">
                        {order.products.map((product, index) => (
                          <li key={index} className="flex justify-between items-center text-sm text-gray-700">
                            <span className="font-semibold">{product.productName}</span>
                            <span className="text-gray-500">Qty: {product.quantity}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Total Price */}
                      <p className="mt-4 text-center text-lg font-semibold text-gray-800">
                        <span className="text-xl">Total Price :</span> ₹{order.totalPrice}
                      </p>
                    </td>

                    {
                      statusFilter === "pending" && (
                        <td className="flex justify-center items-center gap-4 flex-wrap ">
                          <button
                            onClick={() => handleDelivered(order._id)}
                            className="bg-green-500 text-white p-2 rounded-lg  my-2"
                          >
                            Delivered
                          </button>
                          <button
                            onClick={() => handleCancel(order._id)}
                            className="bg-red-500 text-white p-2 rounded-lg"
                          >
                            Cancel
                          </button>
                        </td>
                      )
                    }

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-red-500 text-lg">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isOtpVisible &&  (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Enter OTP </h2>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength={4}
              className="border p-2 rounded-md mb-4"
              placeholder="Enter 4-digit OTP"
            />
            <div>
              <button
                onClick={() => handleOtpSubmit(orderBeingDelivered)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Submit OTP
              </button>
              <button
                onClick={() => setIsOtpVisible(false)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 p-2 rounded-md hover:bg-gray-400 transition"
          >
            Previous
          </button>
          <p className="mx-4">{currentPage}</p>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
            className="bg-gray-300 p-2 rounded-md hover:bg-gray-400 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
