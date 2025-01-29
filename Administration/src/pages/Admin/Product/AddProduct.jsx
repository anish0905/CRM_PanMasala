import React, { useState, useEffect } from "react";
import AdminSideBarModal from "../AdminSideBarModal";
import AdminSidebar from "../AdminSidebar";
import axios from "axios";
import RightSideDrawer from "../../../components/RightSideDrawer";

const AddProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [updateProductId, setUpdateProductId] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const URI = import.meta.env.VITE_API_URL;
  const email = localStorage.getItem("email");
  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
    // Reset all states when closing the modal
    setUpdateProductId("");
    setProductName("");
    setProductDescription("");
    setPrice("");
    setImage(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URI}/api/e-commerce/`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", productName);
    formData.append("description", productDescription);
    formData.append("price", price);

    if (image) {
      formData.append("file", image); // Include file only if selected
    }

    try {
      if (updateProductId) {
        // If updating, send a PUT request
        const response = await axios.put(
          `${URI}/api/e-commerce/update/${updateProductId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Update response:", response.data); // Log response
        console.log("Product updated successfully");
      } else {
        // If adding a new product, send a POST request
        const response = await axios.post(`${URI}/api/e-commerce`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Add response:", response.data);
        console.log("Product added successfully");
      }
      handleToggleModal(); // Close the modal after submitting
      fetchProducts(); // Fetch updated products after adding or updating
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    if (productToEdit) {
      setProductName(productToEdit.title);
      setProductDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setImage(null); // Reset image, user can choose to upload new
      setUpdateProductId(productToEdit._id); // Set the ID of the product to update
      setIsModalOpen(true); // Open the modal with prefilled data
      console.log("Editing product:", productToEdit); // Log the product being edited
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${URI}/api/e-commerce/${id}`);
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [handleDelete, handleEdit, handleSubmit]);

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-6 bg-blue-100 w-full min-h-screen p-5">
      <div className=" hidden lg:block">
        <AdminSidebar />
      </div>

      <div className="lg:ml-80  font-serif w-full lg:p-10 md:p-5 ">
        <div className=" bg-[#93c5fd] rounded-md shadow p-4 flex gap-4 items-center justify-between">
          <h1 className="flex-grow text-start text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800">
            My Product
          </h1>
          <RightSideDrawer />
          <button
            onClick={handleToggleModal}
            className="text-xs font-bold border-2 border-blue-600 text-blue-600 py-1 px-3 rounded cursor-pointer sm:text-sm sm:px-2 sm:py-1 md:text-base md:px-3 md:py-2 lg:text-xl lg:px-4 lg:py-3"
          >
            Add Product
          </button>

          {email && (
            <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
              {email}
            </div>
          )}
          <div className="lg:hidden block">
            <AdminSideBarModal />
          </div>
        </div>

        {/* Search bar */}
        <div className="my-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search by product name or description"
          />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full mx-4 sm:mx-0">
              <h2 className="text-2xl font-bold mb-6">
                {updateProductId ? "Update Product" : "Add Product"}
              </h2>
              <form className=" p-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="productName"
                  >
                    Product Name:
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter product name"
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="productDescription"
                  >
                    Product Description:
                  </label>
                  <input
                    type="text"
                    id="productDescription"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price:
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter product price"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="image"
                  >
                    Product Image Upload:
                  </label>
                  <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full text-gray-700 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                  >
                    {updateProductId ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleModal}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border-2 border-blue-500 hover:border-blue-50 p-4 rounded-lg shadow-lg flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gray-50"
              >
                <img
                  src={`${URI}/uploads/${product.image}`} // Assuming image URLs are served from '/uploads' directory
                  alt={product.title}
                  className="w-full h-60 object-contain mb-4 transition-all duration-300 hover:scale-105"
                />
                <h3 className="text-lg font-bold text-center mt-2 transition-all duration-300 hover:text-blue-500">
                  {product.title}
                </h3>
                <p className="text-center text-gray-600 mb-2">
                  {product.description}
                </p>
                <p className="text-blue-500 font-semibold mt-2">
                  ₹ {product.price}
                </p>

                <div className="mt-4 flex space-x-2">
                  <button
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-all duration-300 cursor-pointer"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-all duration-300 cursor-pointer"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
