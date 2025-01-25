import React, { useState, useEffect } from "react";
import ProductItem from "../ProductItem/ProductItem";

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/e-commerce_product");
        const data = await response.json();
        setProducts(data.products);
        console.log("Fetched products:", data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Top PanMasala Near You
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductItem
            key={product._id}
            imgSrc={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDisplay;
