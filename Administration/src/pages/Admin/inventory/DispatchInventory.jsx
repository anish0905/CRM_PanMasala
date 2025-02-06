import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AdminSidebar from '../AdminSidebar';
import RightSideDrawer from '../../../components/RightSideDrawer';
import AdminSideBarModal from '../AdminSideBarModal';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import Sidebar from '../../SubAdmin/sidebar/Sidebar';
import SidebarModel from '../../SubAdmin/sidebar/SidebarModel';
import MyInventoryTable from './MyInventoryTable';
const DispatchInventory = () => {
    const email = localStorage.getItem("email");
    const currentUserId = localStorage.getItem("userId");
    const adminId = localStorage.getItem("admin");
    const [inventory, setInventory] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [revisedDate, setRevisedDate] = useState(new Date());
    const [inventoryItems, setInventoryItems] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [CNFs, setCNFs] = useState([]);
    const [selectedCnfId, setSelectCnfId] = useState();

    const BASE_URL = import.meta.env.VITE_API_URL;

    const { role } = useParams()

    useEffect(() => {
        fetchProducts();
        fetchCNFs();
        fetchInventory();
    }, []);

    const generateOrderId = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let orderId = "";
        for (let i = 0; i < 12; i++) {
            orderId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return orderId;
    };



    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/e-commerce/`);
            setProducts(response.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchCNFs = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/subAdmin/cnf/${currentUserId}`)

            if (!response.ok) {
                throw new Error("Failed to fetch CNFs");
            }

            else {
                const data = await response.json();
                setCNFs(data.data);
            }



        } catch (error) {
            console.error("Error fetching CNFs:", error);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/subAdmin/inventory/inventory/${adminId}`)

            setInventory(response.data.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };


    const handleProductSelection = (productId) => {
        setSelectedProduct(productId);
    };

    const handleCnfSelection = (cnfId) => {
        setSelectCnfId(cnfId);
    };


    const handleDateChange = (date) => {
        setRevisedDate(date);
    };

    const handleAddProduct = () => {
        if (!selectedProduct || !quantity) {
            Swal.fire("Error", "Please select a product and enter quantity!", "error");
            return;
        }

        const productDetails = products.find(product => product._id === selectedProduct);
        if (!productDetails) return;

        if (inventoryItems.some(item => item.productId === selectedProduct) && editingIndex === null) {
            Swal.fire("Warning", "This product is already added!", "warning");
            return;
        }

        console.log(productDetails)

        if (editingIndex !== null) {
            // Edit existing item
            const updatedItems = [...inventoryItems];
            updatedItems[editingIndex] = {
                productId: selectedProduct,
                productName: productDetails.title
                ,
                quantity,
                revisedDate
            };
            setInventoryItems(updatedItems);
            setEditingIndex(null);
        } else {
            // Add new item
            setInventoryItems([...inventoryItems, {
                productId: selectedProduct,
                productName: productDetails.title,
                quantity,
                revisedDate
            }]);
        }

        setSelectedProduct("");
        setQuantity("");
    };

    const handleEditProduct = (index) => {
        const item = inventoryItems[index];
        setSelectedProduct(item.productId);
        setQuantity(item.quantity);
        setEditingIndex(index);
    };

    const handleRemoveProduct = (index) => {
        setInventoryItems(inventoryItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');

        if (!selectedCnfId) {
            Swal.fire("Error", "Please select a CNF!", "error");
            return;
        }


        if (inventoryItems.length === 0) {
            Swal.fire("Error", "Please add at least one product!", "error");
            return;
        }

        if (!revisedDate) {
            Swal.fire("Error", "Please select a dispatch date!", "error");
            return;
        }

        

        for (const item of inventoryItems) {
            const productInStock = inventory.products.find(product => product.
                productId._id
                === item.productId);



            if (!productInStock || productInStock.quantity < item.quantity) {
                Swal.fire("Error", `Insufficient quantity of ${item.productName} in stock!`, "error");
                return; // Stop execution if stock is insufficient
            }
        }




        const orderId = generateOrderId(); // Generate Order ID
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP

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
            await axios.post(`${BASE_URL}/api/subAdmin/inventory/dispatch-inventory`, {
                userId: adminId,
                issuedTo: selectedCnfId,
                issuedBy: currentUserId,
                otp,
                orderId,
                receivedDate: revisedDate.toISOString().split('T')[0],
                products: inventoryItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    productName: item.productName,


                }))
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
                {
                    role === "admin" ? (
                        <AdminSidebar />
                    ) : (
                        <Sidebar />
                    )
                }
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
                        {
                            role === "admin" ? (
                                <AdminSideBarModal />
                            ) : (
                                <SidebarModel />
                            )
                        }
                    </div>
                </div>

                <MyInventoryTable inventory={inventory} />

                <div className="bg-gray-100 rounded-lg shadow-lg p-8 ">
                    {/* Message Alert */}
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    {/* Select CNF */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">Select CNF</h2>
                        <select
                            value={selectedCnfId}
                            onChange={(e) => handleCnfSelection(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select a CNF</option>
                            {CNFs.map(cnf => (
                                <option key={cnf._id} value={cnf._id}>
                                    {cnf.username}( {cnf.state}) ({cnf.region})
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* Add Inventory Details */}
                    <h2 className="text-xl font-bold text-gray-800 mt-6">Add Inventory Details</h2>

                    <div className="flex flex-wrap gap-4 items-center mt-4">
                        <select
                            value={selectedProduct}
                            onChange={(e) => handleProductSelection(e.target.value)}
                            className="p-3 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select a product</option>
                            {products.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.title}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="p-3 border border-gray-300 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Quantity"
                            min="1"
                        />

                        <button
                            onClick={handleAddProduct}
                            className={`text-white px-5 py-2 rounded-md shadow-md transition ${editingIndex !== null ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                            {editingIndex !== null ? "Update" : "Add Product"}
                        </button>
                    </div>

                    {/* Revised Date */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Revised Date</label>
                        <DatePicker
                            selected={revisedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Inventory List */}
                    <h3 className="text-lg font-semibold mt-6">Inventory List</h3>
                    {inventoryItems.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                            {inventoryItems.map((item, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                                    <span className="text-gray-700">{item.productName} - {item.quantity}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditProduct(index)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleRemoveProduct(index)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-2">No products added yet.</p>
                    )}

                    {/* Submit Button */}
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

}

export default DispatchInventory
