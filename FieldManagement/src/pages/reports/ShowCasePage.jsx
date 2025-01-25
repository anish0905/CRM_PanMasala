import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import AddReview from "./AddReview";
import { useNavigate } from "react-router-dom";
import { PreviewComponent } from "./PreviewComponet";
import Swal from "sweetalert2";

const ShowCasePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const email = localStorage.getItem("email");
  const URI = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URI}/api/e-commerce_product/`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredProducts = products.filter((product) =>
    [product.title, product.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowPreviewModal(false);
    setSelectedProduct(null);
    setPreviewData(null);
  };

  const openPreviewModal = (data, product) => {
    setPreviewData(data);
    setSelectedProduct(product);
    setShowPreviewModal(true);
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("myData");
    window.location.reload();
  };

  const handleVendorRegistration = () => {
    const reviewedProduct = JSON.parse(localStorage.getItem("myData") || "[]");
    if (reviewedProduct.length === 0) {
      Swal.fire({
        text: "Are you sure you want to proceed without testing any product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Proceed",
        cancelButtonText: "No, Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Add-New-Vendor");
        }
      });
    } else {
      navigate("/Add-New-Vendor");
    }
  };

  const handleVendorNotInterested = () => {
    const reviewedProduct = JSON.parse(localStorage.getItem("myData") || "[]");
    if (reviewedProduct.length === 0) {
      Swal.fire({
        text: "Are you sure you want to proceed without testing any product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Mark",
        cancelButtonText: "No, Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/vendor-not-intrested");
        }
      });
    } else {
      navigate("/vendor-not-intrested");
    }
  };

  const calculateAverage = (ratings) => {
    if (!ratings || ratings.length === 0) return null;
    const total = ratings.reduce((sum, { rating }) => sum + rating, 0);
    return total / ratings.length;
  };

  return (
    <div className="flex ">
      <div className="h-screen lg:fixed top-0 left-0 lg:w-64 ">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 lg:ml-80 overflow-y-auto">
        <header className="flex items-center justify-between bg-blue-200 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold">Our Products</h1>
          <div className="flex justify-center items-center gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={resetLocalStorage}
            >
              Reset
            </button>
            <span className="hidden sm:block bg-blue-700 text-white px-4 py-2 rounded">
              {email}
            </span>
          </div>
        </header>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-full p-3 border rounded-lg mb-6"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const reviewedProduct = JSON.parse(
              localStorage.getItem("myData") || "[]"
            ).find((data) => data.Product._id === product._id);

            const fragranceAvg = calculateAverage(
              reviewedProduct?.review?.data?.fragrance
            );
            const tasteAndFlavorAvg = calculateAverage(
              reviewedProduct?.review?.data?.tasteAndFlavor
            );
            const kickAndHighAvg = calculateAverage(
              reviewedProduct?.review?.data?.reviews
            );

            const combinedAverage =
              [fragranceAvg, tasteAndFlavorAvg, kickAndHighAvg]
                .filter((avg) => avg !== null)
                .reduce((sum, avg) => sum + avg, 0) /
              [fragranceAvg, tasteAndFlavorAvg, kickAndHighAvg].filter(
                (avg) => avg !== null
              ).length;

            const formattedAverage = combinedAverage
              ? combinedAverage.toFixed(1)
              : "N/A";

            return (
              <div
                key={product._id}
                className="bg-white shadow rounded-lg overflow-hidden card flex flex-col"
              >
                <img
                  src={`${URI}/uploads/${product.image}`}
                  alt={product.title}
                  className="w-full h-48 object-contain p-4"
                />
                <div className="p-4 text-center flex-1">
                  <h2 className="text-lg font-bold">{product.title}</h2>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <p className="text-gray-800 font-bold mt-2">
                    ₹{product.price}
                  </p>
                </div>

                {/* Button section */}
                <div className="flex flex-col gap-4 p-3">
                  {reviewedProduct && (
                    <p className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold mb-2 w-full text-center text-sm">
                      Average Rating:{" "}
                      <span className="text-blue-600 font-bold">
                        {formattedAverage}
                      </span>
                    </p>
                  )}
                  {reviewedProduct ? (
                    <>
                      <button
                        onClick={() =>
                          openPreviewModal(reviewedProduct, product)
                        }
                        className="w-full bg-yellow-400 text-black p-3 font-semibold rounded-lg hover:bg-yellow-500 transition-all"
                      >
                        Preview
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openModal(product)}
                      className="w-full bg-blue-500 font-semibold text-white p-3 hover:bg-blue-700"
                    >
                      Test
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="flex justify-center mt-8 space-x-4">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={handleVendorRegistration}
          >
            Register the Vendor
          </button>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={handleVendorNotInterested}
          >
            Vendor Not Interested
          </button>
        </footer>

        {showModal && (
          <Modal onClose={closeModal}>
            <AddReview
              selectedProduct={selectedProduct}
              setShowModal={closeModal}
            />
          </Modal>
        )}

        {showPreviewModal && previewData && (
          <Modal onClose={closeModal}>
            <PreviewComponent
              selectPreviewData={previewData}
              selectedProduct={selectedProduct}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg max-w-lg w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-slate-600 w-8 h-8 text-center flex justify-center items-center rounded-full text-3xl text-gray-100"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default ShowCasePage;
