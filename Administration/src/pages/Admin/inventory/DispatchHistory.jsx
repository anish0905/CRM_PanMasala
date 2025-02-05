import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import AdminSidebar from "../AdminSidebar";
import RightSideDrawer from "../../../components/RightSideDrawer";
import AdminSideBarModal from "../AdminSideBarModal";
import SidebarModel from "../../SubAdmin/sidebar/SidebarModel";
import Sidebar from "../../SubAdmin/sidebar/Sidebar";

const DispatchHistory = () => {
    const email = localStorage.getItem("email");
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [inventory, setInventory] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const navigate = useNavigate();
    const { role } = useParams();

    let currentUserId = role === "admin"
        ? localStorage.getItem("userId")
        : localStorage.getItem("admin");

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/subAdmin/inventory/inventory/${currentUserId}`
            );
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
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const filteredDispatches = inventory?.dispatchedStockHistory?.filter(dispatch => {
        const dispatchDate = new Date(dispatch.transactionDate);
        if (selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            return dispatchDate.getFullYear() === parseInt(year) &&
                (dispatchDate.getMonth() + 1) === parseInt(month);
        }
        if (selectedDate) {
            const selectedDay = new Date(selectedDate);
            return isSameDay(dispatchDate, selectedDay);
        }
        return true;
    }) || [];

    const handlePrint = () => {
        if (!filteredDispatches.length) {
            alert("No dispatch history available to print.");
            return;
        }
    
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Dispatch History Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h2 { text-align: center; margin-bottom: 20px; }
                        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2>Dispatch History Report</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Issued To</th>
                                <th>Issued By</th>
                                <th>Transaction Date</th>
                                <th>Received Date</th>
                                <th>Product Name</th>
                                <th>Quantity Dispatched</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredDispatches.map(dispatch =>
                                dispatch.products.map((product, index) => `
                                    <tr>
                                        ${index === 0 ? `
                                            <td rowspan="${dispatch.products.length}">${dispatch.orderId}</td>
                                            <td rowspan="${dispatch.products.length}">${dispatch.issuedTo?.username || "N/A"}</td>
                                            <td rowspan="${dispatch.products.length}">${dispatch.issuedBy?.username || "N/A"}</td>
                                            <td rowspan="${dispatch.products.length}">${dispatch.transactionDate ? new Date(dispatch.transactionDate).toLocaleDateString() : "N/A"}</td>
                                            <td rowspan="${dispatch.products.length}">${dispatch.receivedDate ? new Date(dispatch.receivedDate).toLocaleDateString() : "N/A"}</td>
                                        ` : ''}
                                        <td>${inventory.products.find(p => p.productId._id === product.productId)?.productId?.title || "N/A"}</td>
                                        <td>${product.quantityDispatched}</td>
                                        ${index === 0 ? `
                                            <td rowspan="${dispatch.products.length}" style="background-color: ${dispatch.status === "dispatched" ? "#d4edda" : "#fff3cd"};">
                                                ${dispatch.status}
                                            </td>
                                        ` : ''}
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
        
        // Headers (Same as Print)
        data.push([
            "Order ID", 
            "Issued To", 
            "Issued By", 
            "Transaction Date", 
            "Received Date", 
            "Product Name", 
            "Quantity Dispatched", 
            "Status"
        ]);
    
        // Rows - Apply row spanning logic
        filteredDispatches.forEach(dispatch => {
            dispatch.products.forEach((product, subIndex) => {
                const productName = inventory.products.find(p => p.productId._id === product.productId)?.productId?.title || "N/A";
                const row = [];
    
                if (subIndex === 0) {
                    row.push(
                        dispatch.orderId,
                        dispatch.issuedTo?.username || "N/A",
                        dispatch.issuedBy?.username || "N/A",
                        dispatch.transactionDate ? new Date(dispatch.transactionDate).toLocaleDateString() : "N/A",
                        dispatch.receivedDate ? new Date(dispatch.receivedDate).toLocaleDateString() : "N/A"
                    );
                } else {
                    // Leave these columns empty for merged rows
                    row.push("", "", "", "", "");
                }
    
                row.push(productName, product.quantityDispatched);
    
                if (subIndex === 0) {
                    row.push(dispatch.status);
                } else {
                    row.push("");
                }
    
                data.push(row);
            });
        });
    
        // Create a worksheet & export file
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Apply Merges (For row-spanning effect)
        const merges = [];
        let rowIndex = 1; // Start from data row (index 1, because index 0 is the header)
    
        filteredDispatches.forEach(dispatch => {
            if (dispatch.products.length > 1) {
                merges.push(
                    { s: { r: rowIndex, c: 0 }, e: { r: rowIndex + dispatch.products.length - 1, c: 0 } }, // Order ID
                    { s: { r: rowIndex, c: 1 }, e: { r: rowIndex + dispatch.products.length - 1, c: 1 } }, // Issued To
                    { s: { r: rowIndex, c: 2 }, e: { r: rowIndex + dispatch.products.length - 1, c: 2 } }, // Issued By
                    { s: { r: rowIndex, c: 3 }, e: { r: rowIndex + dispatch.products.length - 1, c: 3 } }, // Transaction Date
                    { s: { r: rowIndex, c: 4 }, e: { r: rowIndex + dispatch.products.length - 1, c: 4 } }, // Received Date
                    { s: { r: rowIndex, c: 7 }, e: { r: rowIndex + dispatch.products.length - 1, c: 7 } }  // Status
                );
            }
            rowIndex += dispatch.products.length;
        });
    
        ws["!merges"] = merges; // Apply merges
    
        // Create workbook & save
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dispatch History");
        XLSX.writeFile(wb, "DispatchHistory.xlsx");
    };
    
    

    return (
        <div className="flex gap-6 min-h-screen w-full">
            {/* Sidebar */}
            <div className="min-h-screen lg:block hidden">
                {role === "admin" ? <AdminSidebar /> : <Sidebar />}
            </div>

            {/* Main Content */}
            <div className="lg:ml-80 w-full md:p-5 p-4">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-md shadow p-4 flex flex-wrap gap-4 items-center justify-between mb-6">
                    <h1 className="text-lg lg:text-xl font-bold text-white">
                        Dispatch History
                    </h1>
                    <RightSideDrawer />
                    <div className="flex justify-between items-center content-center gap-4">
                        {email && (
                            <div className="hidden sm:flex items-center text-white font-bold border-4 border-white p-2 rounded-lg bg-blue-500 hover:bg-blue-700 transition">
                                {email}
                            </div>
                        )}
                        <div className="lg:hidden block">
                            {role === "admin" ? <AdminSideBarModal /> : <SidebarModel />}
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-wrap gap-4 mb-4 p-4 bg-blue-400 rounded-sm shadow-sm">
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
                </div>

                {/* Dispatch History Table */}
                {inventory ? (
                    filteredDispatches.length > 0 ? (
                        <div className="overflow-x-auto ">
                            <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden overflow-x-auto overflow-y-auto">
                                <table className="w-full table-auto border-collapse">
                                    {/* Table Header */}
                                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 text-center">Order ID</th>
                                            <th className="px-6 py-3 text-center">Issued To</th>
                                            <th className="px-6 py-3 text-center">Issued By</th>
                                            <th className="px-6 py-3 text-center">Transaction Date</th>
                                            <th className="px-6 py-3 text-center">Received Date</th>
                                            <th className="px-6 py-3 text-left">Product Name</th>
                                            <th className="px-6 py-3 text-center">Quantity Dispatched</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody className="text-gray-800">
                                        {filteredDispatches.map((dispatch, index) =>
                                            dispatch.products.map((product, subIndex) => (
                                                <tr
                                                    key={`${index}-${subIndex}`}
                                                    className={`border border-gray-300 ${index % 2 === 0 ? "bg-blue-100" : "bg-blue-50"}  transition-all duration-200`}
                                                >
                                                    {/* Render Order ID, Issued To, Issued By, Transaction Date, and Received Date only in the first row */}
                                                    {subIndex === 0 && (
                                                        <>
                                                            <td rowSpan={dispatch.products.length} className="px-6 py-4 text-center">
                                                                {dispatch.orderId}
                                                            </td>
                                                            <td rowSpan={dispatch.products.length} className="px-6 py-4 text-center">
                                                                {dispatch.issuedTo?.username || "N/A"}
                                                            </td>
                                                            <td rowSpan={dispatch.products.length} className="px-6 py-4 text-center">
                                                                {dispatch.issuedBy?.username || "N/A"}
                                                            </td>
                                                            <td rowSpan={dispatch.products.length} className="px-6 py-4 text-center">
                                                                {dispatch.transactionDate ? new Date(dispatch.transactionDate).toLocaleDateString() : "N/A"}
                                                            </td>
                                                            <td rowSpan={dispatch.products.length} className="px-6 py-4 text-center">
                                                                {dispatch.receivedDate ? new Date(dispatch.receivedDate).toLocaleDateString() : "N/A"}
                                                            </td>
                                                        </>
                                                    )}

                                                    {/* Product Details */}
                                                    <td className="px-6 py-4 text-left font-medium">
                                                        {inventory.products.find(p => p.productId._id === product.productId)?.productId?.title || "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">{product.quantityDispatched}</td>

                                                    {/* Render Status only in the first row */}
                                                    {subIndex === 0 && (
                                                        <td rowSpan={dispatch.products.length} className="px-6 py-4 text-center">
                                                            <span
                                                                className={`px-2 py-1 rounded ${dispatch.status === "dispatched" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                                                                    }`}
                                                            >
                                                                {dispatch.status}
                                                            </span>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                    {/* Table Footer */}
                                    <tfoot>
                                        <tr className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold">
                                            <td className="px-6 py-4 text-left" colSpan="6">Total Dispatched</td>
                                            <td className="px-6 py-4 text-center" colSpan="2">
                                                {inventory.dispatchedStock || 0}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 font-semibold mt-5">
                            {selectedMonth || selectedDate ? "No dispatches found for the selected filter." : "No dispatch history available."}
                        </p>
                    )
                ) : (
                    <p className="text-center text-gray-600 font-semibold mt-5">Loading inventory...</p>
                )}

            </div>
        </div>
    );
};

export default DispatchHistory;