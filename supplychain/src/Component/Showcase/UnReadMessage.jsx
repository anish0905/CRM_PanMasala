import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";

const UnReadMessage = ({ messages }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [filteredMessages, setFilteredMessages] = useState(messages);

  // Sorting messages based on timestamp (descending order)
  const sortedMessages = [...filteredMessages].sort(
    (b, a) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Function to remove a message and update isRead in the backend
  const handleRemoveMessage = async (messageId) => {
    try {
      await axios.put(`${BASE_URL}/api/message/unread/${messageId}`, {
        isRead: true,
      });

      // Remove the message from state after a successful update
      setFilteredMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Dispatched Products</h2>

      {sortedMessages.length > 0 ? (
        sortedMessages.map((msg, index) => {
          if (msg.isRead) return null; // Skip already read messages

          const messageText = msg.content?.text || "";
          const messageLines = messageText.split("\n");

          // Filter out invalid lines (lines without ':')
          const validLines = messageLines.filter((line) => line.includes(":"));

          return (
            <div key={msg._id} className="mb-6">
              {validLines.length > 0 ? (
                <div className="overflow-x-auto">
                  {msg.subject === "inventory" ? (
                    // Table format for inventory messages
                    <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-full relative">
                      <button
                        className="absolute top-1 right-2 text-gray-600 hover:text-red-500 transition"
                        onClick={() => handleRemoveMessage(msg._id)}
                      >
                        <IoMdCloseCircle className="text-2xl sm:text-3xl" />
                      </button>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-semibold">
                            {msg.senderName
                              ? msg.senderName[0].toUpperCase()
                              : "?"}
                          </div>
                          <h4 className="ml-3 text-lg font-semibold text-gray-800">
                            {msg.senderName || "Unknown Sender"}
                          </h4>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {msg.updatedAt
                            ? new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }).format(new Date(msg.updatedAt))
                            : "Unknown Date"}
                        </p>
                      </div>

                      <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-center">
                              Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {validLines.map((line, i) => {
                            const [product, stock] = line
                              .split(":")
                              .map((part) => part.trim());

                            return (
                              <tr key={i} className="border-b">
                                <td className="border px-4 py-2">
                                  {product || "Unknown Product"}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                  {stock || "0"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    // Card format for non-inventory messages
                    <div className="bg-white border border-gray-300 rounded-md shadow-md p-4 relative">
                      <button
                        className="absolute top-1 right-2 text-gray-600 hover:text-red-500 transition"
                        onClick={() => handleRemoveMessage(msg._id)}
                      >
                        <IoMdCloseCircle className="text-2xl sm:text-3xl" />
                      </button>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-semibold">
                            {msg.senderName
                              ? msg.senderName[0].toUpperCase()
                              : "?"}
                          </div>
                          <h4 className="ml-3 text-lg font-semibold text-gray-800">
                            {msg.senderName || "Unknown Sender"}
                          </h4>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {msg.updatedAt
                            ? new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }).format(new Date(msg.updatedAt))
                            : "Unknown Date"}
                        </p>
                      </div>

                      {validLines.map((line, i) => {
                        const [label, value] = line
                          .split(":")
                          .map((part) => part.trim());

                        return (
                          <div key={i} className="mb-2">
                            <p className="font-semibold">{label}:</p>
                            <p className="text-gray-700">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition"
                    onClick={() => handleRemoveMessage(msg._id)}
                  >
                    <IoMdCloseCircle className="text-2xl sm:text-3xl" />
                  </button>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-semibold">
                        {msg.senderName ? msg.senderName[0].toUpperCase() : "?"}
                      </div>
                      <h4 className="ml-3 text-lg font-semibold text-gray-800">
                        {msg.senderName || "Unknown Sender"}
                      </h4>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {msg.updatedAt
                        ? new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(msg.updatedAt))
                        : "Unknown Date"}
                    </p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg text-gray-700 text-base">
                    {msg.content?.text || "No message available"}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-sm text-center">
          No dispatched products
        </p>
      )}
    </div>
  );
};

export default UnReadMessage;
