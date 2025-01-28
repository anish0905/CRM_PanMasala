import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import AdminSidebar from '../AdminSidebar';
import AdminSideBarModal from '../AdminSideBarModal';
import RightSideDrawer from '../../../components/RightSideDrawer';


export const ContentHistory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const shop = location.state;
    const userDetails = localStorage.getItem('email');
    const [history, setHistory] = useState();
    const BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchHistoty();
    }, []);

    const fetchHistoty = async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/api/inspectionShop/history/${shop._id}`)
            setHistory(resp.data.history);
            console.log(resp.data.history)
        } catch (error) {
            console.error('Error fetching history:', error);

        }
    }

    return (
        <div className="min-h-screen  flex w-full">
            <div className="min-h-screen  lg:block hidden">
            <AdminSidebar />
            </div>

            <div className="flex-1  lg:ml-80  font-serif w-full lg:p-10 md:p-5 ">
                <header className="flex  items-center justify-between h-auto py-4 bg-[#93c5fd] rounded-xl px-4 lg:px-10 md:px-8">
                    {/* Back Button */}
                    <div className="flex items-center gap-2">
                        <button className="text-xs sm:text-sm lg:text-lg font-bold text-white border-2 sm:border-4 border-blue-900 px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out cursor-pointer"
                            onClick={() => navigate(-1)}>
                            Back
                        </button>
                    </div>

                    {/* Title */}
                    <h1 className="text-sm md:text-lg lg:text-xl font-bold text-gray-800 text-center w-full sm:w-auto pl-0 sm:pl-12 mt-2 sm:mt-0">
                        Content History
                    </h1>
                    <RightSideDrawer/>
                    {/* User Details or Sidebar */}
                    <div className="flex items-center gap-2">
                        {/* For larger screens, show user details */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className="text-xs sm:text-sm lg:text-lg font-bold text-white border-2 sm:border-4 border-blue-900 px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out">
                                {userDetails || "Guest"}
                            </div>
                        </div>

                        {/* For smaller screens, show sidebar modal */}
                        <div className="lg:hidden block">
                            <AdminSideBarModal />
                        </div>
                    </div>
                </header>



                <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md p-6 my-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-5">
                        Vendor Details
                    </h2>
                    {shop ? (
                        <div className=" grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1 gap-4">
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-3">🏪</span>
                                <p className="text-gray-700 text-sm">
                                    <strong>Shop Name:</strong> {shop.shop_name || 'N/A'}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-3">👤</span>
                                <p className="text-gray-700 text-sm">
                                    <strong>Owner Name:</strong> {shop.shop_owner_name || 'N/A'}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-3">📞</span>
                                <p className="text-gray-700 text-sm">
                                    <strong>Contact Number:</strong> {shop.shop_contact_number || 'N/A'}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <span className="text-gray-500 mr-3">💼</span>
                                <p className="text-gray-700 text-sm">
                                    <strong>Status:</strong>{' '}
                                    {shop.status ? (
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-lg ${shop.status.toLowerCase() === 'active'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {shop.status}
                                        </span>
                                    ) : (
                                        'N/A'
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-3">💬</span>
                                <p className="text-gray-700 text-sm">
                                    <strong>Feedback:</strong> {shop.Feedback_Provided || 'N/A'}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-3">🗓️</span>
                                <p className="text-gray-700 text-sm">
                                    <strong>Registration Date:</strong> {shop.createdAt ? new Date(shop.createdAt).toLocaleDateString() : 'N/A'}

                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-3">📍</span>
                                <p className="text-gray-700 text-sm">
                                    <strong>Address:</strong> {shop.shop_address || 'N/A'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500 text-sm mt-3">No Vendor details available.</p>
                    )}
                </section>




                {/* Change History Section */}
                <section className="bg-gray-100 rounded-lg shadow-lg p-5">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Change History</h2>
                    {history && history.length > 0 ? (
                        <div className="space-y-6">
                            {history.map((entry) => {
                                const { field, oldValue, newValue, timestamp, updatedByUser } = entry;

                                return (
                                    <div key={entry._id} className="p-4 border border-gray-200 rounded-md">
                                        <p className="text-sm text-gray-600">
                                            <strong>Field:</strong> {field}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Old Value:</strong> {oldValue || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>New Value:</strong> {newValue || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Updated By:</strong>{" "}
                                            {updatedByUser ? (
                                                <>
                                                    {updatedByUser.name} ({updatedByUser.email})
                                                </>
                                            ) : (
                                                "Unknown"
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No history available.</p>
                    )}
                </section>
            </div>
        </div>
    );
};
