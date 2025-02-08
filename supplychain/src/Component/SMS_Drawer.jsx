import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdSms, MdNotifications, MdHistory, MdClose } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import UnReadMessage from "./Showcase/UnReadMessage";
import HistoryTab from "./HistoryTab";

const SMSDrawer = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications"); // Default tab

  const senderId =
    localStorage.getItem("subAdmin") ||
    localStorage.getItem("cnfId") ||
    localStorage.getItem("superstockist");
  const recipientId = localStorage.getItem("userId");

  // Fetch messages
  const fetchMessages = async () => {
    if (!senderId || !recipientId) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/message/get/${senderId}/${recipientId}`
      );

      setMessages(response.data);

      // Count unread messages
      const unReadMessages = response.data.filter((msg) => !msg.isRead);
      setMessageCount(unReadMessages.length);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages(); // Fetch initially

    const interval = setInterval(() => {
      fetchMessages();
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="relative">
      {/* Floating SMS Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-red-500 transition"
            >
              <MdClose className="text-2xl sm:text-3xl" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav>
            <ul className="list-none flex space-x-6 sm:space-x-8 justify-center">
              {/* Notifications Icon */}
              <li key="notifications" className="relative">
                <span
                  className={`text-gray-600 text-4xl sm:text-3xl cursor-pointer hover:text-blue-500 transition ${
                    activeTab === "notifications" ? "text-blue-500" : ""
                  }`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <MdNotifications />
                </span>
                {messageCount > 0 && (
                  <span className="absolute -top-3 right-1/4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {messageCount}
                  </span>
                )}
              </li>

              {/* Approval Request Icon */}
              <li key="approval" className="relative">
                <span className="text-gray-600 text-4xl sm:text-3xl cursor-pointer hover:text-blue-500 transition">
                  <VscGitPullRequestGoToChanges />
                </span>
              </li>

              {/* History Icon */}
              <li key="history" className="relative">
                <span
                  className={`text-gray-600 text-4xl sm:text-3xl cursor-pointer hover:text-blue-500 transition ${
                    activeTab === "history" ? "text-blue-500" : ""
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  <MdHistory />
                </span>
              </li>
            </ul>
          </nav>

          {/* Display UnReadMessage or HistoryTab Based on Active Tab */}
          <div className="flex-1 overflow-y-auto scroller max-h-[800px]">
            {activeTab === "notifications" && isOpen ? (
              <UnReadMessage messages={messages} />
            ) : (
              <HistoryTab messages={messages} />
            )}
          </div>

          {/* Close Drawer Button */}
          <button
            onClick={() => setIsOpen(false)}
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
