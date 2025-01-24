import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import ShopInspectionModule from "./ShopInspectionModule";
const fieldManager_id = localStorage.getItem("fieldManager_Id");
import Swal from "sweetalert2";
import FEASidebar from "../../../components/Sidebar/FEASidebar";
import GoogleMaps from "./GoogleMaps";
import Modal from "react-modal";

const VerifiedVendor = () => {
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
  const userDetails = localStorage.getItem("email");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseImgModal = () => setModalOpen(false);

  const itemsPerPage = 10;

  const [zoomedImageId, setZoomedImageId] = useState(null);
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

      const VerifiedVendor = data.filter((v) => v.status === "approved");

      setShops(VerifiedVendor);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleLocationModal = (shop) => {
    console.log(shop._id);
    setInspectionId(shop._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleeditCloseModal = () => {
    setInspectionShop(false);
    setEditModal(false);
  };

  const filteredAndSortedShops = () => {
    return shops
      .filter((shop) => {
        const term = searchTerm.toLowerCase();
        const matchesSearchTerm =
          shop.shop_name.toLowerCase().includes(term) ||
          shop.shop_address.toLowerCase().includes(term) ||
          shop.shop_owner_name.toLowerCase().includes(term);
        const matchesStatus = selectedStatus
          ? shop.shopStatus === selectedStatus
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

  const handleDeleteButton = (id) => {
    // Show a confirmation alert before proceeding
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed to delete the shop
        fetch(`${BASE_URL}/api/inspectionShop/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete shop");
            }
            return response.json();
          })
          .then(() => {
            // Remove the deleted shop from state
            const updatedShops = shops.filter((shop) => shop._id !== id);
            setShops(updatedShops);

            // Show success message
            Swal.fire({
              title: "Deleted!",
              text: "The shop has been deleted.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            console.error("Error deleting shop:", error);

            // Show error message
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the shop.",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-blue-100 flex w-full">
      <div className="h-screen lg:fixed  top-0 left-0  lg:w-64">
        <FEASidebar />
      </div>
      <div className="flex-1 p-6 lg:ml-80 overflow-y-auto">
        <div className="  w-full  p-2">
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-50 bg-white w-[80%] p-8 rounded-lg shadow-lg">
                <GoogleMaps
                  onClose={handleCloseModal}
                  inspectionId={inspectionId}
                />
              </div>
            </div>
          )}

          <div className="container mx-auto ">
            <header className="bg-blue-300 rounded-md shadow-md p-4 flex justify-between items-center gap-4">
              <h1 className="md:text-lg text-xs lg:text-xl font-bold text-gray-800 pl-12">
                {" "}
                Verified Verification vendor list
              </h1>
              <div className="flex items-center gap-2">
                <div className="text-sm lg:text-lg font-bold text-white border-4 border-blue-900 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out">
                  {userDetails || "Guest"}
                </div>
              </div>
            </header>
            <div className="bg-[#1e40af] text-black rounded-xl p-4  my-8 ">
              {inspectionShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  <div className="z-50 bg-white p-8 rounded-lg shadow-lg">
                    <ShopInspectionModule
                      onClose={handleeditCloseModal}
                      fetchShops={fetchShops}
                    />
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 my-4">
                <input
                  type="text"
                  placeholder="Search by Shop Name, Address, or Owner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded"
                />
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="shop_name">Shop Name</option>
                  <option value="shop_address">Address</option>
                  <option value="shop_owner_name">Owner</option>
                </select>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div className="overflow-x-auto overflow-y-auto">
                <table className="min-w-full text-center">
                  <thead>
                    <tr className="bg-[#93c5fd] text-black sm:text-sm">
                      {/* <th className="px-2 py-4 md:text-lg text-xs  border-r-2 border-white">
                        Field Executive Details
                      </th> */}
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

                      <th className="px-2 py-4 md:text-lg text-xs ">
                        Feedback
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs ">Photos</th>
                      <th className="px-2 py-4 md:text-lg text-xs ">Date</th>

                      <th className="px-2 py-4 md:text-lg text-xs ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedShops().map((shop) => (
                      <tr
                        key={shop._id}
                        className="bg-gray-200 border-b-2 border-blue-200"
                      >
                        <td className="px-2 py-4">{shop.shop_name}</td>
                        <td className="px-2 py-4">{shop.shop_owner_name}</td>
                        <td className="px-2 py-4">
                          {shop.shop_contact_number}
                        </td>
                        <td className="px-2 py-4">{shop.shop_address}</td>

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
                                  setZoomedImageId(`${BASE_URL}/${shop.Photos_Uploaded}`);
                                  setModalOpen(true);
                                }} // Update the zoomed image ID and open modal
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

                        <td className="px-2 py-4 flex justify-center items-center content-center flex-wrap gap-2">
                          <button
                            onClick={() => handleLocationModal(shop)}
                            className="bg-blue-500 px-2 py-1 text-white rounded-md hover:bg-blue-600 transition duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
                            style={{ fontSize: "0.875rem" }} // Smaller font size
                          >
                            Location
                          </button>
                        </td>

                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* pagination */}

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
export default VerifiedVendor;
