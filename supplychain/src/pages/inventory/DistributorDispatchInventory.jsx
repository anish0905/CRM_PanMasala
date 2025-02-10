import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import RightSideDrawer from '../../Component/SMS_Drawer';
import MyInventoryTable from './MyInventoryTable';
import DistributorBarModal from '../Distributer/sidebar/DistributorBarModal';
import DistributorSidebar from '../Distributer/sidebar/DistributorSidebar';

const DistributorDispatchInventory = () => {
    const email = localStorage.getItem("email");
    const currentUserId = localStorage.getItem("userId");
    const BASE_URL = import.meta.env.VITE_API_URL;

    const [inventory, setInventory] = useState(null);
    const [revisedDate, setRevisedDate] = useState(new Date());
    const [inventoryItems, setInventoryItems] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/distributor/inventory/inventory/${currentUserId}`);
            setInventory(response.data.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const handleDateChange = (date) => {
        setRevisedDate(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');

        if (!revisedDate) {
            Swal.fire("Error", "Please select a dispatch date!", "error");
            return;
        }

        

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Dispatch the inventory?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Dispatch it!",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.post(`${BASE_URL}/api/distributor/inventory/dispatch-inventory`, {
                userId: currentUserId,
                orderId,
                receivedDate: revisedDate.toISOString().split('T')[0],
                products: inventoryItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    productName: item.productName,
                })),
            });
            fetchInventory();
            setMessage('Inventory updated successfully!');
            setInventoryItems([]);
        } catch (error) {
            setIsError(true);
            setMessage('Error updating inventory. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex gap-6 min-h-screen w-full">
            <div className="min-h-screen lg:block hidden">
                <DistributorSidebar />
            </div>
            <div className="lg:ml-80 font-serif w-full md:p-5 p-4">
                <div className="bg-[#93c5fd] rounded-md shadow p-4 flex gap-4 items-center justify-between mb-6">
                    <h1 className="flex-grow text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
                        Dispatch Inventory
                    </h1>
                    <RightSideDrawer />
                    {email && (
                        <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition">
                            {email}
                        </div>
                    )}
                    <div className="lg:hidden block">
                        <DistributorBarModal />
                    </div>
                </div>

                <MyInventoryTable inventory={inventory} />

                <div className="bg-gray-100 rounded-lg shadow-lg p-8">
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Order ID <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter The Pan shop Order ID"
                            maxLength={12}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Revised Date</label>
                        <DatePicker
                            selected={revisedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-500 text-white py-3 px-4 mt-6 rounded-md shadow-md hover:bg-green-600 transition"
                    >
                        Submit Inventory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DistributorDispatchInventory;