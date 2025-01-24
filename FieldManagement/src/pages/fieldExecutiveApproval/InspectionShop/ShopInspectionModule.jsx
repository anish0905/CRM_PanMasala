import React, { useState } from "react";
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import Swal from "sweetalert2";
import axios from "axios";

const ShopInspectionModule = ({ onClose, fetchShops, shopData }) => {
  const [status, setStatus] = useState(shopData?.status || "pending");
  const [shopName, setShopName] = useState(shopData?.shop_name || "");
  const [shopContactNumber, setShopContactNumber] = useState(
    shopData?.shop_contact_number || ""
  );
  const [shopAddress, setShopAddress] = useState(shopData?.shop_address || "");
  const [shopOwnerName, setShopOwnerName] = useState(
    shopData?.shop_owner_name || ""
  );
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fieldManager_id = localStorage.getItem("fieldManager_Id");

  const BASE_URL = import.meta.env.VITE_API_URL;

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Confirm action using SweetAlert
  const confirmAction = (actionStatus) => {
    Swal.fire({
      title: `Are you sure you want to ${actionStatus} this shop?`,
      icon: "warning",
      html: `
        <p>Did you Verify through call:</p>
        <div style="margin-top: 10px;">
          <input type="checkbox" id="confirmationCheckbox" />
          <label for="confirmationCheckbox" style="margin-left: 5px;">Call verification complete</label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionStatus} it!`,
      preConfirm: () => {
        const checkbox = document.getElementById("confirmationCheckbox");
        if (!checkbox.checked) {
          Swal.showValidationMessage("You need to confirm by checking the box.");
          return false;
        }
        return true;
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        confirmButton.disabled = true;
  
        const checkbox = document.getElementById("confirmationCheckbox");
        checkbox.addEventListener("change", () => {
          confirmButton.disabled = !checkbox.checked;
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(actionStatus);
      }
    });
  };
  

  // Submit the form or update the status
  const handleSubmit = async (status) => {
    try {
      const url = `${BASE_URL}/api/inspectionShop/status/${shopData._id}`;
      const payload = { status,updatedBy:fieldManager_id };

      if (isEditing) {
        const formData = new FormData();
        formData.append("shop_name", shopName);
        formData.append("updatedBy", fieldManager_id);
        formData.append("shop_contact_number", shopContactNumber);
        formData.append("shop_address", shopAddress);
        formData.append("shop_owner_name", shopOwnerName);
        formData.append("status", status);

        if (file) {
          formData.append("photo", file);
        }

        await axios.put(`${BASE_URL}/api/inspectionShop/update/inspections/${shopData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put(url, payload);
      }

      Swal.fire("Success!", "Shop details and status updated successfully!", "success");
      fetchShops(); // Refresh data
      onClose(); // Close modal
    } catch (error) {
      Swal.fire("Error!", "Failed to update shop status. Please try again.", "error");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold text-2xl text-center w-full"
          >
            Shop Inspection - Pending Verification
          </Typography>
          <button
            className="text-red-500 text-xl hover:text-red-700 bg-slate-400 p-2 rounded-full h-8 w-8 flex justify-between items-center content-center"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div className="mb-6">
          <Typography className="text-sm font-semibold text-gray-600 mb-2 rounded-lg">
            Shop Name:
          </Typography>
          <Input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            disabled={!isEditing}
            className="p-2 rounded-md"
          />
        </div>

        <div className="mb-6">
          <Typography className="text-sm font-semibold text-gray-600 mb-2 p-2">
            Phone Number:
          </Typography>
          <Input
            value={shopContactNumber}
            onChange={(e) => setShopContactNumber(e.target.value)}
            disabled={!isEditing}
            className="p-2 rounded-md"
          />
        </div>

        <div className="mb-6">
          <Typography className="text-sm font-semibold text-gray-600 mb-2">
            Shop Address:
          </Typography>
          <Input
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            disabled={!isEditing}
            className="p-2 rounded-md"
          />
        </div>

        <div className="mb-6">
          <Typography className="text-sm font-semibold text-gray-600 mb-2">
            Owner Name:
          </Typography>
          <Input
            value={shopOwnerName}
            onChange={(e) => setShopOwnerName(e.target.value)}
            disabled={!isEditing}
            className="p-2 rounded-md"
          />
        </div>

        <div className="flex justify-between gap-6">
          {!isEditing && (
            <Button
              color="red"
              onClick={() => confirmAction("rejected")}
              className="w-32 py-2 hover:bg-red-600"
            >
              Reject
            </Button>
          )}
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`w-32 py-2 ${isEditing ? "bg-red-500" : "bg-yellow-400"}`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>

          {isEditing ? (
            <Button
              color="blue"
              onClick={() => handleSubmit("re-verify")}
              className="w-32 py-2"
            >
              Submit
            </Button>
          ) : (
            <Button
              color="blue"
              onClick={() => confirmAction("approved")}
              className="w-32 py-2"
            >
              Approve
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ShopInspectionModule;
