import React from "react";

const UnReadMessage = ({ messages }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Dispatched Products</h2>

      {messages.length > 0 ? (
        messages.map((msg, index) => {
          const messageText = msg.content?.text || "";
          const messageLines = messageText.split("\n");

          // Filter out invalid lines (lines without ':')
          const validLines = messageLines.filter((line) => line.includes(":"));

          return (
            <div key={index} className="mb-6">
              <h3 className="text-md font-semibold mb-2">Order {index + 1}</h3>

              {validLines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">
                          Product Name
                        </th>
                        <th className="border px-4 py-2 text-center">Stock</th>
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
                <p className="text-gray-500 text-sm">No dispatched products</p>
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
