import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Location from "./Location";
import Modal from "react-modal";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCalendarAlt,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import AdminSidebar from "../AdminSidebar";
import AdminSideBarModal from "../AdminSideBarModal";
import RightSideDrawer from "../../../components/RightSideDrawer";

const AttendanceRecordDashboard = () => {
  const { state } = useLocation();
  const user = state?.user;
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // Default to current month (1-indexed)
  const [selectedYear, setSelectedYear] = useState(dayjs().year()); // Default to current year
  const [startDate, setStartDate] = useState(""); // Start date filter
  const [endDate, setEndDate] = useState(""); // End date filter
  const [fullStartDate, setFullStartDate] = useState(""); // Full date start filter
  const [fullEndDate, setFullEndDate] = useState(""); // Full date end filter
  const itemsPerPage = 6;
  const email = localStorage.getItem("email");
  const [model, setModel] = useState(false);
  const [selectLocation, setSelectLocation] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [zoomedImageId, setZoomedImageId] = useState(null);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseImgModal = () => setModalOpen(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      // Fetch attendance data for the selected month and year
      fetch(
        `${BASE_URL}/api/attendance/user/all/${user._id}?year=${selectedYear}&month=${selectedMonth}`
      )
        .then((res) => res.json())
        .then((data) => setAttendanceData(data))
        .catch((err) => console.error("Error fetching attendance data:", err));
    }
  }, [user, selectedMonth, selectedYear]);

  // Filter data based on start and end dates, month, and year
  const filterDataByDateAndMonth = () => {
    return attendanceData.filter((record) => {
      const recordDate = dayjs(record.logintime);
      const isAfterStart = startDate
        ? recordDate.isAfter(dayjs(startDate).startOf("day"))
        : true;
      const isBeforeEnd = endDate
        ? recordDate.isBefore(dayjs(endDate).endOf("day"))
        : true;

      // Filter by month and year
      const isSameMonth = recordDate.month() + 1 === selectedMonth;
      const isSameYear = recordDate.year() === selectedYear;

      // Full date filter (start and end date)
      const isAfterFullStart = fullStartDate
        ? recordDate.isAfter(dayjs(fullStartDate).startOf("day"))
        : true;
      const isBeforeFullEnd = fullEndDate
        ? recordDate.isBefore(dayjs(fullEndDate).endOf("day"))
        : true;

      return (
        isAfterStart &&
        isBeforeEnd &&
        isSameMonth &&
        isSameYear &&
        isAfterFullStart &&
        isBeforeFullEnd
      );
    });
  };

  const filteredData = filterDataByDateAndMonth();

  if (!user) {
    return (
      <div className="text-center text-red-500">No user data provided.</div>
    );
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMonthYearChange = (e) => {
    const [year, month] = e.target.value.split("-"); // Extract year and month from the value
    setSelectedYear(Number(year));
    setSelectedMonth(Number(month)); // Month is 1-indexed
    setCurrentPage(1); // Reset to the first page when the month or year changes
  };

  const handleFullStartDateChange = (e) => {
    setFullStartDate(e.target.value);
    setCurrentPage(1); // Reset to the first page when the full start date changes
  };

  const handleLocationModal = (location) => {
    setSelectLocation(location);
    setModel(true);
  };
  const handleLocationModalClose = () => {
    setModel(false);
    setSelectLocation(null);
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen  flex w-full">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-70 xl:ml-80  flex flex-col h-full px-5 my-4 w-full">
        <header className="bg-[#93c5fd] rounded-md shadow p-4 flex items-center justify-between relative">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#1e40af] text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 ease-in-out hidden sm:block  cursor-pointer"
          >
            Back
          </button>

          {/* Heading */}
          <h1 className="flex-grow text-center text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
            Attendance Record
          </h1>

          <div className="relative">
            <RightSideDrawer />
          </div>

          {/* Email Section */}
          <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
            {email}
          </div>

          {/* Management Sidebar Modal */}
          <div className="lg:hidden block">
            <AdminSideBarModal />
          </div>
        </header>

        {model && selectLocation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50 bg-white w-[80%] p-8 rounded-lg shadow-lg">
              <Location
                onClose={handleLocationModalClose}
                location={selectLocation}
              />
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="overflow-x-auto mt-8">
          {user && (
            <div className="bg-gray-100 shadow-lg rounded-2xl p-6 grid gap-6 h-auto w-full">
              {/* User Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="col-span-1">
                  <h1 className="text-lg font-medium text-blue-700 mb-2">
                    <FaUser className="inline mr-2 text-blue-700" /> Name:
                    <span className="text-gray-600"> {user.name}</span>
                  </h1>
                  <h1 className="text-lg font-medium text-blue-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-blue-700" /> Email:
                    <span className="text-gray-600"> {user.email}</span>
                  </h1>
                  <h1 className="text-lg font-medium text-blue-700 mb-2">
                    <FaPhone className="inline mr-2 text-blue-700" /> Phone:
                    <span className="text-gray-600"> {user.phoneNo}</span>
                  </h1>
                </div>

                {/* Column 2 */}
                <div className="col-span-1">
                  <h1 className="text-lg font-medium text-blue-700 mb-2">
                    <FaBriefcase className="inline mr-2 text-blue-700" />{" "}
                    Department:
                    <span className="text-gray-600"> {user.role}</span>
                  </h1>
                  <h1 className="text-lg font-medium text-blue-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-blue-700" />{" "}
                    Joining Date:
                    <span className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </h1>
                  <h1 className="text-lg font-medium text-blue-700 mb-2">
                    Total No of Days Present:
                    <span className="text-gray-600">
                      {" "}
                      {filteredData.length || "0"}
                    </span>
                  </h1>
                </div>

                {/* Column 3 */}
                <div className="col-span-1">
                  <h1 className="text-lg font-medium text-blue-700 mb-2">
                    <FaRegCalendarAlt className="inline mr-2 text-blue-700" />{" "}
                    Current Month:
                    <span className="text-gray-600">
                      {" "}
                      {dayjs().format("MMMM YYYY")}
                    </span>
                  </h1>
                </div>
              </div>

              {/* Centered Date Filtration Section */}
              <div className="flex justify-center items-center h-full py-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Month and Year Selector */}
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <label
                      htmlFor="monthYear"
                      className="font-semibold text-gray-700 flex items-center"
                    >
                      <MdDateRange className="inline mr-2 text-blue-700 text-xl" />{" "}
                      Select Month and Year:
                    </label>
                    <input
                      type="month"
                      id="monthYear"
                      value={dayjs(`${selectedYear}-${selectedMonth}`).format(
                        "YYYY-MM"
                      )}
                      onChange={handleMonthYearChange}
                      className="w-full md:w-auto border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date Selector */}
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <label
                      htmlFor="fullStartDate"
                      className="font-semibold text-gray-700 flex items-center"
                    >
                      <FaRegCalendarAlt className="inline mr-2 text-blue-700 text-xl" />{" "}
                      Select Date:
                    </label>
                    <input
                      type="date"
                      id="fullStartDate"
                      value={fullStartDate}
                      onChange={handleFullStartDateChange}
                      className="w-full md:w-auto border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`bg-white rounded-xl p-4 mt-8 ${
              filteredData.length > 7 ? "overflow-x-auto" : ""
            }`}
          >
            {filteredData.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2 bg-blue-100 text-sm sm:text-base">
                      Date
                    </th>
                    <th className="p-2 bg-blue-200 text-sm sm:text-base">
                      Status
                    </th>
                    <th className="p-2 bg-green-200 text-sm sm:text-base">
                      Login Time
                    </th>
                    <th className="p-2 bg-green-200 text-sm sm:text-base">
                      Login Image
                    </th>
                    <th className="p-2 bg-green-200 text-sm sm:text-base">
                      Login Location
                    </th>
                    <th className="p-2 bg-yellow-200 text-sm sm:text-base">
                      Logout Time
                    </th>
                    <th className="p-2 bg-yellow-200 text-sm sm:text-base">
                      Logout Image
                    </th>
                    <th className="p-2 bg-yellow-200 text-sm sm:text-base">
                      Logout Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((record, index) => (
                    <tr
                      key={record._id}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-2 bg-blue-50 text-xs sm:text-sm lg:text-base">
                        {dayjs(record.logintime).format("YYYY-MM-DD")}
                      </td>
                      <td className="p-2 bg-blue-50 text-xs sm:text-sm lg:text-base">
                        {record.ispresent ? "Present" : "Absent"}
                      </td>
                      <td className="p-2 bg-green-50 text-xs sm:text-sm lg:text-base">
                        {dayjs(record.logintime).format("HH:mm:ss")}
                      </td>
                      <td className="px-2 py-4 bg-green-50 text-xs sm:text-sm">
                        {record.loginImg ? (
                          <>
                            <img
                              className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-full cursor-pointer"
                              src={record.loginImg}
                              alt="Login"
                              onClick={() => {
                                setZoomedImageId(`${record.loginImg}`);
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
                      <td className="p-2 bg-green-50">
                        <button
                          onClick={() =>
                            handleLocationModal(record.loginLocation)
                          }
                          className="bg-blue-500 px-2 py-1 text-xs sm:text-sm text-white rounded-md hover:bg-blue-600 transition duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                        >
                          Login Location
                        </button>
                      </td>
                      <td className="p-2 bg-yellow-50 text-xs sm:text-sm lg:text-base">
                        {record.logouttime
                          ? dayjs(record.logouttime).format("HH:mm:ss")
                          : "N/A"}
                      </td>
                      <td className="px-2 py-4 bg-yellow-50 text-xs sm:text-sm">
                        {record.logoutImg ? (
                          <>
                            <img
                              className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-full cursor-pointer"
                              src={record.logoutImg}
                              alt="Logout"
                              onClick={() => {
                                setZoomedImageId(`${record.logoutImg}`);
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
                      <td className="p-2 bg-yellow-50">
                        <button
                          onClick={() =>
                            handleLocationModal(record.logoutLocation)
                          }
                          className="bg-blue-500 px-2 py-1 text-xs sm:text-sm text-white rounded-md hover:bg-blue-600 transition duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                        >
                          Logout Location
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 text-sm sm:text-base">
                No attendance records available.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="font-bold text-lg">Page {currentPage}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecordDashboard;
