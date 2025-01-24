import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import ManagementSidebar from "../../../ManagementSidebar";
import ManagementSideBarModal from "../../../ManagementChart/ManagementSideBarModal";

import RegisterFieldManager from "./RegisterOrEditFieldManager";

const ListOfRegisterdField = () => {
  const [filedManagers, setFiledManagers] = useState([]);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name"); // Fixed to match backend field
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFiledManagers();
  }, []);

  const fetchFiledManagers = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/fieldManager/getFieldManager`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filedManagers");
      }
      const data = await response.json();
      const FieldManagers = data.filter((manager) => manager.role === "FieldManager");
      setFiledManagers(FieldManagers);
    } catch (error) {
      console.error("Error fetching filedManagers:", error);
    }
  };

  const handleRegisterButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredAndSortedFiledManagers = () => {
    return filedManagers
      .filter((filedManager) => {
        const term = searchTerm.toLowerCase();

        // Matching search term against name, address, or email
        const matchesSearchTerm =
          filedManager.name.toLowerCase().includes(term) ||
          filedManager.address.toLowerCase().includes(term) ||
          filedManager.email.toLowerCase().includes(term);

        // Matching status filter
        const matchesStatus = selectedStatus
          ? filedManager.status === selectedStatus
          : true;

        // Matching state filter
        const matchesState = selectedState
          ? filedManager.state === selectedState
          : true;

        // Return true if all filters match
        return matchesSearchTerm && matchesStatus && matchesState;
      })
      .sort((a, b) => {
        const aValue = a[sortField].toLowerCase();
        const bValue = b[sortField].toLowerCase();
        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : 1;
        }
        return aValue > bValue ? -1 : 1;
      });
  };

  const paginatedFiledManagers = () => {
    const filteredManagers = filteredAndSortedFiledManagers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredManagers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    filteredAndSortedFiledManagers().length / itemsPerPage
  );

  return (
    <div className="flex gap-6 bg-[#dbeafe] w-full">
      {/* Sidebar */}
      <div className="h-screen md:block lg:block hidden">
        <ManagementSidebar />
      </div>

      {/* Main Content */}
      <div className="w-[80%] lg:ml-80 md:ml-40 font-serif lg:p-5 md:p-5 p-4 justify-center">
        <div className="flex items-center flex-wrap lg:justify-end md:justify-end justify-center lg:gap-10 md:gap-5 gap-1 lg:h-28 h-16 bg-[#93c5fd] rounded-xl lg:my-5 md:my-5 my-2">
          <div className="lg:hidden md:hidden block">
            <ManagementSideBarModal />
          </div>
          <p className="lg:text-2xl md:text-xl text-xs font-bold border-2 border-[rgb(140,160,226)] p-2 rounded-lg bg-[#dbeafe]">
            Field Manager
          </p>
          <Button
            color="blue"
            onClick={handleRegisterButtonClick}
            className="lg:mr-12 lg:-ml-2 md:mr-8 mr-2 lg:text-md md:text-md text-xs bg-[#1e40af]"
          >
            Register
          </Button>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50 bg-white p-8 rounded-lg shadow-lg">
              <RegisterFieldManager
                onClose={handleCloseModal}
                fetchFiledManagers={fetchFiledManagers}
              />
            </div>
          </div>
        )}

        <div className="container mx-auto py-8">
          <div className="bg-[#1e40af] text-black rounded-xl p-4">
            <h2 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
              Field Manager
            </h2>
            <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 my-4 ">
              <input
                type="text"
                placeholder="Search by Name, Address, or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="name">Name</option>
                <option value="address">Address</option>
                <option value="email">Email</option>
              </select>
              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                id="state"
                name="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                required
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select your state
                </option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            <div
              className="overflow-x-auto overflow-y-auto"
              style={{ maxHeight: "600px" }}
            >
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#93c5fd] text-black sm:text-sm">
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                      Name
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                      Email
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                      Mobile Number
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                      Address
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                      State
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFiledManagers().map((filedManager) => (
                    <tr
                      key={filedManager._id}
                      className="bg-gray-200 border-b-2 border-blue-200"
                    >
                      <td className="px-2 py-4 md:text-lg text-xs text-left">
                        {filedManager.name}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">
                        {filedManager.email}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">
                        {filedManager.phoneNo}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">
                        {filedManager.address}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">
                        {filedManager.state}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">
                        {filedManager.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="flex items-center justify-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOfRegisterdField;
