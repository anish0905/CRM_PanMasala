import React, { useState, useEffect } from "react";
import { MdSms, MdNotifications, MdHistory, MdClose } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import axios from "axios";

const SMSDrawer = () => {
  const URI = import.meta.env.VITE_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [fieldManagers, setFieldManagers] = useState([]);
  console.log(fieldManagers, "hhhhhhhhhhhh");

  let messageCount = pendingRequests.length;

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(
        `${URI}/api/approveDeleteRequest/approvedFieldManagers`
      );
      setPendingRequests(response.data.pendingRequests);

      setFieldManagers(response.data.fieldManagers);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const handleAction = async (request, action) => {
    console.log("Action", request);
    try {
      const url = request.fieldManagerId
        ? `${URI}/api/approveDeleteRequest/field-manager/delete-request/approve`
        : `${URI}/api/approveDeleteRequest/distributor/delete-request/approve`;

      await axios.delete(url, {
        data: { requestId: request._id, action: action }, // Correct way to send data in a DELETE request
      });

      setPendingRequests(
        pendingRequests.filter((req) => req._id !== request._id)
      );
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  return (
    <div className="relative">
      {/* Floating SMS Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-teal-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <MdSms className="text-4xl" />
        {messageCount > 0 && (
          <span className="absolute -top-3 right-1/4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {messageCount}
          </span>
        )}
      </button>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 bg-gray-100 rounded-l-lg">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-red-500 transition"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          {/* Notifications Section */}
          <div>
            <h3 className="text-md font-semibold mb-2">Pending Requests</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              pendingRequests.map((request) => {
                const manager = fieldManagers.find(
                  (fm) => fm._id === request.fieldManagerId
                );
                return (
                  <div
                    key={request._id}
                    className="bg-white p-3 rounded-lg shadow mb-2"
                  >
                    <h4>
                      Requiested By:{" "}
                      {manager?.distributors_id?.username ||
                        manager?.superstockist?.username}
                    </h4>
                    <p className="text-gray-800 font-medium">
                      <span>
                        Name:{" "}
                        {manager?.name ||
                          manager?.username ||
                          "Unknown Manager"}
                      </span>
                    </p>
                    <p className="text-gray-800 font-medium">
                      <span>Email: {manager?.email || "Unknown Manager"}</span>
                    </p>
                    <p className="text-gray-800 font-medium">
                      <span>
                        {" "}
                        Designation: {manager?.role || "Unknown Manager"}
                      </span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Reason: {request.reason}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAction(request, "Approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request._id, "Rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSDrawer;
