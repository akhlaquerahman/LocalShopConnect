// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import "../styles/Home.css";

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);

    axios.post(`${API_URL}/api/cart`, {
      productId: product._id,
      productType: product.productType,
      name: product.name || product.title,
      price: product.price,
      image: product.image
    })
    .then(res => console.log("✅ Added to DB:", res.data))
    .catch(err => console.error("❌ DB error:", err));
  };

  return (
    <div className="main-content">
      <CategorySection />
      <ProductGrid products={products} loading={loading} handleAddToCart={handleAddToCart} />
    </div>
  );
}

export default Home;
