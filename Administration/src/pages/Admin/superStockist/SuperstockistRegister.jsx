import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../constants";
import { IoMdClose } from "react-icons/io";

const SuperstockistRegister = ({ onClose, selectSuperStockist }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "India",
    phoneNo: "",
    address: "",
    state: "",
    pinCode: "",
    city: "",
    wareHouseName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    for (const key in formData) {
      if (!formData[key]) {
        toast.error(`${key} is required!`);
        return;
      }
    }

    try {
      const response = selectSuperStockist
        ? await axios.put(
            `${BASE_URL}/api/superstockist/${selectSuperStockist._id}`,
            formData
          )
        : await axios.post(`${BASE_URL}/api/superstockist/register`, formData);

      console.log("Response:", response.data);
      toast.success(
        selectSuperStockist
          ? "Superstockist updated successfully!"
          : "Superstockist registered successfully!"
      );

      // Clear form data after successful submission
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "India",
        phoneNo: "",
        address: "",
        state: "",
        pinCode: "",
        city: "",
        wareHouseName: "",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      console.error("Error:", errorMessage);
    }
  };

  useEffect(() => {
    if (selectSuperStockist) {
      setFormData({
        username: selectSuperStockist.username,
        email: selectSuperStockist.email,
        phoneNo: selectSuperStockist.phoneNo,
        address: selectSuperStockist.address,
        city: selectSuperStockist.city,
        pinCode: selectSuperStockist.pinCode,
        state: selectSuperStockist.state,
        wareHouseName: selectSuperStockist.wareHouseName,
      });
    }
  }, [selectSuperStockist]);

  return (
    <div className="h-full flex justify-center items-center">
      <ToastContainer />
      <Card color="transparent" shadow={false} className="w-full max-w-md p-2">
        <Typography variant="h4" className="text-[#1e40af]">
          {selectSuperStockist ? "Update super Stockist" : "Registration"}
        </Typography>
        <IoMdClose
          onClick={onClose}
          className="absolute top-4 right-3 cursor-pointer  text-2xl"
        />
        <form onSubmit={handleSubmit} className="mt-8">
          <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4 ">
            <div>
              <Input
                size="lg"
                placeholder="Your Name"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <Input
              size="lg"
              placeholder="Your Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="Phone Number"
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="Pin Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              size="lg"
              placeholder="Warehouse Name"
              name="wareHouseName"
              value={formData.wareHouseName}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="mt-4 bg-[#1e40af]" fullWidth>
            {selectSuperStockist ? "Update" : "submit"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SuperstockistRegister;
