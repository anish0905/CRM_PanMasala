import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import Sidebar from "../../../components/Sidebar/Sidebar";

const fieldManager_id = localStorage.getItem("fieldManager_Id");

const Reverification = () => {
  const URI = import.meta.env.VITE_API_URL;
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("shop_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedShop, setSelectedShop] = useState(null); // For the shop being edited
  const itemsPerPage = 6;

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
      const result = data.filter((s) => s.status === "re-verify");
      setShops(result);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
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

  const handleEditClick = (shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedShop(null);
  };

  return (
    <div className="flex gap-10 min-h-screen">
      <div>
        <Sidebar />
      </div>
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

          <div className="container mx-auto py-8">
            <div className="bg-[#1e40af] text-black rounded-xl p-4">
              <h2 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
                Re-Verification
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
                  <thead className="text-center">
                    {" "}
                    {/* Center text for table headers */}
                    <tr className="bg-[#93c5fd] text-black sm:text-sm">
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Shop Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Owner Name
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Contact
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Address
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                        Photos
                      </th>
                      <th className="px-2 py-4 md:text-lg text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {" "}
                    {/* Center text for table body */}
                    {paginatedShops().map((shop) => (
                      <tr
                        key={shop._id}
                        className="bg-gray-200 border-b-2 border-blue-200"
                      >
                        <td className="px-2 py-4 md:text-lg text-xs">
                          {shop.shop_name}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs">
                          {shop.shop_owner_name}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs">
                          {shop.shop_contact_number}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs">
                          {shop.shop_address}
                        </td>
                        <td className="px-2 py-4">
                          {shop.Photos_Uploaded ? (
                            <img
                              src={`${URI}/${shop.Photos_Uploaded}`}
                              alt="Shop"
                              className="w-24 h-16 object-cover image-zoom"
                            />
                          ) : (
                            <span>No photos uploaded</span>
                          )}
                        </td>
                        <td className="px-2 py-4 md:text-lg text-xs">
                          <button
                            onClick={() => handleEditClick(shop)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showModal && selectedShop && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg p-6 w-96">
                  <h3 className="text-lg font-bold mb-4">Edit Shop</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedShop.shop_name}
                      disabled={!selectedShop.isEditable}
                      onChange={(e) =>
                        setSelectedShop({
                          ...selectedShop,
                          shop_name: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedShop.shop_owner_name}
                      disabled={!selectedShop.isEditable}
                      onChange={(e) =>
                        setSelectedShop({
                          ...selectedShop,
                          shop_owner_name: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedShop.shop_contact_number}
                      disabled={!selectedShop.isEditable}
                      onChange={(e) =>
                        setSelectedShop({
                          ...selectedShop,
                          shop_contact_number: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedShop.shop_address}
                      disabled={!selectedShop.isEditable}
                      onChange={(e) =>
                        setSelectedShop({
                          ...selectedShop,
                          shop_address: e.target.value,
                        })
                      }
                    />

                    {/* File Input for Photo */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Photo:</label>
                      <input
                        type="file"
                        className="p-2 border rounded"
                        disabled={!selectedShop.isEditable}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSelectedShop({ ...selectedShop, photo: file });
                          }
                        }}
                      />
                    </div>

                    {/* Preview the uploaded image */}
                    {selectedShop.photo && (
                      <div className="mt-4 p-2 border rounded bg-gray-100">
                        <h4 className="text-sm font-medium mb-2">
                          Uploaded Image:
                        </h4>
                        <img
                          src={
                            typeof selectedShop.photo === "string"
                              ? selectedShop.photo // If it's a URL
                              : URL.createObjectURL(selectedShop.photo) // If it's a File
                          }
                          alt="Shop Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Buttons Section */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={handleModalClose}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Close
                    </button>
                    {!selectedShop.isEditable ? (
                      <button
                        onClick={() =>
                          setSelectedShop({ ...selectedShop, isEditable: true })
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Modify
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const formData = new FormData();
                          formData.append("shop_name", selectedShop.shop_name);
                          formData.append(
                            "shop_owner_name",
                            selectedShop.shop_owner_name
                          );
                          formData.append(
                            "shop_contact_number",
                            selectedShop.shop_contact_number
                          );
                          formData.append(
                            "shop_address",
                            selectedShop.shop_address
                          );
                          formData.append("status", "pending");
                          if (selectedShop.photo instanceof File) {
                            formData.append("photo", selectedShop.photo);
                          }

                          try {
                            const response = await fetch(
                              `${URI}/api/inspectionShop/update/inspections/${selectedShop._id}`,
                              {
                                method: "PUT",
                                body: formData,
                              }
                            );
                            if (response.ok) {
                              setShops((prevShops) =>
                                prevShops.map((shop) =>
                                  shop._id === selectedShop._id
                                    ? { ...shop, status: "pending" }
                                    : shop
                                )
                              );
                              fetchShops()
                              handleModalClose();
                            } else {
                              console.error("Failed to update shop");
                            }
                          } catch (error) {
                            console.error("Error updating shop:", error);
                          }
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center items-center my-4 gap-4">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Previous
                </button>
              )}
              <span className="font-bold text-lg">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
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

export default Reverification;
