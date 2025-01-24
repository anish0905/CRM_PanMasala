import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { FaRegEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import GoogleMaps from "../pages/GoogleMaps";
import ShopInspectionModule from "./reports/ShopInspectionModule";
const fieldManager_id = localStorage.getItem("fieldManager_Id");
import Swal from "sweetalert2";

const InspectionList = () => {
  const URI = import.meta.env.VITE_API_URL;
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

  const itemsPerPage = 10;

  const fetchShops = async () => {
    try {
      const response = await fetch(
        `${URI}/api/inspectionShop/getinspection/shop`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }
      const data = await response.json();

      const result = data.filter((s) => {
        return s.status === "approved";
      });
      setShops(result);
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

  const handleEditButtonClick = (shop) => {
    setSelectShop(shop);
    setEditModal(true);
  };

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
        fetch(`${URI}/api/inspectionShop/delete/${id}`, {
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <div className="lg:ml-4 md:ml-20 font-serif w-full lg:p-10 md:p-5 p-2">
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

          {editModal && selectShop && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-50 bg-white p-8 rounded-lg shadow-lg">
                <ShopInspectionModule
                  onClose={handleeditCloseModal}
                  shopData={selectShop}
                />
              </div>
            </div>
          )}
          <div className="container mx-auto py-8">
            <div className="bg-[#1e40af] text-black rounded-xl p-4">
              <h2 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
                Verified Vender
              </h2>
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
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="Visited">Visited</option>
                  <option value="Not_Visited">Not Visited</option>
                  <option value="Inspection_Completed">
                    Inspection Completed
                  </option>
                  <option value="Inspection_Incomplete">
                    Inspection Incomplete
                  </option>
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
                        Shop Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        Owner Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        Contact
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        Address
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        Status
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left">
                        Feedback
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left">
                        Photos
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left">
                        Location
                      </th>
                      {/* <th className="px-2 py-4 md:text-lg text-xs text-left">
                        Action
                      </th> */}
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
                        <td className="px-2 py-4">{shop.shopStatus}</td>
                        <td className="px-2 py-4">
                          {shop.Feedback_Provided || "No feedback yet"}
                        </td>
                        <td className="px-2 py-4">
                          {shop.Photos_Uploaded ? (
                            <img
                              src={`${URI}/${shop.Photos_Uploaded}`}
                              alt="Shop"
                              className="w-24 h-16 object-cover"
                            />
                          ) : (
                            <span>No photos uploaded</span>
                          )}
                        </td>
                        <td className="px-2 py-4">
                          <button
                            onClick={() => handleLocationModal(shop)}
                            className="text-blue-500"
                          >
                            View Location
                          </button>
                        </td>
                        {/* <td className="px-2 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => handleEditButtonClick(shop)}>
                              <FaRegEdit className="text-blue-600 text-lg" />
                            </button>

                            <button
                              onClick={() => handleDeleteButton(shop._id)}
                            >
                              <MdAutoDelete className="text-red-600 text-lg" />
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionList;
