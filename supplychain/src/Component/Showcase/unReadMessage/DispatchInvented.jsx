import React from 'react'
import { IoMdCloseCircle } from 'react-icons/io';

export const DispatchInvented = ({ handleRemoveMessage,msg,validLines }) => {
    return (
        <div> <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-full relative">
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
            <h1 className="text-xl font-semibold  mb-4  text-green-500">Dispatched Inventory </h1>

            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
               
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
                                    {stock }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div></div>
    )
}
