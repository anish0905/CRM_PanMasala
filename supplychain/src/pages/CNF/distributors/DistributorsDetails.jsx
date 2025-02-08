import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import CNFSidebar from "../../CNF/CNFSidebar";
import CNFSideBarModal from "../../CNF/CNFSideBarModal";
import SMSDrawer from "../../../Component/SMS_Drawer";
import { FaArrowLeft } from "react-icons/fa";
import { TbHomeStats } from "react-icons/tb";

const DistributorsDetails = () => {
  const [SuperStockists, setSuperStockists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const { name, id } = useParams();

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSuperStockists();
  }, []);

  const fetchSuperStockists = async () => {
    try {
      const response =
        name === "inventory" ? await fetch(`${BASE_URL}/api/cnfAgent/DistributorDetailsByCnfId/${id}`) :
          await fetch(
            `${BASE_URL}/api/cnfAgent/DistributorDetailsBySuperstockist/${id}`
          );
      if (!response.ok) throw new Error("Failed to fetch SuperStockists");
      const data = await response.json();
      setSuperStockists(data.data);
    } catch (error) {
      console.error("Error fetching SuperStockists:", error);
    }
  };

  const filteredSuperStockists = SuperStockists.filter((stockist) =>
    [stockist.username, stockist.state, stockist.email]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(searchTerm.toLowerCase()))
  );

  const paginatedSuperStockists = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuperStockists.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredSuperStockists.length / itemsPerPage);



  const handleInventory = (user) => {
    
    navigate(`/manage/Inventory/${user._id}/distributor/cnf`, {
      state: {
        user: user,
      },
    });
  };

  return (
    <div className="flex gap-6 min-h-screen w-full">
      <div className="min-h-screen lg:block hidden">
        <CNFSidebar />
      </div>

      <div className="lg:ml-80 font-serif w-full md:p-5 p-4">
        <header className="bg-[rgb(147,197,253)] rounded-md shadow p-4 flex gap-4 items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:text-gray-600  cursor-pointer">
            <FaArrowLeft className="text-2xl" />
          </button>
          <h1 className="flex-grow text-end lg:text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
           
            {
              name === "inventory"? "Manage Distributor Inventory" : "Manage Distributor Details"
            }
          </h1>
          <SMSDrawer />
          {email && (
            <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
              {email}
            </div>
          )}
          <div className="lg:hidden block">

            <CNFSideBarModal />

          </div>
        </header>

        <div className="py-8">
          <div className="bg-[#1e40af] rounded-xl p-4">
            <h2 className="text-sm md:text-lg text-white font-bold p-1">
              Distributor List ( {SuperStockists.length || 0})
            </h2>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 my-4 text-white">
              <input
                type="text"
                placeholder="Search by Username, State, or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-center">
                <thead>
                  <tr className="bg-[#93c5fd] text-black sm:text-sm">
                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      Username
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      Email
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      Mobile No
                    </th>

                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      Address
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      city
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      District
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      State
                    </th>
                    <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                      Pincode
                    </th>
                    {
                      name === "inventory" && (
                        <th className="px-2 py-4 md:text-lg text-xs border-r-2 border-white">
                          Action
                        </th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {paginatedSuperStockists().map((stockist) => (
                    <tr
                      key={stockist._id}
                      className="bg-gray-200 border-b-2 border-blue-200"
                    >
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.username}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.email}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.mobileNo}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.address}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.city}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.district}
                      </td>

                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.state}
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs  whitespace-nowrap overflow-hidden overflow-ellipsis border-r-2 border-white">
                        {stockist.pinCode}
                      </td>
                      {
                        name === "inventory" && (
                          <td>
                          <button
                            onClick={() => handleInventory(stockist)}
                            className="bg-yellow-500 text-white p-2 rounded ml-2 cursor-pointer"
                          >
                            <TbHomeStats />
                          </button>
                          </td>
                        )
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 mx-1 ${index + 1 === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                    } rounded`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorsDetails;
