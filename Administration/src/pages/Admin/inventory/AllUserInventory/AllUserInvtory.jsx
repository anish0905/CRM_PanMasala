import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../AdminSidebar';
import Sidebar from '../../../SubAdmin/sidebar/Sidebar';
import AdminSideBarModal from '../../AdminSideBarModal';
import SidebarModel from '../../../SubAdmin/sidebar/SidebarModel';
import RightSideDrawer from "../../../../components/RightSideDrawer";
import { CnfInventoryTable } from './CnfInventoryTable';

export const AllUserInventory = () => {
    const email = localStorage.getItem("email");
    const { role } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state

    const BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const url = `${BASE_URL}/api/cnf/inventory/all-inventory`;
            const response = await axios.get(url);
            setInventoryData(response.data.data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex p-5 bg-[#f4f9fe] min-h-screen relative">
            <div className="min-h-screen lg:block hidden">
                {role === "admin" ? <AdminSidebar /> : <Sidebar />}
            </div>

            <div className="lg:ml-72 xl:ml-80 flex flex-col w-full">
                <header className="bg-blue-200 rounded-md shadow p-4 flex items-center justify-between">
                    <h1 className="flex-grow text-end lg:text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
                        {role.toUpperCase()} INVENTORY
                    </h1>
                    <RightSideDrawer />
                    {email && (
                        <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
                            {email}
                        </div>
                    )}
                    <div className="lg:hidden block">
                        {role === "admin" ? <AdminSideBarModal /> : <SidebarModel />}
                    </div>
                </header>

                {/* Loading state */}
                {loading ? (
                    <div className="flex justify-center items-center text-xl text-gray-700">Loading inventory...</div>
                ) : (
                    <CnfInventoryTable inventoryData={inventoryData} />
                )}
            </div>
        </div>
    );
};
