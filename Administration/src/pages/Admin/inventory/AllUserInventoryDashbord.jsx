import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../AdminSidebar';
import Sidebar from '../../SubAdmin/sidebar/Sidebar';
import AdminSideBarModal from '../AdminSideBarModal';
import SidebarModel from '../../SubAdmin/sidebar/SidebarModel';
import MyInventoryTable from './MyInventoryTable';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaMap, FaArrowLeft } from 'react-icons/fa';
import RightSideDrawer from "../../../components/RightSideDrawer";

const AllUserInventoryDashbord = () => {
    const email = localStorage.getItem("email");
    const { id, role,currentUser } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [inventoryData, setInventoryData] = useState([]);
    const { user } = location.state || {};

    const BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchInventory();
    }, [id]);

    const fetchInventory = async () => {
        try {
            const url = `${BASE_URL}/api/${role}/inventory/inventory/${id}`;
            const response = await axios.get(url);
            setInventoryData(response.data.data);
        } catch (error) {
            console.error('Error fetching inventory history:', error);
        }
    };

    return (
        <div className="flex p-5 bg-[#e8effe] min-h-screen relative">
            <div className="min-h-screen lg:block hidden">
                {currentUser === "Admin" ? <AdminSidebar /> : <Sidebar />}
            </div>

            <div className="lg:ml-72 xl:ml-80 flex flex-col h-full w-full">
                <header className="bg-[rgb(147,197,253)] rounded-md shadow p-4 flex gap-4 items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-gray-800 hover:text-gray-600  cursor-pointer">
                        <FaArrowLeft className="text-2xl" />
                    </button>
                    <h1 className="flex-grow text-end lg:text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
                        {role.toUpperCase() } INVENTORY
                    </h1>
                    <RightSideDrawer />
                    {email && (
                        <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
                            {email}
                        </div>
                    )}
                    <div className="lg:hidden block">
                        {currentUser === "admin" ? <AdminSideBarModal /> : <SidebarModel />}
                    </div>
                </header>

                {user && (
                    <div className="bg-white rounded-md shadow-md p-6 my-6">
                        <h2 className="text-xl font-bold mb-4 text-center py-3 bg-[rgb(110,171,240)] text-white rounded-md">
                            {role.toUpperCase()} DETAILS
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <p className="flex items-center gap-2 text-gray-700"><FaUser className="text-blue-500" /> <strong>Name:</strong> {user.username}</p>
                            <p className="flex items-center gap-2 text-gray-700"><FaEnvelope className="text-green-500" /> <strong>Email:</strong> {user.email}</p>
                            <p className="flex items-center gap-2 text-gray-700"><FaPhone className="text-red-500" /> <strong>Phone No:</strong> {user.mobileNo}</p>
                            <p className="flex items-center gap-2 text-gray-700"><FaMapMarkerAlt className="text-yellow-500" /> <strong>Address:</strong> {user.address}</p>
                            <p className="flex items-center gap-2 text-gray-700"><FaCity className="text-purple-500" /> <strong>City:</strong> {user.city}</p>
                            <p className="flex items-center gap-2 text-gray-700"><FaMap className="text-indigo-500" /> <strong>State:</strong> {user.state}</p>
                        </div>
                    </div>
                )}

                <MyInventoryTable inventory={inventoryData} />
            </div>
        </div>
    );
};

export default AllUserInventoryDashbord;