import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RightSideDrawer from "../../Component/SMS_Drawer";
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import CNFSidebar from '../CNF/CNFSidebar';
import SuperStockistSidebar from '../SuperStockists/SSsidebar/SuperStockistSidebar';
import DistributorSidebar from '../Distributer/sidebar/DistributorSidebar';
import CNFSideBarModal from '../CNF/CNFSideBarModal';
import SuperStockistBarModal from '../SuperStockists/SSsidebar/SuperStockistBarModal';
import DistributorBarModal from '../Distributer/sidebar/DistributorBarModal';
const AddInventory = () => {
    const email = localStorage.getItem("email");
    const currentUserId = localStorage.getItem("userId");
    const [revisedDate, setRevisedDate] = useState(new Date());
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [orderId, setOrderId] = useState("");
    

    const BASE_URL = import.meta.env.VITE_API_URL;

    const { role } = useParams()



    const handleDateChange = (date) => {
        setRevisedDate(date);
    };

 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');

      
        if (!orderId || orderId.length !== 12) {
            Swal.fire("Error", "Order ID must be exactly 12 characters!", "error");
            return;
        }

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update the inventory?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.post(`${BASE_URL}/api/${role}/inventory/add-inventory`, {
                userId: currentUserId,
                revisedDate:revisedDate,
                orderId: orderId,
                
            });

            setMessage('Inventory updated successfully!');
            
        } catch (error) {
            setIsError(true);
            setMessage('Error updating inventory. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex gap-6 min-h-screen w-full">
            <div className="min-h-screen lg:block hidden">
                {
                    role === "cnf" ? (
                        <CNFSidebar />
                    ) : role === "superstockist" ? (
                        <SuperStockistSidebar />
                    ) : (
                        <DistributorSidebar />
                    )
                }
            </div>

            <div className="lg:ml-80 font-serif w-full md:p-5 p-4">
                <div className="bg-[#93c5fd] rounded-md shadow p-4 flex gap-4 items-center justify-between mb-6">
                    <h1 className="flex-grow text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
                        Add Inventory
                    </h1>
                    <RightSideDrawer />
                    {email && (
                        <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition">
                            {email}
                        </div>
                    )}
                    <div className="lg:hidden block">
                        {
                            role == "cnf" ? (
                                <CNFSideBarModal />
                            ) ? role == "superstockist" : (
                                <SuperStockistBarModal />
                            ) : (
                                <DistributorBarModal />
                            )
                        }
                    </div>
                </div>

                <div className="bg-gray-100 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Inventory Details</h2>

                    {message && (
                        <div className={`mb-4 p-3 rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Order ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter  Order ID"
                            maxLength={12}
                            required
                        />
                    </div>


                    <div className="flex justify-center items-center content-center flex-wrap gap-4 mb-4">
                        

                        
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Revised Date
                        </label>
                        <DatePicker
                            selected={revisedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>

                   
                    

                    <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-2 px-4 mt-6 rounded-md hover:bg-green-700 transition">
                        Submit Inventory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddInventory;
