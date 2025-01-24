import React, { useEffect, useState } from "react";
import axios from "axios"; // Make sure axios is imported
import PropTypes from "prop-types";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { bagActions } from "../../store/bagSlice";
import { Snackbar, Alert } from "@mui/material";
import Navbar1 from "../Navbar/Navbar1";

export function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const BASE_URL = import.meta.env.VITE_API_URL;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/producteomm/`);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredProducts(products); // Reset to all products if query is empty
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddToCart = (product) => {
    dispatch(bagActions.addToBag({ data: product, quantity: 1 }));
    setSnackbar({
      open: true,
      message: `${product.title} added to cart!`,
      severity: "success",
    });
  };

  return (
    <div className="relative w-full overflow-hidden p-4 bg-gold-200">
      <div className="lg:mb-40 mb-60">
        <Navbar1 onSearch={handleSearch} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:px-[5%]">
        {filteredProducts &&
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border-2 border-[#C8A357] shadow-lg overflow-hidden hover:border-yellow-500 transition-transform duration-300 transform hover:scale-105 cursor-pointer rounded-md"
            >
              <div className="overflow-hidden p-4">
                <img
                  src={`${BASE_URL}/uploads/${product.image}`}
                  alt={product.title}
                  className="w-full object-contain h-64 rounded-md"
                  
                />
              </div>
              <div className="p-4 flex flex-col justify-between text-[#C8A357] text-center ">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-2xl w-[90%] truncate">{product.title}</p>
                  <CiHeart className="hover:text-red-500 text-2xl cursor-pointer" />
                </div>
                <p className=" mb-2 text-xl line-clamp-2">{product.description}</p>
                <p className="mb-4 font-bold text-lg">₹ {product.price.toFixed(2)}</p>
                <button
                  className="border-2 border-[#C8A357] py-2 px-4 text-[#C8A357] hover:border-none hover:bg-yellow-500 hover:text-white transition duration-300 flex justify-center items-center gap-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click event from triggering the parent div
                    handleAddToCart(product);
                  }}
                >
                  <IoCartOutline className="text-xl" />
                  <p>Add to Cart</p>
                </button>
              </div>
            </div>
          ))}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

Product.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};
