import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../constants";
import axios from "axios";

const AssignModal = ({ order, setIsModalOpen, fetchData }) => {
  const [formData, setFormData] = useState({
    deliveryBoyId: "",
    deliveryTime: "",
  });
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [filteredDeliveryBoys, setFilteredDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [stockist, setStockists] = useState(null);

  
  const userId = localStorage.getItem("currentUserId");

  useEffect(() => {
    fetchDeliveryBoys();
    fetchStockDetails();
  }, [order]);

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/superStockist/develiveyBoy/superstockist/${userId}`);
      if (Array.isArray(response.data.data)) {
        setDeliveryBoys(response.data.data);
        setFilteredDeliveryBoys(response.data.data);
      } else {
        setDeliveryBoys([]);
        setFilteredDeliveryBoys([]);
        setError("Unexpected response format for delivery boys.");
      }
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
      setError("Error fetching delivery boys. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStockDetails = async () => {
    const email = order.stockistEmail;
    try {
      const response = await axios.post(`${BASE_URL}/api/executives/email`, {
        email: email,
      });
      setStockists(response.data);
    } catch (error) {
      console.error("Error fetching stockist:", error);
      setError("Error fetching stockist details. Please try again later.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = deliveryBoys.filter(
      (boy) =>
        boy.username.toLowerCase().includes(query) ||
        boy.email.toLowerCase().includes(query) ||
        boy.state.toLowerCase().includes(query) ||
        boy.pinCode.includes(query) ||
        boy.address.toLowerCase().includes(query)
    );
    setFilteredDeliveryBoys(filtered);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      deliveryBoyId: e.target.value, // Set deliveryBoyId directly
    });
  };

  const handleRandomSelect = () => {
    if (filteredDeliveryBoys.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredDeliveryBoys.length);
      const randomDeliveryBoy = filteredDeliveryBoys[randomIndex];
      setFormData({
        ...formData,
        deliveryBoyId: randomDeliveryBoy._id,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.deliveryBoyId || !formData.deliveryTime) {
      setError("Please select a delivery boy and set the delivery time.");
      return;
    }

    try {
      const dataToSubmit = {
        deliveryBoyId: formData.deliveryBoyId,
        superStockistDeliveryBoyOrderStatus:"pending",
        superStockistdeliveryTime: formData.deliveryTime,
      };

      const response = await fetch(
        `${BASE_URL}/api/panshop/order/assignedTosuperStockistDeliverBoy/${order._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        console.log("Data submitted successfully");
        setIsModalOpen(false);
        fetchData(); // Refresh the data after successful update
      } else {
        setError("Failed to assign delivery boy. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Error submitting data. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
        <div className="bg-white p-6 rounded-xl">
          <h2>Loading Delivery Boys...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
      <div className="bg-[#F9FAFB] p-6 rounded-xl relative w-96">
        <h2 className="text-3xl font-semibold mb-6 text-center underline text-[#1e40af]">
          Order Details
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="gap-6 mb-6 border-[1px] border-black rounded-md p-4">
          <h1 className="text-center text-2xl py-2">Stockist Details</h1>
          <p className="mb-1">
            <strong className="pr-3"> Email:</strong>{" "}
            {stockist?.email || "Loading..."}
          </p>
          <p className="mb-1">
            <strong className="pr-3"> State:</strong>{" "}
            {stockist?.state || "Loading..."}
          </p>
          <p className="mb-1">
            <strong className="pr-3"> City:</strong>{" "}
            {stockist?.city || "Loading..."}
          </p>
          <p className="mb-1">
            <strong className="pr-3">Address:</strong>{" "}
            {stockist?.address || "Loading..."}{" "}
            {stockist?.pinCode || "Loading..."}
          </p>
          <p className="mb-1">
            <strong className="pr-3">State:</strong> {order.panShopOwnerstate}
          </p>
        </div>

        <div className="mb-6 border border-blue-600 p-4">
          <p className="text-lg font-semibold">Products:</p>
          {order.products.map((product, index) => (
            <div key={index} className="flex justify-between">
              <p>{product.productName}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Price: ₹{product.price}</p>
            </div>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Delivery Boys by name, email, state, etc."
          className="p-2 rounded border border-gray-400 w-full mb-4"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <select
              name="assignTo"
              value={formData.deliveryBoyId}
              onChange={handleChange}
              className="p-2 rounded border border-gray-400 w-3/4"
            >
              <option value="">Select Delivery Boy</option>
              {filteredDeliveryBoys.map((deliveryBoy) => (
                <option key={deliveryBoy._id} value={deliveryBoy._id}>
                  {deliveryBoy.username} - {deliveryBoy.state} ({deliveryBoy.pinCode})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2"
              onClick={handleRandomSelect}
            >
              Choose Random
            </button>
          </div>

          <input
            type="datetime-local"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={(e) =>
              setFormData({ ...formData, deliveryTime: e.target.value })
            }
            placeholder="Delivery Time"
            className="p-2 rounded border border-gray-400 w-full"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white py-2 px-4 rounded ml-2 hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignModal;
