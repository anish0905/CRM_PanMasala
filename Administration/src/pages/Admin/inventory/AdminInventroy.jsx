import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import RightSideDrawer from "../../../components/RightSideDrawer";
import AdminSideBarModal from "../AdminSideBarModal";
import { BiTransfer } from "react-icons/bi";
import { FaHistory } from "react-icons/fa";
import Sidebar from "../../SubAdmin/sidebar/Sidebar";
import SidebarModel from "../../SubAdmin/sidebar/SidebarModel";

const AdminInventory = () => {
    const email = localStorage.getItem("email");

    
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [inventory, setInventory] = useState(null);
    const navigate = useNavigate();
    const { role } = useParams()
    let currentUserId;

    if(role==="admin"){
        currentUserId = localStorage.getItem("userId");
    }
    else{
        currentUserId = localStorage.getItem("admin");
    }

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/subAdmin/inventory/inventory/${currentUserId}`)
            
            setInventory(response.data.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    return (
        <div className="flex gap-6 min-h-screen w-full">
            {/* Sidebar */}
            <div className="min-h-screen lg:block hidden">
                {
                    role === "admin" ? (
                        <AdminSidebar />
                    ):(
                        <Sidebar/>
                    )
                }
                
            </div>

            {/* Main Content */}
            <div className="lg:ml-80 w-full md:p-5 p-4">
                <div className="bg-[#93c5fd] rounded-md shadow p-4 flex  gap-4 items-center justify-between mb-6">
                    <h1 className="text-lg lg:text-xl font-bold text-gray-800">
                        My Inventory
                    </h1>
                    <RightSideDrawer />
                    <div className="flex justify-between items-center content-center gap-4">
                        {role === "admin" ? (
                            <button
                                className="bg-[#FFA500] hover:bg-[#ff7f00] text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out cursor-pointer"
                                onClick={() => navigate("/add-inventory/admin")}
                            >
                                Add inventory
                            </button>
                        ) : (
                            <button
                                className="bg-[#FFA500] hover:bg-[#ff7f00] text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out cursor-pointer"
                                onClick={() => navigate("/Dispatch-History/subAdmin")}
                            >
                                Dispatch inventory
                            </button>
                        )}



                        {email && (
                            <div className="hidden sm:flex items-center text-white font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[#2a6cc2] hover:bg-blue-800 transition">
                                {email}
                            </div>
                        )}
                        <div className="lg:hidden block">
                           {
                            role === "admin"? (
                                <AdminSideBarModal />
                            ) : (
                                <SidebarModel />
                            )
                           }
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                {inventory && inventory.products?.length > 0 ? (
                    <div className="overflow-x-auto  ">
                        <div className="border border-gray-300 shadow-lg rounded-lg  overflow-hidden overflow-x-auto overflow-y-auto">
                            <table className="w-full table-auto border-collapse">
                                {/* Table Header */}
                                <thead className="bg-blue-600 text-white text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="  px-6 py-4 text-left">Product Name</th>
                                        <th className="  px-6 py-4 text-center">Quantity</th>
                                        <th className="  px-6 py-4 text-center">Price</th>
                                        <th className="  px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {inventory.products.map((product, index) => (
                                        <tr
                                            key={product._id}
                                            className={`border border-gray-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                } hover:bg-blue-50 transition-all duration-200`}
                                        >
                                            <td className=" px-6 py-4 text-left">
                                                {product.productId?.title || "N/A"}
                                            </td>
                                            <td className=" px-6 py-4 text-center">
                                                {product.quantity || 0}
                                            </td>
                                            <td className=" px-6 py-4 text-center">
                                                {product.productId?.price ? `₹ ${product.productId.price.toFixed(2)}` : "N/A"}
                                            </td>
                                            <td className=" px-4 py-2 flex justify-center gap-4">
                                                <button
                                                    className="bg-[#1e40af] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 cursor-pointer"
                                                >
                                                    <FaHistory />
                                                </button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                {/* Table Footer */}
                                <tfoot>
                                    <tr className="bg-gray-200 font-semibold text-gray-700">
                                        <td className=" px-6 py-4 text-left">Total Stock</td>
                                        <td className=" px-6 py-4 text-center">{inventory.remainingStock || 0}</td>
                                        <td className=" px-6 py-4 text-right">Total Dispatched: {inventory.dispatchedStock || 0}</td>
                                        <td className=" px-6 py-4 text-center"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 font-semibold mt-5">No inventory available.</p>
                )}
            </div>
        </div>
    );
};

export default AdminInventory;
