import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import AdminSidebar from "../AdminSidebar";
import RightSideDrawer from "../../../components/RightSideDrawer";
import AdminSideBarModal from "../AdminSideBarModal";
import SidebarModel from "../../SubAdmin/sidebar/SidebarModel";
import Sidebar from "../../SubAdmin/sidebar/Sidebar";

const StockHistory = () => {
    const email = localStorage.getItem("email");
   
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [inventory, setInventory] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
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
            const response = await axios.get(`${BASE_URL}/api/subAdmin/inventory/inventory/${currentUserId}`);
            setInventory(response.data.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setSelectedDate("");
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedMonth("");
    };

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const filteredRevisions = inventory?.revisedStockHistory?.filter(revision => {
        const revisionDate = new Date(revision.revisedDate);
        if (selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            return revisionDate.getFullYear() === parseInt(year) && 
                   (revisionDate.getMonth() + 1) === parseInt(month);
        }
        if (selectedDate) {
            const selectedDay = new Date(selectedDate);
            return isSameDay(revisionDate, selectedDay);
        }
        return true;
    }) || [];

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Stock History Report</title>
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2>Stock History Report</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Previous Stock</th>
                                <th>Quantity Added</th>
                                <th>New Stock</th>
                                <th>Revised From</th>
                                <th>Revised Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredRevisions.map((revision, index) =>
                                revision.products.map((product, subIndex) => `
                                    <tr>
                                        <td>${inventory.products.find(p => p.productId._id === product.productId)?.productId?.title || "N/A"}</td>
                                        <td>${product.previousStock}</td>
                                        <td>${product.quantityAdded}</td>
                                        <td>${product.newStock}</td>
                                        <td>${revision.revisedBy.username}</td>
                                        <td>${new Date(revision.revisedDate).toLocaleString()}</td>
                                    </tr>
                                `).join('')
                            ).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleExportExcel = () => {
        const data = [];
        // Headers
        data.push(["Product Name", "Previous Stock", "Quantity Added", "New Stock", "Revised From", "Revised Date"]);

        // Rows
        filteredRevisions.forEach((revision) => {
            revision.products.forEach((product) => {
                const productName = inventory.products.find(p => p.productId._id === product.productId)?.productId?.title || "N/A";
                data.push([
                    productName,
                    product.previousStock,
                    product.quantityAdded,
                    product.newStock,
                    revision.revisedBy.username,
                    new Date(revision.revisedDate).toLocaleString(),
                ]);
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stock History");
        XLSX.writeFile(wb, "StockHistory.xlsx");
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
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-md shadow p-4 flex flex-wrap gap-4 items-center justify-between mb-6">
                    <h1 className="text-lg lg:text-xl font-bold text-white">
                        Stock History
                    </h1>
                    <RightSideDrawer />
                    <div className="flex justify-between items-center content-center gap-4">
                        {email && (
                            <div className="hidden sm:flex items-center text-white font-bold border-4 border-white p-2 rounded-lg bg-blue-500 hover:bg-blue-700 transition">
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

                {/* Filters and Actions */}
                {/* <div className="flex flex-wrap gap-4 mb-4 p-4  bg-blue-400 rounded-sm shadow-sm">
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Filter by Month:</label>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="border rounded p-2 cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Filter by Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="border rounded p-2 cursor-pointer"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                        >
                            Print
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 cursor-pointer"
                        >
                            Download Excel
                        </button>
                    </div>
                </div> */}

                {/* Inventory Table */}
                {inventory ? (
                    filteredRevisions.length > 0 ? (
                        <div className="overflow-x-auto ">
                            <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden overflow-x-auto overflow-y-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Product Name</th>
                                            <th className="px-6 py-3 text-center">Previous Stock</th>
                                            <th className="px-6 py-3 text-center">Quantity Added</th>
                                            <th className="px-6 py-3 text-center">New Stock</th>
                                            <th className="px-6 py-3 text-center">Revised From</th>
                                            <th className="px-6 py-3 text-center">Revised Date</th>
                                        </tr>
                                    </thead>

                                    <tbody className="text-gray-800">
                                        {filteredRevisions.map((revision, index) =>
                                            revision.products.map((product, subIndex) => (
                                                <tr
                                                    key={`${index}-${subIndex}`}
                                                    className={`border border-gray-300 ${((index + subIndex) % 2 === 0 ? "bg-blue-100" : "bg-blue-50")} hover:bg-blue-200 transition-all duration-200`}
                                                >
                                                    <td className="px-6 py-4 text-left font-medium">
                                                        {inventory.products.find(p => p.productId._id === product.productId)?.productId?.title || "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">{product.previousStock}</td>
                                                    <td className="px-6 py-4 text-center">{product.quantityAdded}</td>
                                                    <td className="px-6 py-4 text-center">{product.newStock}</td>
                                                    <td className="px-6 py-4 text-center">{revision.revisedBy.username}</td>
                                                    <td className="px-6 py-4 text-center">{new Date(revision.revisedDate).toLocaleString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                    <tfoot>
                                        <tr className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold">
                                            <td className="px-6 py-4 text-left">Total Stock</td>
                                            <td className="px-6 py-4 text-center">{inventory.remainingStock || 0}</td>
                                            <td className="px-6 py-4 text-right">Total Dispatched: {inventory.dispatchedStock || 0}</td>
                                            <td colSpan="3"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 font-semibold mt-5">
                            {selectedMonth || selectedDate ? "No stock history found for the selected filter." : "No stock history available."}
                        </p>
                    )
                ) : (
                    <p className="text-center text-gray-600 font-semibold mt-5">Loading inventory...</p>
                )}
            </div>
        </div>
    );
};

export default StockHistory;