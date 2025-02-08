import React, { useState, useEffect } from "react";
import DistributorSidebar from "../sidebar/DistributorSidebar";
import DistributorBarModal from "../sidebar/DistributorBarModal";
import "../sidebar/DistributorSidebar.css";
import { FaRegEdit } from "react-icons/fa";
import { MdAutoDelete, MdOutlineAssignment } from "react-icons/md";
import Swal from "sweetalert2";
import FEARegistaionForm from "./FEA_Register_Form";
// import RegisterOrEditFieldManagerAdmin from "./registerd/RegisterOrEditFieldManagerAdmin";
import { useNavigate, useParams } from "react-router-dom";
import SMSDrawer from "../../../Component/SMS_Drawer";

const FEA = () => {
  const [filedManagers, setFiledManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFEA, setSelectedFEA] = useState(null);
  const [sortField, setSortField] = useState("name"); // Default sort by name
  const [sortDirection, setSortDirection] = useState("asc");
  const distributors_id = localStorage.getItem("userId");
  const itemsPerPage = 8;
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const { name, route, work } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFEA();
  }, [name]);

  const fetchFEA = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/distributor/feaDetails/${distributors_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch fieldManagers");
      }
      const data = await response.json();
      const adminFieldManagers = data.filter(
        (manager) => manager.role === name
      );
      setFiledManagers(adminFieldManagers);
    } catch (error) {
      console.error("Error fetching fieldManagers:", error);
    }
  };

  const handleRegisterButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditButtonClick = (user) => {
    setSelectedFEA(user);
    setShowModal(true);
  };

  const handleDeleteButtonClick = async (selectedFieldManager) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "This action cannot be undone.",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `${BASE_URL}/api/fieldManager/getFieldManager/delete/${selectedFieldManager}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          Swal.fire({ icon: "success", title: "Delete Successful!" }).then(
            () => {
              fetchFEA();
            }
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: "Something went wrong.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Please try again later.",
      });
    }
  };

  const filteredFiledManagers = () => {
    return filedManagers.filter((filedManager) => {
      const term = searchTerm.toLowerCase();
      const matchesSearchTerm =
        filedManager.name.toLowerCase().includes(term) ||
        filedManager.address.toLowerCase().includes(term) ||
        filedManager.email.toLowerCase().includes(term);
      const matchesState = selectedState
        ? filedManager.state === selectedState
        : true;
      return matchesSearchTerm && matchesState;
    });
  };

  const sortedFiledManagers = () => {
    const filteredManagers = filteredFiledManagers();
    return filteredManagers.sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      if (sortDirection === "asc") return aValue < bValue ? -1 : 1;
      return aValue > bValue ? -1 : 1;
    });
  };

  const paginatedFiledManagers = () => {
    const sortedManagers = sortedFiledManagers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedManagers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredFiledManagers().length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const NavigateToAttendanceRecord = (user) => {
    navigate("/Attendance-Dashboard", {
      state: { user },
    });
  };
  return (
    <div className="min-h-screen flex flex-col sm:flex-row w-full">
      {/* Sidebar */}
      <div className="h-screen hidden sm:block lg:block">
        <DistributorSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 w-full lg:ml-80 font-serif lg:p-10 md:p-5 p-4">
        <div className="bg-[#93c5fd] w-full rounded-md shadow p-4 flex flex-wrap gap-4 items-center justify-between">
          <h1 className="flex-grow text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
            Field Executive Approval
          </h1>
          <div>
            <SMSDrawer />
          </div>
          <div className="flex gap-0">
            <div className="flex gap-[2px] items-center">
              {work === "Registration" && (
                <button
                  onClick={handleRegisterButtonClick}
                  aria-label="Register a new Field Executive"
                  className="lg:text-xl md:text-lg lg:p-3 bg-[#1e40af] hover:bg-[#1d4ed8] focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md text-white p-2 text-xs font-semibold transition-all duration-300 ease-in-out shadow-md"
                >
                  Register
                </button>
              )}
              {email && (
                <div className="sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-2 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
                  {email}
                </div>
              )}
            </div>
          </div>
          <div className="sm:hidden block">
            <DistributorBarModal />
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center w-full bg-opacity-50">
            <div className="z-50 w-full sm:w-[90%] md:w-[75%] lg:w-[60%] xl:w-[50%] rounded-lg p-6 max-h-[90vh] overflow-auto">
              <FEARegistaionForm
                onClose={handleCloseModal}
                fetchFiledManagers={fetchFEA}
                selectedFEA={selectedFEA}
              />
            </div>
          </div>
        )}

        {/* Main content container */}
        <div className=" py-8">
          <div className="bg-[#1e40af] text-black rounded-xl p-4">
            <h2 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
              {name === "fea" ? "Field Executive Approval" : " Field Executive"}{" "}
              List ({filedManagers.length || "0"})
            </h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 my-4 text-white">
              <input
                type="text"
                placeholder="Search by Name, Address, or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <select
                id="state"
                name="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                required
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select your state
                </option>
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
              <table className="w-full">
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
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                      Action
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
                      <td className="px-2 py-4 md:text-lg text-xs text-left flex gap-2 justify-center items-center">
                        {work === "Attendance" ? (
                          <span className="lg:text-3xl text-blue-600 cursor-pointer">
                            <MdOutlineAssignment
                              onClick={() =>
                                NavigateToAttendanceRecord(filedManager)
                              }
                            />
                          </span>
                        ) : (
                          <>
                           <span className="lg:text-3xl text-blue-600 cursor-pointer">
                            <FaRegEdit
                              onClick={() =>
                                handleEditButtonClick(filedManager)
                              }
                            />
                            </span>
                            <span className="lg:text-3xl text-red-600 cursor-pointer">
                            <MdAutoDelete
                              onClick={() =>
                                handleDeleteButtonClick(filedManager._id)
                              }
                            />
                               </span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FEA;
