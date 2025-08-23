import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function ProductGrid({ products: initialProducts, loading, handleAddToCart }) {
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch reviews for all products when component mounts or initialProducts changes
  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const fetchReviewsForProducts = async () => {
      try {
        setIsLoading(true);
        
        // Minimum 2 second loading time
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
            setHasLoaded(true);
          }
        }, 2000);

        const productsWithReviews = await Promise.all(
          initialProducts.map(async (product) => {
            const res = await axios.get(`${API_URL}/api/reviews/${product._id}`);
            return {
              ...product,
              reviews: res.data || []
            };
          })
        );
        
        if (isMounted) {
          setProducts(productsWithReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        if (isMounted) {
          setProducts(initialProducts);
        }
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId);
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    };

    if (initialProducts.length > 0) {
      fetchReviewsForProducts();
    } else {
      // If no initial products, still show loading for 2 seconds
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setIsLoading(false);
          setHasLoaded(true);
          setProducts([]);
        }
      }, 2000);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [initialProducts]);

  const handleClick = (product) => {
    handleAddToCart({
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
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    
    // Empty stars
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

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Featured Products</h2>

      {message && (
        <div className="alert alert-success text-center" role="alert">
          {message}
        </div>
      )}

      <div className="row g-4">
        {isLoading ? (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading products...</p>
          </div>
        ) : hasLoaded && products.length === 0 ? (
          <p className="text-center text-danger">No products found.</p>
        ) : (
          products.map((product) => {
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
                    {/* Star Rating */}
                    <div className="mb-2">
                      {reviewCount > 0 ? (
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            {renderStars(avgRating)}
                          </div>
                          <small className="text-muted">
                            ({reviewCount})
                          </small>
                        </div>
                      ) : (
                        <small className="text-muted">No ratings yet</small>
                      )}
                    </div>
                    
                    <h6 className="card-title">{product.title}</h6>
                    <p className="card-text small text-muted mb-2 text-start"><b>
                      {product.productType}
                    </b></p>

                    <p className="card-text small text-muted text-start">
                      <FaMapMarkerAlt className="me-1" /> {product.city}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-success fw-bold">₹{product.price}</span>
                      <span className="badge bg-danger fs-12">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                      <span className="text-decoration-line-through text-muted small">
                        ₹{product.originalPrice}
                      </span>
                      
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
          })
        )}
      </div>
    </div>
  );
}

export default ProductGrid;