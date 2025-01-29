import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Location } from "./Location";
import Modal from "react-modal";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";


const AttendanceRecord = () => {
  const userId = localStorage.getItem("userId");
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [fullStartDate, setFullStartDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomedImageId, setZoomedImageId] = useState(null);
  const [selectLocation, setSelectLocation] = useState(null);
  const [model, setModel] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const itemsPerPage = 10;

  useEffect(() => {
    fetch(
      `${BASE_URL}/api/attendance/user/all/${userId}?year=${selectedYear}&month=${selectedMonth}`
    )
      .then((res) => res.json())
      .then((data) => setAttendanceData(data))
      .catch((err) => console.error("Error fetching attendance data:", err));
  }, [selectedMonth, selectedYear]);

  const filterDataByDateAndMonth = () => {
    return attendanceData.filter((record) => {
      const recordDate = dayjs(record.logintime);
      const isAfterStart = fullStartDate
        ? recordDate.isAfter(dayjs(fullStartDate).startOf("day"))
        : true;
      const isSameMonth = recordDate.month() + 1 === selectedMonth;
      const isSameYear = recordDate.year() === selectedYear;

      return isAfterStart && isSameMonth && isSameYear;
    });
  };

  const filteredData = filterDataByDateAndMonth();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMonthYearChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedYear(Number(year));
    setSelectedMonth(Number(month));
    setCurrentPage(1);
  };

  const handleFullStartDateChange = (e) => {
    setFullStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationModal = (location) => {
    setSelectLocation(location);
    setModel(true);
  };

  const handleLocationModalClose = () => {
    setModel(false);
    setSelectLocation(null);
  };

  const handleCloseImgModal = () => {
    setIsModalOpen(false);
    setZoomedImageId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <MdDateRange className="text-blue-600 text-xl" />
          <input
            type="month"
            value={dayjs(`${selectedYear}-${selectedMonth}`).format("YYYY-MM")}
            onChange={handleMonthYearChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaRegCalendarAlt className="text-blue-600 text-xl cursor-pointer" />
          <input
            type="date"
            value={fullStartDate}
            onChange={handleFullStartDateChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Login Time</th>
              <th className="p-3">Login Image</th>
              <th className="p-3">Login Location</th>
              <th className="p-3">Logout Time</th>
              <th className="p-3">Logout Image</th>
              <th className="p-3">Logout Location</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{dayjs(record.logintime).format("YYYY-MM-DD")}</td>
                <td className="p-3">{record.ispresent ? "Present" : "Absent"}</td>
                <td className="p-3">{dayjs(record.logintime).format("HH:mm:ss")}</td>
                <td className="p-3">
                  {record.loginImg ? (
                    <img
                      src={record.loginImg}
                      alt="Login"
                      className="w-10 h-10 rounded-full cursor-pointer"
                      onClick={() => {
                        setZoomedImageId(record.loginImg);
                        setIsModalOpen(true);
                      }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleLocationModal(record.loginLocation)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 cursor-pointer"
                  >
                    View
                  </button>
                </td>
                <td className="p-3">
                  {record.logouttime ? dayjs(record.logouttime).format("HH:mm:ss") : "N/A"}
                </td>
                <td className="p-3">
                  {record.logoutImg ? (
                    <img
                      src={record.logoutImg}
                      alt="Logout"
                      className="w-10 h-10 rounded-full cursor-pointer"
                      onClick={() => {
                        setZoomedImageId(record.logoutImg);
                        setIsModalOpen(true);
                      }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleLocationModal(record.logoutLocation)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded  cursor-pointer ${
              currentPage === 1
                ? "bg-gray-300 text-gray-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }` }
          >
            Previous
          </button>
          <span className="font-bold text-lg">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-700"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {model && selectLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-50 bg-white w-[80%] p-8 rounded-lg shadow-lg">
            <Location onClose={handleLocationModalClose} location={selectLocation} />
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseImgModal}
        contentLabel="Zoomed Image"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="flex justify-center items-center">
          {zoomedImageId && (
            <img src={zoomedImageId} alt="Zoomed" className="max-w-full max-h-screen" />
          )}
        </div>
        <button
          className="absolute top-2 right-2 bg-red-600 p-2 px-4 rounded-full text-white cursor-pointer"
          onClick={handleCloseImgModal}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default AttendanceRecord;