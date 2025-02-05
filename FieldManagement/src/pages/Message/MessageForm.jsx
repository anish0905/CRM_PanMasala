import React, { useState } from "react";
import axios from "axios";
import FEASidebar from "../../components/Sidebar/FEASidebar";

const MessageForm = () => {
  const email = localStorage.getItem("email");
  const [messageData, setMessageData] = useState({
    sender: "",
    senderName: "",
    recipient: "",
    text: "",
    originalMessage: "",
    replyMsg: "",
    attachments: [],
  });

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageData({ ...messageData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const type = uploadedFile.type.includes("image") ? "image" : "document";
      setFileType(type);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipientsArray = messageData.recipient
      .split(",")
      .map((id) => id.trim());

    const payload = {
      sender: messageData.sender,
      senderName: messageData.senderName,
      recipient: recipientsArray,
      text: messageData.text,
      originalMessage: messageData.originalMessage || null,
      replyMsg: messageData.replyMsg || null,
      attachments: file
        ? [{ type: fileType, url: URL.createObjectURL(file) }]
        : [],
    };

    try {
      const response = await axios.post(
        "http://localhost:5002/api/message/send",
        payload, // Send as JSON
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Message sent successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex">
      <div className="h-screen lg:fixed  top-0 left-0  lg:w-64">
        <FEASidebar />
      </div>
      <div className="flex-1 p-6 lg:ml-80 overflow-y-auto">
        <header className="bg-[#93c5fd] rounded-md shadow p-4 flex justify-between items-center gap-2 ">
          <h1 className="lg:text-xl md:text-base text-xs font-bold text-gray-800 pl-12">
            Reports
          </h1>
          <div className="lg:text-2xl md:text-xl text-xs text-white font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out mr-4">
            {email}
          </div>
        </header>

        <div className=" mx-auto p-4 bg-white shadow-lg rounded-lg mt-12">
          <h2 className="text-xl font-bold mb-4">Send Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="sender"
              value={messageData.sender}
              onChange={handleChange}
              placeholder="Sender ID"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="senderName"
              value={messageData.senderName}
              onChange={handleChange}
              placeholder="Sender Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="recipient"
              value={messageData.recipient}
              onChange={handleChange}
              placeholder="Recipient IDs (comma-separated)"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="text"
              value={messageData.text}
              onChange={handleChange}
              placeholder="Enter your message..."
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="originalMessage"
              value={messageData.originalMessage}
              onChange={handleChange}
              placeholder="Original Message (optional)"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="replyMsg"
              value={messageData.replyMsg}
              onChange={handleChange}
              placeholder="Reply Message (optional)"
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
