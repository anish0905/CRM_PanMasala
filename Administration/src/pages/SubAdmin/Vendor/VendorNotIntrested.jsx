import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "../../SubAdmin/sidebar/Sidebar";
import AdminSideBarModal from "../../SubAdmin/sidebar/SidebarModel";
import RightSideDrawer from "../../../components/RightSideDrawer";

const VendorNotInterested = () => {
  // State for data, search query, and pagination
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const userDetails = localStorage.getItem("email");
  const BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/vendornotIntrested/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmResult.isConfirmed) {
        // Optional: Show a loading state
        Swal.fire({
          title: "Deleting...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Send DELETE request
        await axios.delete(`${BASE_URL}/api/vendornotIntrested/${id}`);

        // Success message with custom OK button color
        Swal.fire({
          title: "Deleted!",
          text: "The vendor has been removed.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "custom-ok-button", // Assign your custom class here
          },
          buttonsStyling: false, // Disable default styling to apply custom styles
        });

        // Refresh data
        fetchData(); // Ensure this function is defined to refresh your data
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message ||
          "There was an issue deleting the vendor.",
        "error"
      );
    }
  };

  // Filtered data based on the search query
  const filteredData = data.filter(
    (item) =>
      item.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactNumber.includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen  flex w-full font-sans  ">
      <div className=" hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1  lg:px-12 lg:ml-72 my-4">
        <header className="flex items-center content-center justify-between   h-auto py-4 bg-[#93c5fd] rounded-xl px-5 ">
          <h1 className="md:text-lg text-xs lg:text-xl font-bold text-gray-800 ">
            NotInterested Vendor
          </h1>

          <div className="flex gap-2 ">
            <RightSideDrawer />
            <div className="lg:flex items-center gap-2 md:flex hidden  ">
              <div className="text-sm lg:text-lg font-bold text-white border-4 border-blue-900 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out">
                {userDetails || "Guest"}
              </div>
            </div>
            <div className="lg:hidden block">
              <AdminSideBarModal />
            </div>
          </div>
        </header>
        <div className="overflow-x-auto bg-[#1E40AF] my-8 p-6 rounded-md shadow-md">
          <input
            type="text"
            placeholder="Search by Shop Name, Owner Name, or Contact Number "
            className="border rounded p-2 w-full mb-4  text-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {/* Data Table */}
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#1e87ff] text-white rounded-md p-4">
                <th className="border border-gray-300 px-4 py-2">Shop Name</th>
                <th className="border border-gray-300 px-4 py-2">Owner Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Contact Number
                </th>
                <th className="border border-gray-300 px-4 py-2">Reason</th>
                <th className="border border-gray-300 px-4 py-2">
                  Other Reason
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100 bg-white">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.shopName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.ownerName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.contactNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.reasonForNotRegistering}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.otherReasonDetails || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <a
                      href={`https://wa.me/${item.contactNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${item.contactNumber}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Call
                    </a>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center my-4">
          {/* Previous Button */}
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Previous
            </button>
          )}

          <span>
            Page {currentPage} of {totalPages}
          </span>

          {/* Next Button */}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorNotInterested;
