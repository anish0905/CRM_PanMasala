import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdSms, MdNotifications, MdHistory, MdClose } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import UnReadMessage from "./Showcase/UnReadMessage";

const SMSDrawer = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [messages, setMessages] = useState([]);

  console.log("SMSDrawer", messages);

  // Get senderId from localStorage (subAdmin) and recipientId (userId)
  const senderId = localStorage.getItem("subAdmin");
  const recipientId = localStorage.getItem("userId");

  const fetchMessages = async () => {
    if (!senderId || !recipientId) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/message/get/${senderId}/${recipientId}`
      );
      setMessages(response.data); // Store messages in state
      setMessageCount(response.data.length); // Set message count
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [isOpen]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleTooltip = (id) => {
    if (window.innerWidth <= 768) {
      setActiveTooltip(activeTooltip === id ? null : id);
    }
  };

  return (
    <div className="relative">
      {/* Floating SMS Icon Button */}
      <button
        onClick={toggleDrawer}
        className="fixed bottom-6 right-6 bg-teal-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all sm:bottom-4 sm:right-4"
      >
        <MdSms className="text-4xl sm:text-3xl" />
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
        <div className="flex flex-col h-full p-4 sm:p-6 bg-gray-100 rounded-l-lg">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Messages
            </h2>
            <button
              onClick={toggleDrawer}
              className="text-gray-600 hover:text-red-500 transition"
            >
              <MdClose className="text-2xl sm:text-3xl" />
            </button>
          </div>
          <nav>
            <ul className="list-none flex space-x-6 sm:space-x-8 justify-center">
              {/* Notifications Icon with Message Count */}
              <li key="notifications" className="relative">
                <span
                  className="text-gray-600 text-4xl sm:text-3xl cursor-pointer hover:text-blue-500 transition relative"
                  onMouseEnter={() =>
                    window.innerWidth > 768 && setActiveTooltip("notifications")
                  }
                  onMouseLeave={() =>
                    window.innerWidth > 768 && setActiveTooltip(null)
                  }
                >
                  <MdNotifications />

                  {activeTooltip === "notifications" && (
                    <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-md whitespace-nowrap">
                      Notifications
                    </span>
                  )}
                </span>
              </li>

              {/* Approval Request Icon */}
              <li key="approval" className="relative">
                <span
                  className="text-gray-600 text-4xl sm:text-3xl cursor-pointer hover:text-blue-500 transition relative"
                  onMouseEnter={() =>
                    window.innerWidth > 768 && setActiveTooltip("approval")
                  }
                  onMouseLeave={() =>
                    window.innerWidth > 768 && setActiveTooltip(null)
                  }
                  onClick={() => toggleTooltip("approval")}
                >
                  <VscGitPullRequestGoToChanges />
                  {activeTooltip === "approval" && (
                    <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-md whitespace-nowrap">
                      Approval Request
                    </span>
                  )}
                </span>
              </li>

              {/* History Icon */}
              <li key="history" className="relative">
                <span
                  className="text-gray-600 text-4xl sm:text-3xl cursor-pointer hover:text-blue-500 transition relative"
                  onMouseEnter={() =>
                    window.innerWidth > 768 && setActiveTooltip("history")
                  }
                  onMouseLeave={() =>
                    window.innerWidth > 768 && setActiveTooltip(null)
                  }
                  onClick={() => toggleTooltip("history")}
                >
                  <MdHistory />
                  {activeTooltip === "history" && (
                    <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-md whitespace-nowrap">
                      History
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </nav>

          <div className="flex-1 overflow-y-auto max-h-[800px] scroller">
            {isOpen && <UnReadMessage messages={messages} />}
          </div>

          {/* Close Drawer Button */}
          <button
            onClick={toggleDrawer}
            className="mt-auto bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all shadow-md"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSDrawer;
