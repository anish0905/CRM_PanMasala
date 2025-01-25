import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";  // Import SweetAlert2
import { BASE_URL } from "../../constants";
import { IoMdClose } from "react-icons/io";

const RegisterForm = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    address: "",
    city: "",
    pinCode: "",
    state: "",
    superstockist:"",
  });

  const userId = localStorage.getItem("currentUserId");

  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false); // Track if password is being updated

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        pinCode: user.pinCode || "",
        state: user.state || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    e.preventDefault();
   
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Add superstockist dynamically without resetting state
    const payload = { ...formData, superstockist: userId };
  
    // Validate required fields
    for (const key in payload) {
      if (!payload[key]) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Please fill the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field!`,
        });
        return;
      }
    }
  
    // Password validation (only when password fields are displayed)
    if (isPasswordUpdate && payload.password !== payload.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }
  
    try {
      const endpoint = user
        ? `${BASE_URL}/api/superStockist/develiveyBoy/${user._id}`
        : `${BASE_URL}/api/superStockist/develiveyBoy/`;
      const method = user ? "put" : "post";
  
      await axios[method](endpoint, payload);
  
      Swal.fire({
        icon: 'success',
        title: user ? 'User details updated successfully' : 'User registered successfully',
        showConfirmButton: false,
        timer: 1500,
      });
  
      // Close modal on success
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'An unexpected error occurred',
      });
    }
  };
  

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card color="transparent" shadow={false} className="p-2">
        <Typography variant="h4" className="text-[#1e40af]">
          {user ? "Update User Details" : "Register"}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal text-[#1e40af]">
          {user ? "Update your details." : "Nice to meet you! Enter your details to register."}
        </Typography>
        <form className="mt-8 mb-2 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              size="lg"
              placeholder="Your Name"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              size="lg"
              placeholder="Your Email"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {/* Conditional rendering for password fields */}
          <div className="mb-4">
            <Input
              type="password"
              size="lg"
              placeholder="Password"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {(user && isPasswordUpdate) || !user ? (
            <div className="mb-4">
              <Input
                type="password"
                size="lg"
                placeholder="Confirm Password"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          ) : null}
          <div className="mb-4">
            <Input
              type="tel"
              size="lg"
              placeholder="Phone Number"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="phoneNo"
              id="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              size="lg"
              placeholder="Address"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              size="lg"
              placeholder="City"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              size="lg"
              placeholder="Pin Code"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="pinCode"
              id="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              size="lg"
              placeholder="State"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              name="state"
              id="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="mt-6 bg-[#1e40af] hover:bg-blue-400" fullWidth>
            {user ? "Update" : "Submit"}
          </Button>
        </form>
        <IoMdClose className="absolute top-0 right-0 cursor-pointer text-2xl" onClick={handleCancel} />
      </Card>
    </div>
  );
};

export default RegisterForm;
