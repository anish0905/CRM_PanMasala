import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import ShopInspectionModule from "./ShopInspectionModule";
import Swal from "sweetalert2";
import GoogleMaps from "./GoogleMaps";
import Modal from "react-modal";
import { FaHistory } from "react-icons/fa";

const userDetails = localStorage.getItem("email");
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../SubAdmin/sidebar/Sidebar";
import AdminSideBarModal from "../../SubAdmin/sidebar/SidebarModel";
import RightSideDrawer from "../../../components/RightSideDrawer";

const VendorRegisterIntrsted = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("shop_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [inspectionId, setInspectionId] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [selectShop, setSelectShop] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const itemsPerPage = 8;
  const [isModalOpen, setModalOpen] = useState(false);
  const [zoomedImageId, setZoomedImageId] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseImgModal = () => setModalOpen(false);

  const { name } = useParams();

  const fetchShops = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/inspectionShop/getinspection/shop`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }
      const data = await response.json();
      const pendingVendor = data.filter((v) => v.status === name);
      setShops(pendingVendor);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
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
          didOpen: () => Swal.showLoading(),
        });

        // Send DELETE request
        await axios.delete(`${BASE_URL}/api/inspectionShop/delete/${id}`);

        // Success message with custom OK button color
        Swal.fire({
          title: "Deleted!",
          text: "The vendor has been removed.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "custom-ok-button",
          },
        });

        // Refresh data
        fetchShops();
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

  const filteredAndSortedShops = () => {
    // If no date is selected, show all data
    const currentDate = selectedDate || "";

    const filteredByDate = currentDate
      ? shops.filter((shop) => {
          const shopDate = new Date(shop.createdAt).toISOString().split("T")[0]; // Extract date part only
          return shopDate === currentDate; // Filter by the selected date
        })
      : shops; // Show all shops if no date is selected

    return filteredByDate
      .filter((shop) => {
        const term = searchTerm.toLowerCase();
        const matchesSearchTerm =
          shop.shop_name.toLowerCase().includes(term) ||
          shop.shop_address.toLowerCase().includes(term) ||
          shop.shop_owner_name.toLowerCase().includes(term);
        const matchesStatus = selectedStatus
          ? shop.status === selectedStatus
          : true;

        return matchesSearchTerm && matchesStatus;
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

  const paginatedShops = () => {
    const filteredShops = filteredAndSortedShops();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredShops.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredAndSortedShops().length / itemsPerPage);

  useEffect(() => {
    fetchShops();
  }, [name]);

  const handleEditButtonClick = (shop) => {
    setSelectShop(shop);
    setEditModal(true);
  };

  const handleHistory = (shop) => {
    console.log(shop); // Ensure you're logging the correct object
    navigate("/manage/vendor/history/", {
      state: shop, // Pass the shop object in state
    });
  };

  const capitalized_name =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <div className="min-h-screen  flex w-full ">
      <div className=" hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1  lg:ml-80  font-serif w-full lg:p-10 md:p-5 ">
        <div className="w-full p-2">
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-50 bg-white w-[80%] p-8 rounded-lg shadow-lg">
                <GoogleMaps
                  onClose={() => setShowModal(false)}
                  inspectionId={inspectionId}
                />
              </div>
            </div>
          )}

          {editModal && selectShop && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-50 bg-white p-8 rounded-lg shadow-lg">
                <ShopInspectionModule
                  onClose={() => setEditModal(false)}
                  shopData={selectShop}
                  fetchShops={fetchShops}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col h-full lg:px-5 my-4">
            <header className="flex items-center content-center justify-between   h-auto py-4 bg-[#93c5fd] rounded-xl lg:px-10 px-5 md:px-10 ">
              <h1 className="md:text-lg text-xs lg:text-xl font-bold text-gray-800 ">
                {capitalized_name} Vendor
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

            <div className="bg-[#1e40af] min-w-full text-black rounded-xl p-4 my-8">
              <h1 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
                {capitalized_name} Vendor ({shops.length || "0"})
              </h1>
              <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 w-full my-4 text-white">
                <input
                  type="text"
                  placeholder="Search by Shop Name, Address, or Owner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded "
                />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 border rounded "
                />
              </div>

              <div className="overflow-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-[#93c5fd] text-black sm:text-sm">
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Shop Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white hidden sm:table-cell">
                        Owner Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Contact
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white hidden md:table-cell">
                        Address
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs">Feedback</th>
                      <th className="px-2 py-4 md:text-lg text-xs hidden md:table-cell">
                        Photos
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs">Updated</th>
                      <th className="px-2 py-4 md:text-lg text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedShops().length > 0 ? (
                      paginatedShops().map((shop) => (
                        <tr
                          key={shop._id}
                          className="bg-gray-200 border-b-2 border-blue-200"
                        >
                          <td className="px-2 py-4">{shop.shop_name}</td>
                          <td className="px-2 py-4 hidden sm:table-cell">
                            {shop.shop_owner_name}
                          </td>
                          <td className="px-2 py-4">
                            {shop.shop_contact_number}
                          </td>
                          <td className="px-2 py-4 hidden md:table-cell">
                            {shop.shop_address}
                          </td>
                          <td className="px-2 py-4">
                            {shop.Feedback_Provided || "No feedback yet"}
                          </td>
                          <td className="px-2 py-4 hidden md:table-cell">
                            {shop?.Photos_Uploaded ? (
                              <>
                                <img
                                  className="w-20 h-20 object-cover cursor-pointer"
                                  src={`${BASE_URL}/${shop.Photos_Uploaded}`}
                                  alt="Shop"
                                  onClick={() => {
                                    setZoomedImageId(
                                      `${BASE_URL}/${shop.Photos_Uploaded}`
                                    );
                                    setModalOpen(true);
                                  }}
                                />
                                <Modal
                                  isOpen={isModalOpen}
                                  onRequestClose={handleCloseImgModal}
                                  contentLabel="Shop Image"
                                  className="modal-content"
                                  overlayClassName="modal-overlay"
                                >
                                  <div className="flex justify-center items-center">
                                    {zoomedImageId && (
                                      <img
                                        className="max-w-full max-h-screen"
                                        src={zoomedImageId}
                                        alt="Shop"
                                      />
                                    )}
                                  </div>
                                  <button
                                    className="absolute top-2 right-2 bg-red-600 p-2 px-4 rounded-full text-white cursor-pointer"
                                    onClick={handleCloseImgModal}
                                  >
                                    Close
                                  </button>
                                </Modal>
                              </>
                            ) : (
                              "No image uploaded"
                            )}
                          </td>
                          <td>
                            <div>
                              <span className="block text-gray-600">
                                {new Date(shop.updatedAt).toLocaleDateString()}
                              </span>
                              <span className="block text-gray-500">
                                {new Date(shop.updatedAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleEditButtonClick(shop)}
                                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                              >
                                <FaRegEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(shop._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                              >
                                <FaRegTrashAlt />
                              </button>
                              <button
                                onClick={() => handleHistory(shop)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer"
                              >
                                <FaHistory />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterIntrsted;
