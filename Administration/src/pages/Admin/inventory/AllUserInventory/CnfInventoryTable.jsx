import React, { useEffect, useState } from 'react';
import { SuperStockistInventoryTable } from './SuperStockistInventoryTable';
import axios from 'axios';

export const CnfInventoryTable = ({ inventoryData }) => {
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [selectCnfId, setselectCnfId] = useState(null);
  const [selectSuperStockistInventoryData, setselectSuperStockistInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (selectCnfId) fetchInventory();
  }, [selectCnfId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/api/superstockist/inventory/super-inventory/${selectCnfId}`;
      const response = await axios.get(url);
      console.log(response.
        data);
      setselectSuperStockistInventoryData(response.data);
    } catch (error) {
      console.error('Error fetching Super Stockist inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClicked = (index, id) => {
    setClickedRowIndex(clickedRowIndex === index ? null : index);
    setselectCnfId(id);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-center">Cnf Name</th>
              <th className="px-6 py-3 text-center">Mobile No</th>
              <th className="px-6 py-3 text-center">State</th>
              <th className="px-6 py-3 text-center">District</th>
              <th className="px-6 py-3 text-center">Product</th>
              <th className="px-6 py-3 text-center">Quantity</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((inventory, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`border border-gray-300 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'}`}
                >
                  <td className="px-6 py-2 text-center">{inventory.userId.username}</td>
                  <td className="px-6 py-2 text-center">{inventory.userId.mobileNo}</td>
                  <td className="px-6 py-2 text-center">{inventory.userId.state}</td>
                  <td className="px-6 py-2 text-center">{inventory.userId.district}</td>

                  <td className="px-6 py-2 text-center">
                    {inventory.products.map((product, idx) => (
                      <div key={idx}>
                        <h1 className="px-6 py-1 text-center">{product.productId.title}</h1>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-2 text-center">
                    {inventory.products.map((product, idx) => (
                      <div key={idx} className="px-6 py-1 text-center">
                        {product.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-2 text-center">
                    <button
                      onClick={() => handleOnClicked(index, inventory.userId._id)}
                      className="border-none text-white bg-blue-600 hover:bg-blue-800 py-2 px-4 rounded-md transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                      Super Stockist View
                    </button>
                  </td>
                </tr>

                {clickedRowIndex === index && selectSuperStockistInventoryData.length > 0 && (
                  <tr className="bg-gray-200">
                    <td colSpan="7" className="px-6 py-4">
                      {/* Loading state for super stockist inventory */}
                      {loading ? (
                        <div className="flex justify-center items-center text-xl text-gray-700">Loading Super Stockist inventory...</div>
                      ) : (
                        <SuperStockistInventoryTable inventoryData={selectSuperStockistInventoryData} />
                      )}
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
