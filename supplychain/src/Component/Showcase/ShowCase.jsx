import React, { useState, useEffect } from "react";
import AdminSideBarModal from "../../pages/CNF/CNFSideBarModal";
import AdminSidebar from "../../pages/CNF/CNFSidebar";
import axios from "axios";
import SMSDrawer from "../SMS_Drawer";
import { FcSearch } from "react-icons/fc";


const ShowCase = () => {
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

  useEffect(() => {
    fetchProducts();
  }, [handleSubmit]);

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

          {email && (
            <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
              {email}
            </div>
          )}
          <div className="lg:hidden block">
            <AdminSideBarModal />
          </div>
          <div>
            <SMSDrawer />
          </div>
        </div>

        {/* Search bar */}
        <div className="my-6 relative">
          <FcSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCase;
