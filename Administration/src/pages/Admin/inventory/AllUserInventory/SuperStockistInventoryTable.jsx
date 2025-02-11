import React, { useEffect, useState } from 'react';
import { DistributoryInventoryTable } from './DistributoryInventoryTable';
import axios from 'axios';

export const SuperStockistInventoryTable = ({ inventoryData }) => {
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [selectSuperstockistId, setselectSuperstockistId] = useState(null);
  const [selectSuperStockistInventoryData, setselectSuperStockistInventoryData] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchInventory();
  }, [selectSuperstockistId]);

  const fetchInventory = async () => {
    try {
      const url = `${BASE_URL}/api/distributor/inventory/super-inventory/${selectSuperstockistId}`;
      const response = await axios.get(url);
      
      setselectSuperStockistInventoryData(response.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };




  // Handle when a row is clicked
  const handleOnClicked = (index, id) => {
    setClickedRowIndex(clickedRowIndex === index ? null : index);
    setselectSuperstockistId(id);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          
          <tbody>
            {inventoryData.map((inventory, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`border border-gray-300 ${index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'} transition-all duration-200 hover:bg-blue-300`}
                >
                  <td className="px-6 py-2 text-center">{inventory.superstockistName}</td>
                  <td className="px-6 py-2 text-center">{inventory.mobileNo}</td> {/* Fixed this */}
                  <td className="px-6 py-2 text-center">{inventory.state}</td>
                  <td className="px-6 py-2 text-center">{inventory.district}</td>

                  {/* Display product details */}
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

                  {/* Display quantity for each product */}
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

                  <td className="px-6 py-2 text-center">
                    <button
                      onClick={() => handleOnClicked(index, inventory.superstockistId)} // Fixed the ID to superstockistId
                      className="border-none text-white bg-blue-600 hover:bg-blue-800 py-2 px-4 rounded-md transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                      Distributory View
                    </button>
                  </td>
                </tr>

                {/* If the row is clicked, show distributory inventory */}
                {clickedRowIndex === index && (
                  <tr className="bg-gray-200">
                    <td colSpan="7" className="px-6 py-4">
                      <DistributoryInventoryTable inventoryData={selectSuperStockistInventoryData} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};
