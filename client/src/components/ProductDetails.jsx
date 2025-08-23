// src/components/ProductDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { AdminAuthContext } from '../context/AdminAuthContext';
import ProductInfo from './ProductInfo';
import ReviewForm from './ReviewForm';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL;

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, token, loading: userLoading } = useContext(UserContext);
  const { admin, loading: adminLoading } = useContext(AdminAuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState('');

  // ✅ New: Combine loading states for a single, reliable check
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const productRes = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(productRes.data);
        const reviewRes = await axios.get(`${API_URL}/api/reviews/${id}`);
        setReviews(reviewRes.data || []);
      } catch (error) {
        console.error("❌ Error fetching product or reviews:", error);
      } finally {
        // ✅ New: Mark the component as ready after all data is fetched
        setIsReady(true);
      }
    };

    // ✅ New: Wait for user and admin contexts to finish loading
    if (!userLoading && !adminLoading) {
      fetchProductAndReviews();
    }
  }, [id, userLoading, adminLoading]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  const handleBuyNowFromDetails = () => {
    if (!product) {
      alert("Product details are not loaded yet.");
      return;
    }
    if (!user || !user.addresses || user.addresses.length === 0) {
      alert("Please log in and add a shipping address to your profile before buying.");
      navigate("/profile");
      return;
    }

    const singleProductData = {
      items: [{
        _id: product._id,
        productId: product._id,
        productType: product.productType,
        title: product.name || product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      }],
      total: product.price,
    };

    navigate("/checkout", {
      state: {
        cartData: singleProductData,
        fromBuyNow: true,
        timestamp: Date.now()
      }
    });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Product deleted successfully");
        navigate('/');
      } catch (error) {
        console.error("❌ Delete error:", error);
        alert("❌ Failed to delete product. You might not be the creator.");
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }
    if (rating > 0 && comment.trim()) {
      try {
        if (editingReview) {
          const res = await axios.put(
            `${API_URL}/api/reviews/${editingReview._id}`,
            { rating, comment },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReviews((prev) =>
            prev.map((r) => (r._id === editingReview._id ? res.data.review : r))
          );
          setEditingReview(null);
          setMessage('Review updated successfully! 🎉');
        } else {
          const res = await axios.post(
            `${API_URL}/api/reviews/${id}`,
            { rating, comment },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const newReview = {
            ...res.data.review,
            name: user.name,
            userId: user._id,
          };
          setReviews((prev) => [...prev, newReview]);
          setMessage('Review submitted successfully! 🎉');
        }
        setTimeout(() => {
        setMessage('');
      }, 3000);
        
        setRating(0);
        setComment('');
        setHover(0);
      } catch (error) {
        console.error("❌ Error submitting review:", error.response?.data || error.message);
        alert(`❌ Failed to submit review: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`${API_URL}/api/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        alert("✅ Review deleted successfully");
      } catch (err) {
        console.error("❌ Failed to delete review", err);
        alert(`❌ Failed to delete review: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
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


  // ✅ NEW: Use a single readiness check to handle all loading states
  if (!isReady || userLoading || adminLoading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!product) return <h2 className="text-center mt-5 text-danger">Product not found</h2>;

  // Check if admin is logged in AND is the creator of the product
  const isProductCreator = admin && product && admin._id === product.sellerId;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-end mb-3">
        <div>
          {isProductCreator && (
            <>
              <Link to={`/admin/edit/${product._id}`} className="btn btn-warning me-2">
                ✏️ Edit Product
              </Link>
              <button className="btn btn-danger" onClick={() => handleDeleteProduct(product._id)}>
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <ProductInfo
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNowFromDetails}
            reviews={reviews} // ✅ Add this line
          />
        </div>
        <div className="col-md-6">
          <h4 className="mb-3">Reviews</h4>
          {message && (
          <div className="alert alert-success text-center" role="alert">
            {message}
          </div>
        )}
          <ReviewForm
            rating={rating}
            hover={hover}
            comment={comment}
            setRating={setRating}
            setHover={setHover}
            setComment={setComment}
            onSubmit={handleSubmitReview}
            isEditing={!!editingReview}
          />
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((review) => (
            <div key={review._id} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <strong className="me-2">{review.name}</strong>
                  <div className="d-flex">
                    {renderStars(review.rating)}
                    <small className="text-muted ms-2">({review.rating})</small>
                  </div>
                </div>
                <small className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
              <p className="mb-2">{review.comment}</p>
              {user && user._id === review.user?._id && (
                <div className="mt-2">
                  <button 
                    onClick={() => handleEditReview(review)} 
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(review._id)} 
                    className="btn btn-sm btn-outline-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;