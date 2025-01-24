import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import ShopInspectionModule from "./ShopInspectionModule";
import Swal from "sweetalert2";
import FEASidebar from "../../../components/Sidebar/FEASidebar";
import GoogleMaps from "./GoogleMaps";
import Modal from "react-modal";

const fieldManager_id = localStorage.getItem("fieldManager_Id");
const userDetails = localStorage.getItem("email");

const ListOfInspection = () => {
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
  const [inspectionShop, setInspectionShop] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // Added selectedDate state
  const itemsPerPage = 6;
  const [isModalOpen, setModalOpen] = useState(false);
  const [zoomedImageId, setZoomedImageId] = useState(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseImgModal = () => setModalOpen(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchShops = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/inspectionShop/getinspection/shop/${fieldManager_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }
      const data = await response.json();
      const pendingVendor = data.filter((v) => v.status === "pending");

      setShops(pendingVendor); // Save the shops data
      // console.log(pendingVendor.length);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Get the date part (YYYY-MM-DD)
  };

  const filteredAndSortedShops = () => {
    // Use selectedDate for filtering if it's set; otherwise, return all shops
    const currentDate = selectedDate ? selectedDate : null;

    // Filter shops based on createdAt and updatedAt logic
    const filteredByDate = currentDate
      ? shops.filter((shop) => {
          const shopCreatedDate = new Date(shop.createdAt)
            .toISOString()
            .split("T")[0];
          const shopUpdatedDate = new Date(shop.updatedAt)
            .toISOString()
            .split("T")[0];

          // Include in results only if:
          // 1. The shop was created on the selected date and not updated.
          // 2. The shop was updated on the selected date.
          if (shopUpdatedDate === currentDate) {
            return true; // Show shops updated on the selected date
          }

          return (
            shopCreatedDate === currentDate && shopUpdatedDate !== currentDate
          ); // Show only if created on selected date and not updated
        })
      : shops; // Return all shops if no date is selected

    // Apply search and status filters
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
  }, []);

  const handleEditButtonClick = (shop) => {
    setSelectShop(shop);
    setEditModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex w-full">
      <div className="h-screen lg:fixed  top-0 left-0  lg:w-64">
        <FEASidebar />
      </div>
      <div className="flex-1 p-6 lg:ml-80 overflow-y-auto">
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

          <div className="container mx-auto ">
            <header className="bg-blue-300 rounded-md shadow-md p-4 flex justify-between items-center gap-4">
              <h1 className="md:text-lg text-xs lg:text-xl font-bold text-gray-800 pl-12">
                Pending Verification Vendor List
              </h1>
              <div className="flex items-center gap-2">
                <div className="text-sm lg:text-lg font-bold text-white border-4 border-blue-900 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out">
                  {userDetails || "Guest"}
                </div>
              </div>
            </header>

            <div className="bg-[#1e40af] text-black rounded-xl p-4 my-8">
              <div className="flex gap-4 items-center my-4">
                <input
                  type="text"
                  placeholder="Search by Shop Name, Address, or Owner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded w-full sm:w-1/4"
                />
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="p-2 border rounded w-full sm:w-1/4"
                >
                  <option value="shop_name">Shop Name</option>
                  <option value="shop_address">Address</option>
                  <option value="shop_owner_name">Owner</option>
                </select>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="p-2 border rounded w-full sm:w-1/4"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 border rounded w-full sm:w-1/4"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-center ">
                  <thead>
                    <tr className="bg-[#93c5fd] text-black sm:text-sm">
                      <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                        Shop Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                        Owner Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                        Contact
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                        Address
                      </th>
                      {/* <th className="px-2 py-4 md:text-lg text-xs ">
                      Status
                    </th> */}
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Feedback
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Photos
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Date
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedShops().length > 0 ? (
                      paginatedShops().map((shop) => (
                        <tr
                          key={shop._id}
                          className="bg-gray-200 border-b-2 border-blue-200"
                        >
                          <td className="px-2 py-4 ">{shop.shop_name}</td>
                          <td className="px-2 py-4">{shop.shop_owner_name}</td>
                          <td className="px-2 py-4">
                            {shop.shop_contact_number}
                          </td>
                          <td className="px-2 py-4 ">{shop.shop_address}</td>
                          {/* <td className="px-2 py-4">{shop.status}</td> */}
                          <td className="px-2 py-4">
                            {shop.Feedback_Provided || "No feedback yet"}
                          </td>
                          <td className="px-2 py-4">
                            {shop?.Photos_Uploaded ? (
                              <>
                                {/* Thumbnail */}
                                <img
                                  className="w-20 h-20 object-cover cursor-pointer"
                                  src={`${BASE_URL}/${shop.Photos_Uploaded}`}
                                  alt="Shop"
                                  onClick={() => {
                                    setZoomedImageId(
                                      `${BASE_URL}/${shop.Photos_Uploaded}`
                                    ); // Set the zoomed image ID
                                    setModalOpen(true);
                                  }}
                                />

                                {/* Modal for larger view */}
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
                                    className="absolute top-2 right-2 bg-red-600 p-2 px-4 rounded-full text-white"
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
                            <div className="text-gray-700 mt-4 p-4 ">
                              <div className="flex items-center mb-2">
                                <span className="ml-2 text-gray-600">
                                  Registration Date:{" "}
                                  {new Date(shop.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="ml-2 text-gray-600">
                                  Last Update:{" "}
                                  {new Date(shop.updatedAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-2 pt-10 flex justify-center items-center">
                            <button
                              onClick={() => handleEditButtonClick(shop)}
                              className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
                              style={{ fontSize: "0.875rem" }}
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center p-4">
                          No data found for the selected date.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center items-center my-4 gap-4">
              {/* Conditionally render the Previous button */}
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Previous
                </button>
              )}

              {/* Display the page number in the center */}
              <span className="font-bold text-lg">
                Page {currentPage} of {totalPages}
              </span>

              {/* Conditionally render the Next button */}
              {currentPage < totalPages && (
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOfInspection;
