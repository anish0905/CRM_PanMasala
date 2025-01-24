import React, { useState, useEffect } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../constants";
import ManagementSidebar from "../../ManagementSidebar";
import ManagementSideBarModal from "../../ManagementChart/ManagementSideBarModal";
import SuperstockistRegister from "../../Register/SuperstockistRegister";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { TbHomeStats } from "react-icons/tb";

const SuperStockist = () => {
  const [superStockists, setSuperStockists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const email = localStorage.getItem("email");
  const [selectedSuperstockist, setSelectedSuperstockist] = useState();


  const { name } = useParams();

  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "asc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuperStockists();
  }, []);

  const fetchSuperStockists = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/superstockist/getAllUser`);
      if (!response.ok) {
        throw new Error("Failed to fetch super stockists");
      }
      const data = await response.json();
      setSuperStockists(data);
    } catch (error) {
      console.error("Error fetching super stockists:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const sortByColumn = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedStockists = [...superStockists].sort((a, b) => {
      if (direction === "asc") {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    });
    setSuperStockists(sortedStockists);
  };

  const filteredStockists = superStockists.filter((stockist) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      stockist.username.toLowerCase().includes(lowerCaseTerm) ||
      stockist.state.toLowerCase().includes(lowerCaseTerm) ||
      stockist.email.toLowerCase().includes(lowerCaseTerm)
    );
  });

  const indexOfLastStockist = currentPage * itemsPerPage;
  const indexOfFirstStockist = indexOfLastStockist - itemsPerPage;
  const currentStockists = filteredStockists.slice(
    indexOfFirstStockist,
    indexOfLastStockist
  );
  const totalPages = Math.ceil(filteredStockists.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-4 py-2 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          } border border-blue-500 rounded`}
        >
          {i}
        </button>
      );
    }
    return <div className="flex justify-center mt-4">{pageNumbers}</div>;
  };

  const handleUpdate = (deliveryBoy) => {
    setSelectedSuperstockist(deliveryBoy);
    setShowModal(true);
  };

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
        const response = await fetch(`${BASE_URL}/api/superstockist/${id}`, {
          method: "DELETE",
        });

        fetchSuperStockists();
        Swal.fire("Deleted!", "Delivery Boy has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting delivery boy:", error);
        Swal.fire("Error", "Could not delete delivery boy", "error");
      }
    }
  };

  const handleInventory = (user)=> {
    navigate(`/manage/Inventory/${user._id}/management/Superstockist`,{
      state: {
        user:user,
      },
    });
  }

  return (
    <div className="flex gap-6  w-full">
      {/* Sidebar */}
      <div className="h-screen md:block lg:block hidden">
        <ManagementSidebar />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-50 bg-white p-8 rounded-lg shadow-lg">
            <SuperstockistRegister
              onClose={handleCloseModal}
              selectSuperStockist={selectedSuperstockist}
            />
          </div>
        </div>
      )}

      <div className="w-[80%] lg:ml-80 md:ml-40 font-serif lg:p-5 md:p-5 p-4 justify-center">
        <header className="bg-[#93c5fd] rounded-md shadow p-4 flex gap-4 items-center justify-between">
          <h1 className="flex-grow text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
            {name === "user"
              ? "Manage Super Stockist"
              : "Super Stockist Inventory"}
          </h1>

          {email && (
            <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
              {email}
            </div>
          )}
          <div className="sm:hidden flex items-center">
            <ManagementSideBarModal />
          </div>
        </header>

        <div className=" bg-[#1e40af] text-black rounded-xl p-2 my-4">
          <h2 className="text-2xl text-white font-bold p-1 mt-1">
            Super Stockist List
          </h2>

          {/* Search Input */}
          <div className="flex gap-4 my-4">
            <input
              type="text"
              placeholder="Search by Username, State, or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div
            className="overflow-x-auto overflow-y-auto"
            style={{ maxHeight: "600px" }}
          >
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#93c5fd] text-black sm:text-sm">
                  <th
                    onClick={() => sortByColumn("username")}
                    className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white cursor-pointer"
                  >
                    Name
                  </th>
                  <th
                    onClick={() => sortByColumn("email")}
                    className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white cursor-pointer"
                  >
                    Email
                  </th>
                  <th
                    onClick={() => sortByColumn("phone")}
                    className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white cursor-pointer"
                  >
                    Phone
                  </th>
                  <th
                    onClick={() => sortByColumn("address")}
                    className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white cursor-pointer"
                  >
                    Address
                  </th>
                  <th
                    onClick={() => sortByColumn("wareHouseName")}
                    className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white cursor-pointer"
                  >
                    Warehouse Name
                  </th>
                  <th
                    onClick={() => sortByColumn("state")}
                    className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white cursor-pointer"
                  >
                    State
                  </th>
                  <th
                    onClick={() => sortByColumn("state")}
                    className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white cursor-pointer"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentStockists.map((superStockist) => (
                  <tr
                    key={superStockist._id}
                    className="bg-gray-200 border-b-2 border-blue-200"
                  >
                    <td className="px-2 py-4 md:text-lg text-xs text-left">
                      {superStockist.username}
                    </td>
                    <td className="px-2 py-4 md:text-lg text-xs text-left">
                      {superStockist.email}
                    </td>
                    <td className="px-2 py-4 md:text-lg text-xs text-left">
                      {superStockist.phoneNo}
                    </td>
                    <td className="px-2 py-4 md:text-lg text-xs text-left">
                      {superStockist.address}
                    </td>
                    <td className="px-2 py-4 md:text-lg text-xs text-left">
                      {superStockist.wareHouseName}
                    </td>
                    <td className="px-2 py-4 md:text-lg text-xs text-left">
                      {superStockist.state}
                    </td>
                    <td className="px-2 py-4 md:text-lg text-xs text-left flex justify-center items-center content-center gap-4">
                      { name === "user" && (<><button
                        onClick={() => handleUpdate(superStockist)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(superStockist._id)}
                        className="bg-red-500 text-white p-2 rounded ml-2"
                      >
                        <MdDelete />
                      </button></>)}
                      {name === "Inventory" && (
                        <button
                          onClick={() => handleInventory(superStockist)}
                          className="bg-yellow-500 text-white p-2 rounded ml-2"
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

          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default SuperStockist;
