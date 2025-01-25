import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const ShopInspectionModule = ({ onClose, fetchShops, shopData }) => {
  const URI = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const FEA_id = localStorage.getItem("FEA_id");

  const [formData, setFormData] = useState({
    fieldManagerId: localStorage.getItem("fieldManager_Id") || "",
    shop_name: "",
    shop_address: "",
    shop_contact_number: "",
    shop_owner_name: "",
    Feedback_Provided: "",
    shop_Location: "",
    productId: [],
    showCaseTestId: "",
    FEA_id: FEA_id,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const isUpdating = !!shopData;

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev) => ({
              ...prev,
              shop_Location: `${latitude}, ${longitude}`,
            }));
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            toast.error("Could not fetch location.");
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
      }
    };

    const initializeData = () => {
      const storedData = localStorage.getItem("myData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        const reviewIds = parsedData.map(
          (data) => data?.review?.data?._id || ""
        );
        const productIds = parsedData.map((data) => data?.Product?._id || "");

        setFormData((prev) => ({
          ...prev,
          productId: productIds,
          showCaseTestId: reviewIds,
        }));
      }
    };

    fetchLocation();
    initializeData();

    if (isUpdating && shopData) {
      setFormData({
        ...shopData,
        fieldManagerId: localStorage.getItem("fieldManager_Id") || "",
      });
      if (shopData.photo) {
        setImagePreview(`${URI}/${shopData.photo}`);
      }
    }
  }, [isUpdating, shopData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "shop_contact_number") {
      if (!/^\d*$/.test(value) || value.length > 10) {
        return;
      }
    }

    if (
      (name === "shop_name" && value.length > 30) ||
      (name === "shop_address" && value.length > 50) ||
      (name === "shop_owner_name" && value.length > 30) ||
      (name === "Feedback_Provided" && value.length > 50)
    ) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateContactNumber = (number) => /^[0-9]{10}$/.test(number);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateContactNumber(formData.shop_contact_number)) {
      toast.error("Please enter a valid 10-digit contact number.");
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(
        key,
        Array.isArray(value) ? JSON.stringify(value) : value
      );
    });

    if (selectedImage) formDataObj.append("photo", selectedImage);

    try {
      const endpoint = isUpdating
        ? `${URI}/api/inspectionShop/update/inspections/${shopData._id}`
        : `${URI}/api/inspectionShop/create`;

      await axios({
        method: isUpdating ? "put" : "post",
        url: endpoint,
        data: formDataObj,
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Success!",
        text: isUpdating
          ? "Shop inspection data updated successfully!"
          : "Shop inspection data submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Clear local storage
        localStorage.removeItem("myData");

        // Redirect to "showcase" page
        navigate("/showcase");

        // Reset the form and other states
        setFormData({
          fieldManagerId: localStorage.getItem("fieldManager_Id") || "",
          shop_name: "",
          shop_address: "",
          shop_contact_number: "",
          shop_owner_name: "",
          Feedback_Provided: "",
          shop_Location: "",
          productId: [],
          showCaseTestId: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
        fetchShops();
        onClose();
      });
    } catch (error) {
      console.error("Error submitting data:", error.response?.data || error);
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="h-screen lg:fixed top-0 left-0 lg:w-64 ">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 lg:ml-80 overflow-y-auto">
        <ToastContainer />
        <Card
          color="transparent"
          shadow={false}
          className="p-6 w-full lg:px-[10%]"
        >
          <div className="flex justify-center mb-4 mt-20">
            <Typography variant="h4" className="text-[#1e40af]">
              {isUpdating ? "Update Shop Inspection" : "Add New Vendor"}
            </Typography>
          </div>
          <form
            className="w-full space-y-4 bg-white shadow-lg p-4 rounded-lg max-w-8xl"
            onSubmit={handleSubmit}
          >
            {[
              "shop_name",
              "shop_address",
              "shop_contact_number",
              "shop_owner_name",
            ].map((field, index) => (
              <div key={index}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </label>
                <Input
                  id={field}
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  required
                  className="p-4"
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="Feedback_Provided"
                className="block text-sm font-medium text-gray-700"
              >
                Feedback Provided
              </label>
              <Textarea
                id="Feedback_Provided"
                name="Feedback_Provided"
                value={formData.Feedback_Provided}
                onChange={handleChange}
                placeholder="Provide Feedback"
                className="p-4"
              />
            </div>
            <div className="p-4">
              <label
                htmlFor="photoUpload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Photo
              </label>
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full px-4 py-2 border rounded-md"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="mt-4 h-32 w-32 object-cover rounded-lg"
                />
              )}
            </div>
            <Button type="submit" className="w-full bg-[#1e40af] p-4">
              {isUpdating ? "Update" : "Submit"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ShopInspectionModule;
