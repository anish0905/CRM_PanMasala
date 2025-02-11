import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import { DispatchInvented } from "./DispatchInvented";
import { NormalMsg } from "./NormalMsg";
import { InventoryRequiest } from "./InventoryRequiest";

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
      <h2 className="text-lg font-semibold mb-2">Notification</h2>

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
                <div className="overflow-x-auto scroller">
                  {msg.subject === "inventory" ? (
                    <DispatchInvented handleRemoveMessage={handleRemoveMessage} msg={msg} validLines={validLines} />
                   
                  ) : (
                    
                    <InventoryRequiest  handleRemoveMessage={handleRemoveMessage} msg={msg} validLines={validLines}/>
                    
                  )}
                </div>
              ) : (
                <NormalMsg msg={msg} handleRemoveMessage={handleRemoveMessage} />
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
