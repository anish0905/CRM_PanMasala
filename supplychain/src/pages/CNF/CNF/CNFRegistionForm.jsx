import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose } from "react-icons/io";
import stateData from "../../../statesData"; // Import stateData

const CNFRegistionForm = ({ onClose, selectedCNF ,fetchCNFs}) => {
  const [formData, setFormData] = useState({
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
    selectedsubAdmin: "",
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

    const requestData = {
      ...formData,
      selectedsubAdmin: formData.selectedsubAdmin,
    };

    try {
      let response;
      if (selectedCNF) {
        response = await axios.put(
          `${URI}/api/CNF/update/${selectedCNF._id}`,
          requestData
        );
        toast.success("User updated successfully!");
      } else {
        response = await axios.post(
          `${URI}/api/CNF/register`,
          requestData
        );
        toast.success("User registered successfully!");
      }
      fetchCNFs();

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
        selectedsubAdmin: "",
        district: "", // Reset district on form submission
      });
      onClose();
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.error || error.message);
      toast.error("Registration failed!");
    }
  };

  // Effect to pre-fill data when editing an existing sub-admin
  useEffect(() => {
    if (selectedCNF) {
      setFormData({
        username: selectedCNF.username,
        email: selectedCNF.email,
        address: selectedCNF.address,
        city: selectedCNF.city,
        pinCode: selectedCNF.pinCode,
        state: selectedCNF.state,
        district: selectedCNF.district || "", // Pre-fill district if available
        mobileNo: selectedCNF.mobileNo || "",
        
      });
    }
  }, [selectedCNF]);

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
            {selectedCNF ? "Update Delivery Boy" : "Registration"}
          </h4>
          <IoMdClose
            onClick={onClose}
            className="cursor-pointer text-2xl text-gray-600"
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
            <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile No</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
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
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select State</option>
              {stateData.map((state, index) => (
                <option key={index} value={state.state}>{state.state}</option>
              ))}
            </select>
          </div>

          {/* District */}
          {formData.state && (
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select District</option>
                {getDistricts(formData.state).map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </select>
            </div>
          )}

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
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
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
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
            <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">Pin Code</label>
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
          <div className="mt-4">
            <button
              type="submit"
              className="w-full cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              {selectedCNF ? "Update" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CNFRegistionForm;
