// src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  // अगर प्रोडक्ट प्रॉप्स नहीं मिला, तो कुछ भी रेंडर नहीं होगा
  if (!product) {
    return null;
  }

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3">
      <img
        src={product.image}
        className="card-img-top rounded-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{product.name}</h5>
        <p className="card-text text-muted mb-2">
          {product.description.length > 50 
            ? product.description.substring(0, 50) + "..." 
            : product.description}
        </p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="h5 mb-0 text-primary">₹{product.price}</span>
          <Link
            to={`/product/${product.id}`}
            className="btn btn-warning btn-sm rounded-pill"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;