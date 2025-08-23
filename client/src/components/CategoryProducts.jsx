import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const API_URL = process.env.REACT_APP_API_URL;

function CategoryProducts() {
  const [message, setMessage] = useState("");  
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/products/category/${categoryName}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Products could not be loaded. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryName]);

  const handleClick = (product) => {
    addToCart({
      ...product,
      timestamp: new Date().toISOString(),
    });
    setMessage(`${product.title} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
    }
    
    return stars;
  };

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5">
        <h2 className="text-danger">Error: {error}</h2>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container text-center my-5">
        <h2>No products found for "{categoryName.replace(/-/g, ' ')}"</h2>
        <p className="text-muted">Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-capitalize">
        {categoryName.replace(/-/g, ' ')} Products
      </h2>
      
      {message && (
        <div className="alert alert-success text-center" role="alert">
          {message}
        </div>
      )}
      
      <div className="row g-4">
        {products.map((product) => {
          const avgRating = calculateAverageRating(product.reviews);
          const reviewCount = product.reviews?.length || 0;
          
          return (
            <div className="col-md-3" key={product._id}>
              <div className="card h-100 shadow-sm">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>
                <div className="card-body">
                  <h6 className="card-title">{product.title}</h6>
                  <p className="card-text small text-muted mb-2">
                    <b>{product.productType}</b>
                  </p>
                  
                  {/* Star Rating */}
                  <div className="mb-2">
                    {reviewCount > 0 ? (
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          {renderStars(avgRating)}
                        </div>
                        <small className="text-muted">({reviewCount})</small>
                      </div>
                    ) : (
                      <small className="text-muted">No ratings yet</small>
                    )}
                  </div>
                  
                  <p className="card-text small text-muted mb-3">
                    <FaMapMarkerAlt className="me-1" /> {product.city}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-success fw-bold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-decoration-line-through text-muted small">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="d-grid gap-2">
                    <Link to={`/product/${product._id}`} className="btn btn-outline-success">
                      Buy Now
                    </Link>
                    <button 
                      className="btn btn-warning btn-outline-dark"
                      onClick={() => handleClick(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryProducts;