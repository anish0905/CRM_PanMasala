import React from 'react'
import { IoMdCloseCircle } from 'react-icons/io'

export const NormalMsg = ({msg,handleRemoveMessage}) => {
    return (
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
    )
}
