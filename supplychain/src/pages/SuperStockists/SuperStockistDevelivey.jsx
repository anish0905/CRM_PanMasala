import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { SuperStockistSideBar } from "./SuperStockistSideBar";
import RegisterForm from "./RegisterForm";
import { BASE_URL } from "../../constants";
import axios from "axios";
import Swal from 'sweetalert2';

const SuperStockistDevelivey = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectUser, setSelectUser] = useState();


  const navigate = useNavigate();


  const userId = localStorage.getItem("currentUserId");

  useEffect(() => {
    fetchDeliveryBoys();
  }, [sortField, sortDirection]);

  const fetchDeliveryBoys = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/superStockist/develiveyBoy/superstockist/${userId}`);
      if (Array.isArray(response.data.data)) {
        setDeliveryBoys(response.data.data);
      } else {
        console.error("Expected response data to be an array");
        setDeliveryBoys([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
      setDeliveryBoys([]); // Fallback to empty array in case of error
    }
  };

  const handleRegisterButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

  };

  const handleUpdate = (user) => {
    setSelectUser(user);
    setShowModal(true);


  };

  // Filter delivery boys based on search query
  const filteredDeliveryBoys = deliveryBoys.filter((deliveryBoy) => {
    return (
      deliveryBoy.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliveryBoy.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliveryBoy.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort filtered data based on selected sort field and direction
  const sortedDeliveryBoys = filteredDeliveryBoys.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const indexOfLastDeliveryBoy = currentPage * itemsPerPage;
  const indexOfFirstDeliveryBoy = indexOfLastDeliveryBoy - itemsPerPage;
  const currentDeliveryBoys = sortedDeliveryBoys.slice(indexOfFirstDeliveryBoy, indexOfLastDeliveryBoy);

  const totalPages = Math.ceil(sortedDeliveryBoys.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };




  const handleDelete = async (id) => {
    try {
      // Show SweetAlert confirmation before deletion
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        // Send DELETE request to the server
        const response = await axios.delete(`${BASE_URL}/api/superStockist/develiveyBoy/${id}`);

        // Check if the deletion was successful
        if (response.status === 200) {
          // Update state to remove the deleted delivery boy from the list
          setDeliveryBoys(deliveryBoys.filter(deliveryBoy => deliveryBoy._id !== id));

          // Show SweetAlert success message
          Swal.fire(
            'Deleted!',
            'The delivery boy has been deleted.',
            'success'
          );

          // Simulate sending SMS (replace with actual logic if needed)
          Swal.fire({
            title: 'Sending SMS...',
            text: "We are sending an SMS to the delivery boy.",
            icon: 'info',
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
              // Simulate SMS sending with a delay
              setTimeout(() => {
                Swal.close();
                Swal.fire('SMS Sent!', 'The SMS was successfully sent.', 'success');
              }, 2000); // 2 seconds delay
            }
          });
        } else {
          Swal.fire(
            'Error!',
            'Failed to delete the delivery boy.',
            'error'
          );
        }
      }
    } catch (error) {
      console.error("Error deleting delivery boy:", error);
      Swal.fire(
        'Error!',
        'An error occurred while deleting the delivery boy.',
        'error'
      );
    }
  };




  return (
    <div className="flex gap-6 bg-[#dbeafe] w-full h-screen">
      <div className="lg:p-5 xl:p-5 ml-0 p-0">
        <SuperStockistSideBar />
      </div>
      <div className="lg:ml-80 xl:ml-96  md:ml-40 font-serif w-full lg:p-10 md:p-5 p-4">
        <div className="flex items-center flex-wrap lg:justify-end md:justify-end justify-center lg:gap-10 md:gap-5 gap-1 lg:h-28 h-16 bg-[#93c5fd] rounded-xl lg:my-5 md:my-5 my-2">
          <p className="lg:text-2xl md:text-xl text-xs font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[#dbeafe]">
            Delivery Boy
          </p>
          <Button
            color="blue"
            onClick={handleRegisterButtonClick}
            className="lg:mr-12 lg:-ml-2 md:mr-8 mr-2 lg:text-md md:text-md text-xs bg-[#1e40af]"
          >
            Register
          </Button>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50 bg-white p-8 rounded-lg shadow-lg">
              <RegisterForm onClose={handleCloseModal} user={selectUser} />
            </div>
          </div>
        )}

        <div className="container mx-auto 2xl:ml-0 py-8">
          <div className="lg:h-full bg-[#1e40af] text-black rounded-xl p-4">
            <h2 className="2xl:text-2xl xl:text-xl md:text-lg text-sm text-white font-bold p-1 mt-1">
              Delivery Boy List
            </h2>

            {/* Search Input */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 my-4">
              <input
                type="text"
                placeholder="Search by username, email, or state"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded mr-2"
              />
            </div>

            {/* Delivery Boys Table */}
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "600px" }}>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#93c5fd] text-black sm:text-sm">
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">Name</th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">Email</th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">Phone No</th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">State</th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">city</th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">Address</th>
                    <th className="px-2 py-4 md:text-lg text-xs text-left border-r-2 border-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDeliveryBoys.map((deliveryBoy) => (
                    <tr key={deliveryBoy._id} className="bg-gray-200 border-b-2 border-blue-200">
                      <td className="px-2 py-4 md:text-lg text-xs text-left">{deliveryBoy.username}</td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">{deliveryBoy.email}</td>

                      <td className="px-2 py-4 md:text-lg text-xs text-left">{deliveryBoy.phoneNo}</td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">{deliveryBoy.state}</td>

                      <td className="px-2 py-4 md:text-lg text-xs text-left">{deliveryBoy.city}</td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left">{deliveryBoy.address} <br />
                        {deliveryBoy.pinCode
                        }
                      </td>
                      <td className="px-2 py-4 md:text-lg text-xs text-left text-[#1e40af] flex justify-center gap-4 items-center flex-wrap">
                        <button onClick={() => handleUpdate(deliveryBoy)} className="p-2 rounded-lg bg-blue-500 hover:bg-blue-800 text-white">Update</button>
                        <button onClick={() => handleDelete(deliveryBoy._id)} className="p-2 rounded-lg bg-red-500 hover:bg-red-700 text-white">delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center gap-10 my-4">
              {currentPage > 1 && (
                <button
                  onClick={handlePrevPage}
                  className="p-2 border rounded bg-black text-white"
                >
                  Previous
                </button>
              )}

              <span className="font-bold">
                {currentPage} / {totalPages}
              </span>

              {currentPage < totalPages && (
                <button
                  onClick={handleNextPage}
                  className="p-2 border rounded bg-black text-white"
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

export default SuperStockistDevelivey;