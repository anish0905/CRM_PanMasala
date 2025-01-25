import React, { useEffect, useState } from 'react';

import { BiTransfer } from "react-icons/bi";
import { FaHistory, FaTimes } from 'react-icons/fa'; // Added FaTimes for the close icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import DispatchInventoryForm from './DispatchInventoryForm';
import { SuperStockistSideBar } from '../SuperStockistSideBar';
import { AddStock } from './AddStock';


export const SuperStockistInventory = () => {
    const email = localStorage.getItem("email");
    const [showModelAddProduct, setShowModelAddProduct] = useState(false);
    const [showModelDisptch, setShowModelDisptch] = useState(false);
    const [selectInvetery, setSelectInvetery] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);
    const userId = localStorage.getItem("currentUserId")

    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
    }, []);

    // Fetch inventory data
    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/superstockistinventory/${userId}`);
            setInventoryData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Calculate stock metrics
    const totalStock = inventoryData.reduce((sum, item) => sum + item.receivedStock, 0);
    const totalRemainingStock = inventoryData.reduce((sum, item) => sum + item.remainingStock, 0);
    const dispatchStock = inventoryData.reduce((sum, item) => sum + item.dispatchedStock, 0);

    
   

    const handleCloseModal = () => {
        setShowModelAddProduct(false);
        setShowModelDisptch(false);
    };

    const hanledispatch = (id) => {
        setShowModelDisptch(true);
        setSelectInvetery(id);


    }

    const handleHistory = (id) => {
        navigate(`/inventory/history/${id}/superstockist`);
    }

    const handleAddStock = () => {
        setShowModelAddProduct(true);
    };


    return (
        <div className="min-h-screen bg-[#dbeafe] flex w-full">
            {/* Sidebar for large screens */}
            <div className="lg:p-5 xl:p-5 ml-0 p-0">
        <SuperStockistSideBar />
      </div>

            {/* Main Content */}
            <div className="lg:ml-70 xl:ml-96 flex flex-col h-full px-5 my-4 w-full">
                {/* Header */}
                <header className="bg-[#93c5fd] rounded-md shadow p-4 flex gap-4 items-center justify-between">
                    <h1 className="flex-grow text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
                        My Inventory
                    </h1>
                    <button
                        className="bg-[#FFA500] hover:bg-[#ff7f00] flex justify-end text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
                        onClick={handleAddStock}
                    >
                        Add Stock
                    </button>
                    
                    {email && (
                        <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
                            {email}
                        </div>
                    )}
                   
                </header>

                {/* Main Content Area */}
                <div className="flex-grow bg-[#1E40AF] rounded-md shadow mt-4 p-6">
                    {showModelAddProduct && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                            <div className="bg-slate-200 p-6 rounded-md relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-500"
                                    onClick={handleCloseModal}
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                                <AddStock onClose={handleCloseModal} fetchInventory={fetchInventory} />
                            </div>
                        </div>
                    )}

                    {showModelDisptch && selectInvetery && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 ">
                            <div className="bg-slate-200 p-6 rounded-md relative w-1/2">
                                <button
                                    className="absolute top-2 right-2 text-white bg-red-500 w-10 h-10 rounded-full flex justify-center items-center content-center"
                                    onClick={handleCloseModal}
                                >
                                    <FaTimes className="text-2xl" />
                                </button>
                                <DispatchInventoryForm onClose={handleCloseModal} fetchInventory={fetchInventory} selectInvetery={selectInvetery} />
                            </div>
                        </div>
                    )}


                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300 text-center">
                            <thead>
                                <tr className="bg-[#6daef8] text-white">
                                    <th className="border px-4 py-2">Product Name</th>
                                    <th className="border px-4 py-2">Stock</th>
                                    <th className="border px-4 py-2">Dispatched Stock</th>
                                    <th className="border px-4 py-2">Remaining Stock</th>
                                    <th className="border px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <td className="border px-4 py-2">{item.productName}</td>
                                        <td className="border px-4 py-2">{item.receivedStock}</td>
                                        <td className="border px-4 py-2">{item.dispatchedStock}</td>
                                        <td className="border px-4 py-2">{item.remainingStock}</td>
                                        <td className="border px-4 py-2 flex justify-center gap-4">
                                            <button
                                                className="bg-[#1e40af] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
                                                onClick={() => handleHistory(item._id)}
                                            >
                                                <FaHistory />
                                            </button>
                                            <button
                                                className="bg-[#44be34] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
                                                onClick={() => hanledispatch(item)}
                                            >
                                                <BiTransfer />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-200 font-bold">
                                    <td className="border px-4 py-2" colSpan="1">
                                        Total Stock
                                    </td>
                                    <td className="border px-4 py-2">{totalStock}</td>
                                    <td className="border px-4 py-2" colSpan="1">
                                        {dispatchStock}
                                    </td>
                                    <td className="border px-4 py-2">{totalRemainingStock}</td>
                                    <td className="border px-4 py-2" colSpan="3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SuperStockistInventory;
