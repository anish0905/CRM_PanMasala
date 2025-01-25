import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { BASE_URL } from "../../../constants";

const DispatchInventoryForm = ({ onClose, fetchInventory, selectInvetery }) => {
  const [formData, setFormData] = useState({
    inventoryId: selectInvetery._id,
    issuedTo: "",
    quantity: "",
    productId: selectInvetery.productId._id,
  });
  const userId = localStorage.getItem("currentUserId")
  const [superStockists, setSuperStockists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch super stockists
  useEffect(() => {
    const fetchSuperStockists = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/executives/superStockist/${userId}`);
        setSuperStockists(response.data); // Assuming the API returns an array of super stockists
      } catch (error) {
        console.error("Error fetching super stockists:", error);
      }
    };
    fetchSuperStockists();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation: Check if quantity exceeds available stock
  if (Number(formData.quantity) > selectInvetery.remainingStock) {
    Swal.fire({
      icon: "error",
      title: "Invalid Quantity",
      text: `The entered quantity (${formData.quantity}) exceeds the available stock (${selectInvetery.remainingStock}).`,
    });
    return; // Stop form submission
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/superstockistinventory/dispatch`,
      {
        ...formData,
        quantity: Number(formData.quantity), // Ensure quantity is a number
      }
    );

    // Show success message using SweetAlert2
    Swal.fire({
      icon: "success",
      title: "Stock Dispatched",
      text: response.data.message,
    });

    fetchInventory(); // Refresh inventory after successful dispatch
    onClose();
  } catch (error) {
    // Show error message using SweetAlert2
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "An error occurred while dispatching stock.",
    });
  }
};


  // Filter super stockists based on search term
  const filteredSuperStockists = superStockists.filter((stockist) =>
    stockist.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stockist.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stockist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stockist.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stockist.wareHouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stockist.phoneNo.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    stockist.pinCode.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Dispatch Inventory</h2>

      {/* Selected product details */}
      <div className="mb-4">
        <div className="border p-4 rounded-lg text-center">
          <img
            src={
              selectInvetery.productId.image
                ? `${BASE_URL}/uploads/${selectInvetery.productId.image}`
                : "https://via.placeholder.com/300"
            }
            alt={selectInvetery.productId.title || "Product"}
            className="w-full h-64 object-contain rounded-lg mb-4"
          />
          <div className="space-y-2 text-gray-800">
            <p className="text-lg font-semibold">
             {selectInvetery.productId.title}
            </p>
            <p className="text-sm text-gray-600">
              {selectInvetery.productId.description}
            </p>
            <p className="text-sm">
              <strong>Stock Available:</strong> {selectInvetery.initialStock}
            </p>
            <p className="text-sm">
              <strong>Remaining Stock:</strong> {selectInvetery.remainingStock}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Super Stockist Dropdown */}
        <div>
          <label htmlFor="issuedTo" className="block font-medium mb-1">
            Issued To ( Stockist)
          </label>
          <input
            type="text"
            placeholder="Search Super Stockist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <select
            id="issuedTo"
            name="issuedTo"
            value={formData.issuedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Super Stockist</option>
            {filteredSuperStockists.map((stockist) => (
              <option key={stockist._id} value={stockist._id}>
                {stockist.username} ({stockist.state})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label htmlFor="quantity" className="block font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Dispatch Stock
        </button>
      </form>
    </div>
  );
};

export default DispatchInventoryForm;
