import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose } from "react-icons/io";
import stateData from "../../../statesData"; // Import stateData

const DistributorRegister = ({ onClose, selectedsubAdmin, fetchsubAdmins }) => {
  const superstockistId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    superstockist: superstockistId,
    username: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    pinCode: "",
    selectedSuperStockist: "",
    district: "", // To handle district selection
  });

  const URI = import.meta.env.VITE_API_URL;

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle state change to update district options
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, district: "" }); // Reset district on state change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // Check if super stockist already exists

    const requestData = {
      ...formData,
      selectedSuperStockist: formData.selectedSuperStockist,
    };

    try {
      let response;
      if (selectedsubAdmin) {
        response = await axios.put(
          `${URI}/api/superstockist/${selectedsubAdmin._id}`,
          requestData
        );
        toast.success("Super stockist updated successfully!");
      } else {
        response = await axios.post(
          `${URI}/api/superstockist/register`,
          requestData
        );
        toast.success("Super stockist registered successfully!");
      }
      fetchsubAdmins();

      // Reset form after submission
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "India",
        state: "",
        city: "",
        address: "",
        mobileNo: "",
        pinCode: "",
        selectedSuperStockist: "",
        district: "",
      });
      onClose();
    } catch (error) {
      console.error(error.response?.data?.error);
      const errorMessage =
        error.response?.data?.error || "Registration failed!";
      // console.error("Registration failed:", errorMessage);
      toast.error(errorMessage);
    }
  };

  // Effect to pre-fill data when editing an existing sub-admin
  useEffect(() => {
    if (selectedsubAdmin) {
      setFormData({
        username: selectedsubAdmin.username,
        email: selectedsubAdmin.email,
        address: selectedsubAdmin.address,
        city: selectedsubAdmin.city,
        pinCode: selectedsubAdmin.pinCode,
        state: selectedsubAdmin.state,
        district: selectedsubAdmin.district || "",
        mobileNo: selectedsubAdmin.mobileNo || "",
      });
    }
  }, [selectedsubAdmin]);

  // Get districts based on selected state
  const getDistricts = (stateName) => {
    const stateInfo = stateData.find((state) => state.state === stateName);
    return stateInfo ? stateInfo.districts : [];
  };

  return (
    <div className="flex justify-center items-center h-full font-serif ">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-blue-700">
            {selectedsubAdmin ? "Update Super Stockist" : "Registration"}
          </h4>
          <IoMdClose
            onClick={onClose}
            className="cursor-pointer text-2xl text-gray-600"
          />
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          style={{
            maxHeight: "800px",
            overflow: "scroll",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer / Edge
            WebkitOverflowScrolling: "touch", // Enable smooth scrolling for iOS Safari
            WebkitScrollbar: "none", // Chrome/Safari
          }}
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Username"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Email"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobileNo"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile No
            </label>
            <input
              type="text"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Mobile Number"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm Password"
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select State</option>
              {stateData.map((state) => (
                <option key={state.state} value={state.state}>
                  {state.state}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700"
            >
              District
            </label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={!formData.state} // Disable if no state is selected
            >
              <option value="">Select District</option>
              {getDistricts(formData.state).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="City"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Address"
            />
          </div>

          {/* Pin Code */}
          <div>
            <label
              htmlFor="pinCode"
              className="block text-sm font-medium text-gray-700"
            >
              Pin Code
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Pin Code"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              {selectedsubAdmin ? "Update" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DistributorRegister;
