import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker'; // Assuming you're using this for the date picker
import 'react-datepicker/dist/react-datepicker.css';
import DistributorBarModal from '../Distributer/sidebar/DistributorBarModal';
import SuperStockistBarModal from '../SuperStockists/SSsidebar/SuperStockistBarModal';
import CNFSideBarModal from '../CNF/CNFSideBarModal';
import DistributorSidebar from '../Distributer/sidebar/DistributorSidebar';
import SuperStockistSidebar from '../SuperStockists/SSsidebar/SuperStockistSidebar';
import CNFSidebar from '../CNF/CNFSidebar';
import RightSideDrawer from '../../Component/SMS_Drawer';

export const RequirestInventory = () => {
    const email = localStorage.getItem("email");
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [deadline, setdeadline] = useState(new Date());
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [requiest, setRequiest] = useState();
    const [requestMessage, setRequestMessage] = useState('');  // Added state for request message
    const [inventoryItems, setInventoryItems] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    let sender = localStorage.getItem("userId");
    const { role } = useParams();

    let recipient;

    if (role === "cnf") {
        recipient = localStorage.getItem("subAdmin");
    }
    if (role === "superstockist") {
        recipient = localStorage.getItem("cnfId");
    }
    if (role === "distributor") {
        recipient = localStorage.getItem("superstockist");
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/e-commerce/`);
            setProducts(response.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleProductSelection = (productId) => {
        setSelectedProduct(productId);
    };

    const handleDateChange = (date) => {
        setdeadline(date);
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

        if (editingIndex !== null) {
            // Edit existing item
            const updatedItems = [...inventoryItems];
            updatedItems[editingIndex] = {
                productId: selectedProduct,
                productName: productDetails.title,
                quantity,
                deadline
            };
            setInventoryItems(updatedItems);
            setEditingIndex(null);
        } else {
            // Add new item
            setInventoryItems([...inventoryItems, {
                productId: selectedProduct,
                productName: productDetails.title,
                quantity,
                deadline
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

        if (inventoryItems.length === 0) {
            Swal.fire("Error", "Please add at least one product!", "error");
            return;
        }

        

        // Assuming you're sending data somewhere, e.g., to an API
        const data = {
            inventoryItems,
            sender,
            requestMessage,
            recipient,
            deadline
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/${role}/inventory/send-required-for-inventory`, data);
            if (response.status === 200) {
                Swal.fire("Success", "Your request has been submitted!", "success");
                // Reset form fields after successful submission
                setInventoryItems([]);
                setRequestMessage('');
            }
        } catch (error) {
            Swal.fire("Error", "Failed to submit request. Please try again later.", "error");
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
                    Request for Inventory
                    </h1>
                    <RightSideDrawer />
                    {email && (
                        <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition">
                            {email}
                        </div>
                    )}
                    <div className="lg:hidden block">
                        {
                            role === "cnf" ? (
                                <CNFSideBarModal />
                            ) : role === "superstockist" ? (
                                <SuperStockistBarModal />
                            ) : (
                                <DistributorBarModal />
                            )
                        }
                    </div>
                </div>

                <div className="bg-gray-100 rounded-lg shadow-lg p-8 ">
                    {/* Message Alert */}
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <DatePicker
                            selected={deadline}
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

                    {/* Request Message Text Area */}
                    <div className="mt-4">
                        <label className="block  text-gray-700 mb-1 text-lg font-semibold mt-6"> Message</label>
                        <textarea
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Write your request or registration details here..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-500 text-white py-3 px-4 mt-6 rounded-md shadow-md hover:bg-green-600 transition"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
