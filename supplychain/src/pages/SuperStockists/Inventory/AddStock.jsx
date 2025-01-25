import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../../constants';

export const AddStock = ({ onClose, fetchInventory }) => {
    const currentUserId = localStorage.getItem('currentUserId');

    const [formData, setFormData] = useState({
        userId: currentUserId || '',
        productId: '',
        productName: '',
        receivedStock: '',
        issuedBy: currentUserId || '',
    });

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch users and products on component mount
    useEffect(() => {
        fetchUsers();
        fetchProducts();
    }, []);

    // Fetch available users
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/administrators/users`);
            const userList = response.data.map((user) => ({
                _id: user._id,
                username: user.username,
            }));
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to load users. Please try again.', 'error');
        }
    };

    // Fetch available products
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/producteomm`);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            Swal.fire('Error', 'Failed to load products. Please try again.', 'error');
        }
    };

    // Handle form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle product selection
    const handleProductSelection = (selectedProductId) => {
        const selectedProduct = products.find((product) => product._id === selectedProductId);
        setFormData((prev) => ({
            ...prev,
            productId: selectedProductId,
            productName: selectedProduct ? selectedProduct.title : '',
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.productId || !formData.receivedStock || !formData.issuedBy) {
            Swal.fire('Error', 'Please fill in all required fields.', 'error');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/superstockistinventory/addInventory`, formData);
            fetchInventory();
            Swal.fire('Success', response.data.message || 'Inventory added successfully!', 'success');
            onClose();
        } catch (error) {
            console.error('Error adding inventory:', error);
            Swal.fire('Error', 'Failed to add inventory. Please try again.', 'error');
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-6 w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Issued By */}
                <div className="flex flex-col">
                    <label htmlFor="issuedBy" className="text-sm font-medium text-gray-700">
                        Issued By
                    </label>
                    <select
                        id="issuedBy"
                        name="issuedBy"
                        value={formData.issuedBy}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Selection */}
                <div className="flex flex-col">
                    <label htmlFor="productId" className="text-sm font-medium text-gray-700">
                        Received Product
                    </label>
                    <select
                        id="productId"
                        name="productId"
                        value={formData.productId}
                        onChange={(e) => handleProductSelection(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product._id} value={product._id}>
                                {product.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Received Stock */}
                <div className="flex flex-col">
                    <label htmlFor="receivedStock" className="text-sm font-medium text-gray-700">
                        Received Stock
                    </label>
                    <input
                        id="receivedStock"
                        name="receivedStock"
                        type="number"
                        value={formData.receivedStock}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        min="1"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                    Add Stock
                </button>
            </form>
        </div>
    );
};
