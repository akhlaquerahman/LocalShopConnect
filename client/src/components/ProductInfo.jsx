//src/components/ProductInfo.jsx
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

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

// ✅ Added reviews prop
function ProductInfo({ product, onAddToCart, onBuyNow, reviews = [] }) {
  // Calculate rating and review count from the reviews prop
  const avgRating = calculateAverageRating(reviews);
  const reviewCount = reviews.length;

  return (
    <>
      <img
        src={product.image}
        alt={product.name || product.title}
        className="img-fluid rounded shadow-sm"
        style={{ maxHeight: '500px', objectFit: 'cover' }}
      />
      {/* Star Rating */}
      <div className="mt-3 fs-5">
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
      <h2 className="mb-3 mt-3">{product.name || product.title}</h2>
      <p className="text-muted small mb-2">{product.productType}</p>
      
      <p className="text-muted lead">{product.description}</p>
      <p className="text-muted small mb-2"><b>{product.category} </b></p>
      <p className="text-muted lead"><i className="fa-solid fa-location-dot"></i> {product.city}</p>
      <div className="d-flex align-items-center mb-4">
        <h4 className="text-success mb-0">₹{product.price?.toLocaleString()}</h4>
        {product.originalPrice && (
          <>
            <span className="text-decoration-line-through text-muted ms-3">
              ₹{product.originalPrice.toLocaleString()}
            </span>
            <span className="badge bg-danger ms-3">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          </>
        )}
      </div>

      <button onClick={onBuyNow} className="btn btn-warning btn-lg px-4">Buy Now</button>
      <button className="btn btn-outline-dark btn-lg px-4 ms-2" onClick={onAddToCart}>
        Add to Cart
      </button>
    </>
  );
}

export default ProductInfo;