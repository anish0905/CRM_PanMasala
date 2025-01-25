import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import { BASE_URL } from "../../../constants";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link, useNavigate } from "react-router-dom";
import Img from "../../../assets/avataaars.png";
import { Avatar } from "@material-tailwind/react";
import AssignModal from "./AssignModal ";
import { SuperStockistSideBar } from "../SuperStockistSideBar";
import { format, parse } from 'date-fns';

const SuperStockistOrderHomePage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("processing"); // Default active tab
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate();

  const superstockist = localStorage.getItem("email"); // Get stockist email from localStorage

  // Fetch orders from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/panshop/order`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Check if order is available based on stockist email
  const isOrderAvailable = (order) => {
    return (
      order.panShopOwnerName &&
      order.panShopOwneraddress &&
      order.products.length > 0 &&
      order.superStockistEmail === superstockist // Check if stockist email matches
    );
  };

  // Filter orders based on active tab, search query, and sort by date
  const filteredOrders = orders
    .filter(
      (order) =>
        isOrderAvailable(order) &&
        order.status === activeTab &&
        (order.panShopOwnerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          order.panShopOwneraddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.products.some((product) =>
            product.productNames
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to handle cancellation
  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${BASE_URL}/api/panshop/order/cancel/${orderId}`);
        Swal.fire("Canceled!", "Your order has been canceled.", "success");
        fetchData();
      } catch (error) {
        console.error("Error canceling order:", error);
        Swal.fire(
          "Error!",
          "There was an error canceling your order.",
          "error"
        );
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear("token");
    navigate("/");
  };

  const isTimeExceeded = (deliveryTime) => {
    if (!deliveryTime) return false;

    const currentTime = new Date();
    const deliveryTimeDate = new Date(deliveryTime);

    // Compare if the delivery time exceeds a threshold (e.g., 24 hours from now)
    const timeDifference = currentTime - deliveryTimeDate;

    // If time difference exceeds 24 hours (86400000 ms), return true
    return timeDifference > 86400000;
  };


  const handleOnclick = (order) => {

    navigate("/trackerOrder/superstockist", { state: { order } });
  }

  return (
    <div className="flex font-sans bg-blue-100 h-screen">
      {/* Sidebar */}
      <div className="lg:p-5 xl:p-5 ml-0 p-0">
        <SuperStockistSideBar />
      </div>

      <div className="w-full lg:ml-96  md:ml-60 flex flex-col h-full px-5">
        <div className="flex items-center flex-wrap lg:justify-between px-5 md:justify-end justify-center lg:gap-10 md:gap-5 gap-1 py-5 h-auto bg-[#FFFFFF] rounded-xl lg:my-5 md:my-5 my-2">
          <p className="lg:text-2xl md:text-xl text-xs font-bold">My Order</p>
          <div className="flex justify-center items-center content-center gap-4">
            <Avatar className="" alt="Remy Sharp" src={Img} />
            <p className="lg:text-2xl md:text-xl text-xs font-bold border-4 border-blue-400 p-2 rounded-lg bg-blue-100">
              {localStorage.getItem("email")}
            </p>
            <Button
              color="red"
              className="lg:mr-12 lg:-ml-2 md:mr-8 mr-2 lg:text-md md:text-md text-xs"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
        {/* Tab Buttons */}
        <div className="mb-4 grid lg:grid-cols-10 md:grid-cols-6 grid-cols-2 gap-1">
          {["processing", "confirmed", "delivered", "canceled"].map(
            (status) => (
              <Button
                key={status}
                className={`mr-2 ${activeTab === status
                  ? "bg-[#001D3D] text-white shadow-lg"
                  : "bg-[hsl(211,100%,66%)] text-white hover:bg-[#001D3D]"
                  }`}
                onClick={() => setActiveTab(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            )
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Owner Name, Address, or Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg shadow-md w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Orders Table - Responsive Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-[#001D3D] text-white">
                <th className="border px-4 py-2">PanShop Details</th>
                <th className="border px-4 py-2">Assign to Stockist</th>
                {activeTab !== "processing" && (
                  <th className="border px-4 py-2">Assigned to SuperStockist DeliveryBoy</th>
                )}
                <th className="border px-4 py-2">Products</th>

                <th className="border px-4 py-2">Status</th>

                <th className="border px-4 py-2 text-center">Action</th>

              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                  >
                    <td className="border px-4 py-2 text-center">
                      {order.panShopOwnerName}
                      <br />
                      {order.panShopOwneraddress}
                      <div className="mt-2 text-sm text-gray-500">
                        Order Created At: {format(new Date(order?.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-center">{order.stockistEmail}
                      <p
                        className={` ${order.stockistStatus === "pending"
                          ? "text-yellow-500"

                          : order.stockistStatus === "delivered"
                            ? "text-purple-500"
                            : order.stockistStatus === "canceled"
                              ? "text-red-500"
                              : ""
                          }`}
                      >
                        {order.stockistStatus}
                      </p>
                    </td>


                    {activeTab != "processing" && (
                      <td className="border px-4 py-2 text-center">
                        {/* Displaying Delivery Boy Username and Email */}
                        <p className="font-semibold">{order.superStockistdeliveryBoyId?.username}</p>
                        <p className="text-sm text-gray-500">{order.superStockistdeliveryBoyId?.email}</p>

                        {/* Delivery Status with Color Based on Status */}
                        <p
                          className={`${order.StockistStatus === "pending"
                            ? "text-yellow-500"
                            : order.StockistStatus === "delivered"
                              ? "text-purple-500"
                              : order.StockistStatus === "canceled"
                                ? "text-red-500"
                                : ""
                            }`}
                        >
                          {order.superStockistDeliveryBoyOrderStatus}
                        </p>

                        {/* Display OTP */}
                        <p className="text-xs text-gray-600">OTP: {order.stockistOtp}</p>

                        {/* Delivery Time with Red Color if Time Exceeded */}
                        <p
                          className={`${isTimeExceeded(order.superStockistdeliveryTime) ? "text-red-500" : "text-green-500"
                            }`}
                        >
                          Delivery Time: {new Date(order.superStockistdeliveryTime).toLocaleString()}
                        </p>

                        {/* Link to Show Delivery Boy Details (Uncomment if Needed) */}
                        {/* <Link
                        to={`/DeliveryboyDetails/${order.superStockistdeliveryBoyId?._id}/superstockist`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Show Delivery Boy Details
                      </Link> */}
                      </td>

                    )}

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

                    <td className={`border px-4 py-2 ${order.status === "pending"
                      ? "text-yellow-500"
                      : order.status === "processing"
                        ? "text-blue-500"
                        : order.status === "confirmed"
                          ? "text-green-500"
                          : order.status === "delivered"
                            ? "text-purple-500"
                            : order.status === "canceled"
                              ? "text-red-500"
                              : ""
                      }`}
                    >{order.status}</td>
                    <td className="border px-4 py-2  flex justify-center gap-4 flex-wrap">
                      {activeTab === "processing" && (
                        <Button
                          color="green"
                          className="mr-2 my-2"
                          onClick={() => openModal(order)}
                        >
                          Assign
                        </Button>
                      )}


                      {activeTab === "processing" && (
                        <Button
                          color="red"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        className="bg-green-600 text-white shadow hover:bg-green-500"
                        onClick={() => handleOnclick(order)}
                      >
                        Track Order
                      </Button>
                    </td>



                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="border px-4 py-2 text-center">
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="my-4 flex justify-center items-center gap-4">
          {totalPages > 1 && (
            <>
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <div>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </>
          )}
          {totalPages === 1 && (
            <div>
              <p>Page {currentPage} of {totalPages}</p>
            </div>
          )}
        </div>



      </div>

      {/* Modal for assigning orders */}
      {isModalOpen && (
        <AssignModal
          order={selectedOrder}
          setIsModalOpen={setIsModalOpen}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default SuperStockistOrderHomePage;
