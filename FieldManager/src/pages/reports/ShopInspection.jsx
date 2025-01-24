import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Button } from "@material-tailwind/react";
import ShopInspectionModule from "./ShopInspectionModule";

const fieldManager_id = localStorage.getItem("fieldManager_Id");

const ShopInspection = () => {
  const URI = import.meta.env.VITE_API_URL;
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("shop_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(""); // State for selected shopStatus
  const itemsPerPage = 6;
  const [location, setLocation] = useState(null); // Store the location

  const email = localStorage.getItem("email");

  const fetchShops = async () => {
    try {
      const response = await fetch(
        `${URI}/api/inspectionShop/feildManagerId/${fieldManager_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }
      const data = await response.json();

      const result = data.filter((s) => s.status === "pending");
      setShops(result);
      console.log(result);
      
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleRegisterButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const filteredAndSortedShops = () => {
    return shops
      .filter((shop) => {
        // Filtering based on shop name, address, or owner name
        const term = searchTerm.toLowerCase();
        const matchesSearchTerm =
          shop.shop_name.toLowerCase().includes(term) ||
          shop.shop_address.toLowerCase().includes(term) ||
          shop.shop_owner_name.toLowerCase().includes(term);

        // Filtering based on selected status
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

  // Pagination logic
  const paginatedShops = () => {
    const filteredShops = filteredAndSortedShops();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredShops.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedShops().length / itemsPerPage);

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="flex gap-10 min-h-screen">
      {/* Sidebar */}
      <div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="font-serif w-full p-2">
          <div className="flex items-center flex-wrap lg:justify-end md:justify-end justify-center lg:gap-10 md:gap-5 gap-1 lg:h-28 h-16 bg-[#93c5fd] rounded-xl lg:my-5 md:my-5 my-2">
            <Button
              color="blue"
              className="lg:text-xl md:text-xl text-xs font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out mr-4"
            >
              {email}
            </Button>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-50 bg-white p-8 rounded-lg shadow-lg">
                <ShopInspectionModule
                  onClose={handleCloseModal}
                  fetchShops={fetchShops}
                />
              </div>
            </div>
          )}

          <div className="container mx-auto py-8">
            <div className="bg-[#1e40af] text-black rounded-xl p-4">
              <h2 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
                Pending Verification
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
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#93c5fd] text-black sm:text-sm">
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        Shop Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        Owner Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        contact
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">
                        Address
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left">
                        Feedback
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs text-left">
                        Photos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedShops().map((shop) => (
                      <tr
                        key={shop._id}
                        className="bg-gray-200 border-b-2 border-blue-200"
                      >
                        <td className="px-2 py-4 md:text-lg text-xs text-left whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                          {shop.shop_name}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs text-left whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                          {shop.shop_owner_name}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs text-left whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                          {shop.shop_contact_number}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs text-left whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                          {shop.shop_address}
                        </td>

                        <td className="px-2 py-4 md:text-lg text-xs text-left whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                          {shop.Feedback_Provided || "No feedback yet"}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs text-left whitespace-nowrap overflow-hidden overflow-ellipsis">
                          {shop.Photos_Uploaded ? (
                            <img
                              src={`${URI}/${shop.Photos_Uploaded}`}
                              alt="Shop Photo"
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                          ) : (
                            <span>No Photo</span>
                          )}
                        </td>
                      </tr>
                    ))}
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

export default ShopInspection;
