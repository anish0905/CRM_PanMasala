import React from 'react';

export const DistributoryInventoryTable = ({ inventoryData }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          
          <tbody>
            {inventoryData.map((inventory, index) => (
              <tr
                key={index}
                className={`border border-gray-300 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'} transition-all duration-200 hover:bg-blue-200`}
              >
                <td className="px-6 py-2 text-center">{inventory.distributoryName}</td>
                <td className="px-6 py-2 text-center">{inventory.mobileNo}</td>
                <td className="px-6 py-2 text-center">{inventory.state}</td>
                <td className="px-6 py-2 text-center">{inventory.district}</td>
                <td className="px-6 py-2 text-center">
                    {inventory.inventory.length > 0 ? (
                      inventory.inventory[0].productId.map((product, idx) => (
                        <div key={idx}>
                          <h1 className="px-6 py-1 text-center">{product.productName}</h1>
                        </div>
                      ))
                    ) : (
                      <p>No products available</p>
                    )}
                  </td>
                  <td className="px-6 py-2 text-center">
                    {inventory.inventory.length > 0 ? (
                      inventory.inventory[0].productId.map((product, idx) => (
                        <div key={idx} className="px-6 py-1 text-center">
                          {product.quantity}
                        </div>
                      ))
                    ) : (
                      <p>No inventory</p>
                    )}
                  </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
