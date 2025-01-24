import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const SuperStockistDetails = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [superStockists, setSuperStockists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  const resetHandler = (id) => {
    localStorage.setItem("superstockistId", id);
    navigate("/resetpasswordsuperstockist");
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
          className={`px-4 py-2 mx-1 ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } rounded-md`}
        >
          {i}
        </button>
      );
    }
    return <div className="flex justify-center mt-4">{pageNumbers}</div>;
  };

  const handleDeleteClick = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmResult.isConfirmed) {
      try {
        await fetch(`${BASE_URL}/api/superstockist/${id}`, {
          method: "DELETE",
        });
        fetchSuperStockists();
        Swal.fire("Deleted!", "Super Stockist has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting super stockist:", error);
        Swal.fire("Error", "Could not delete super stockist", "error");
      }
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 ml-80">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Super Stockist Details
          </h2>
          <input
            type="text"
            placeholder="Search by Username, State, or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th
                  onClick={() => sortByColumn("username")}
                  className="py-2 px-4 cursor-pointer text-gray-600 hover:text-blue-500"
                >
                  Name
                </th>
                <th
                  onClick={() => sortByColumn("address")}
                  className="py-2 px-4 cursor-pointer text-gray-600 hover:text-blue-500"
                >
                  Address
                </th>
                <th
                  onClick={() => sortByColumn("wareHouseName")}
                  className="py-2 px-4 cursor-pointer text-gray-600 hover:text-blue-500"
                >
                  Warehouse Name
                </th>
                <th className="py-2 px-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStockists.map((stockist) => (
                <tr key={stockist._id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{stockist.username}</td>
                  <td className="py-2 px-4">{stockist.address}</td>
                  <td className="py-2 px-4">{stockist.wareHouseName}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => resetHandler(stockist._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleDeleteClick(stockist._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default SuperStockistDetails;
