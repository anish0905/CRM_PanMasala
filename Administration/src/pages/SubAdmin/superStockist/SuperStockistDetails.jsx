import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { TbHomeStats } from "react-icons/tb";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import SidebarModal from "../sidebar/SidebarModel";
import Sidebar from "../sidebar/Sidebar";
import SuperstockistRegister from "./SuperstockistRegister";
import AdminSidebar from "../../Admin/AdminSidebar";
import AdminSideBarModal from "../../Admin/AdminSideBarModal";
import RightSideDrawer from "../../../components/RightSideDrawer";

const superstockistDetails = () => {
  const [superstockists, setsuperstockists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedsuperstockist, setSelectedsuperstockist] = useState();
  const email = localStorage.getItem("email");
  const currentUserId = localStorage.getItem("userId");
  const { name, role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const URI = import.meta.env.VITE_API_URL;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Change this for different pagination sizes

  useEffect(() => {
    fetchSuperStockists();
  }, []);

  const fetchSuperStockists = async () => {
    try {
      const response =
         await fetch(`${URI}/api/superstockist/getAlluser`)
          

      if (!response.ok) {
        throw new Error("Failed to fetch superstockists");
      }

      const data = await response.json();
      setsuperstockists(data);
    } catch (error) {
      console.error("Error fetching superstockists:", error);
    }
  };

  const handleRegisterButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredAndSortedsuperstockists = () => {
    return superstockists
      .filter((superstockist) => {
        const term = searchTerm.toLowerCase();
        return (
          superstockist.username.toLowerCase().includes(term) ||
          superstockist.state.toLowerCase().includes(term) ||
          superstockist.email.toLowerCase().includes(term)
        );
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

  // Pagination logic
  const paginatedsuperstockists = () => {
    const filteredsuperstockists = filteredAndSortedsuperstockists();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredsuperstockists.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(
    filteredAndSortedsuperstockists().length / itemsPerPage
  );

  const handleDeleteClick = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      buttonsStyling: false, // Disable SweetAlert2 default button styling
      customClass: {
        confirmButton: "bg-red-500 text-white px-4 py-2 rounded-md mx-2", // Add margin to the button
        cancelButton: "bg-gray-500 text-white px-4 py-2 rounded-md mx-2", // Add margin to the button
      },
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(`${URI}/api/superstockist/${id}`, {
          method: "DELETE",
        });
        fetchSuperStockists();
        Swal.fire("Deleted!", "Super Stockist has been deleted.", "success");
      } catch (error) {
        console.error("Error Super Stockist:", error);
        Swal.fire("Error", "Could not delete Super Stockist", "error");
      }
    }
  };

  const handleUpdate = (deliveryBoy) => {
    setSelectedsuperstockist(deliveryBoy);
    setShowModal(true);
  };

  const handleInventory = (user) => {
    navigate(`/manage/Inventory/${user._id}/${role}/superstockist`, {
      state: {
        user: user,
      },
    });
  };

  return (
    <div className="flex gap-6  min-h-sreen w-full">
      {role === "Sub-Admin" && (
        <div className="min-h-screen  lg:block hidden">
          <Sidebar />
        </div>
      )}
      {role === "Admin" && (
       <div className="min-h-screen  lg:block hidden">
       <AdminSidebar />
     </div>
      )}

      <div className="lg:ml-80 font-serif w-full  md:p-5 p-4">
        <div className=" bg-[#93c5fd] rounded-md shadow p-4 flex gap-4 items-center justify-between">
          <h1 className="flex-grow text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
            {name === "user"
              ? "Manage Super Stockist"
              : name === "stock"
              ? "Super Stockist Inventory"
              : "Super Stockist Registration"}
          </h1>
          <RightSideDrawer/>
          {name === "Registration" && (
            <button
              color="blue"
              onClick={handleRegisterButtonClick}
              className="lg:mr-12 lg:-ml-2 md:mr-8 mr-2 lg:text-md md:text-md  p-3 bg-[#1e40af] rounded-md text-white text-lg  font-semibold cursor-pointer"
            >
              Register
            </button>
          )}
          {email && (
            <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
              {email}
            </div>
          )}
          {role === "Sub-Admin" && (
            <div className="lg:hidden block">
              <SidebarModal />
            </div>
          )}
          {role === "Admin" && (
            <div className="lg:hidden block">
              <AdminSideBarModal/>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center w-full">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50   w-full ">
              <SuperstockistRegister
                onClose={handleCloseModal}
                selectedsuperstockist={selectedsuperstockist}
                fetchsuperstockists={fetchSuperStockists}
              />
            </div>
          </div>
        )}

        <div className=" py-8">
          <div className="bg-[#1e40af]  rounded-xl p-4">
            <h2 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
              Super Stockist List ({superstockists.length||0})
            </h2>
            <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 my-4 text-white ">
              <input
                type="text"
                placeholder="Search by Username, State, or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div
              className="overflow-x-auto overflow-y-auto"
              style={{ maxHeight: "600px" }}
            >
              <table className="min-w-full text-center ">
                <thead>
                  <tr className="bg-[#93c5fd] text-black sm:text-sm">
                    <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                      Name
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                      Email
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                      Phone No
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                      State
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                      District
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                      City
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                      Address
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs   border-r-2 border-white">
                      PinCode
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedsuperstockists().map((superstockist) => (
                    <tr
                      key={superstockist._id}
                      className="bg-gray-200 border-b-2 border-blue-200"
                    >
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {superstockist.username}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {superstockist.email}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {superstockist.mobileNo}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {superstockist.state}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {superstockist.district}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {superstockist.city}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {superstockist.address}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis  border-r-2 border-white">
                        {superstockist.pinCode}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {name != "stock" && (
                          <>
                            <button
                              onClick={() => handleUpdate(superstockist)}
                              className="bg-blue-500 text-white p-2 rounded cursor-pointer"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteClick(superstockist._id)}
                              className="bg-red-500 text-white p-2 rounded ml-2 cursor-pointer"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {name === "stock" && (
                          <button
                            onClick={() => handleInventory(superstockist)}
                            className="bg-yellow-500 text-white p-2 rounded ml-2 cursor-pointer"
                          >
                            <TbHomeStats />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          {currentPage > 1 && (
            <button
              onClick={handlePrevPage}
              className="p-2 bg-gray-300 rounded"
            >
              Previous
            </button>
          )}
          <span className="self-center">
            {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <button
              onClick={handleNextPage}
              className="p-2 bg-gray-300 rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default superstockistDetails;
