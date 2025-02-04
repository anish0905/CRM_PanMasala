import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AdminSidebar from '../AdminSidebar';
import RightSideDrawer from '../../../components/RightSideDrawer';
import AdminSideBarModal from '../AdminSideBarModal';
import Swal from 'sweetalert2';

const AddInventory = () => {
    const email = localStorage.getItem("email");
    const currentUserId = localStorage.getItem("userId");

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [revisedDate, setRevisedDate] = useState(new Date());
    const [inventoryItems, setInventoryItems] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const BASE_URL = import.meta.env.VITE_API_URL;

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

        if (editingIndex !== null) {
            // Edit existing item
            const updatedItems = [...inventoryItems];
            updatedItems[editingIndex] = {
                productId: selectedProduct,
                productName: productDetails.title,
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

        if (inventoryItems.length === 0) {
            Swal.fire("Error", "Please add at least one product!", "error");
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
            await axios.post(`${BASE_URL}/api/subAdmin/inventory/add-inventory`, {
                userId: currentUserId,
                revisedBy: currentUserId || '',

                products: inventoryItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    revisedBy: item.revisedBy,
                    revisedDate: item.revisedDate.toISOString().split('T')[0]
                }))
            });

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
                <AdminSidebar />
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
                        <AdminSideBarModal />
                    </div>
                </div>

                <div className="bg-gray-100 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Inventory Details</h2>

                    {message && (
                        <div className={`mb-4 p-3 rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex justify-center items-center content-center flex-wrap gap-4 mb-4">
                        <select
                            value={selectedProduct}
                            onChange={(e) => handleProductSelection(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md flex-grow"
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
                            className="p-2 border border-gray-300 rounded-md w-32"
                            placeholder="Quantity"
                            min="1"
                        />

                        <button
                            onClick={handleAddProduct}
                            className={`text-white px-4 py-2 rounded-md transition ${editingIndex !== null ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {editingIndex !== null ? "Update" : "Add Product"}
                        </button>
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

                    <h3 className="text-lg font-semibold mt-6">Inventory List</h3>
                    {inventoryItems.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                            {inventoryItems.map((item, index) => (
                                <li key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow">
                                    <span>{item.productName} - {item.quantity}</span>
                                    <div className='flex justify-center items-center content-center flex-wrap gap-2'>
                                        <button
                                            onClick={() => handleEditProduct(index)}
                                            className="bg-yellow-600 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleRemoveProduct(index)}
                                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No products added yet.</p>
                    )}

                    <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-2 px-4 mt-6 rounded-md hover:bg-green-700 transition">
                        Submit Inventory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddInventory;
