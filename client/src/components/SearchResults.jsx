// client/src/components/SearchResults.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt } from "react-icons/fa";
import { CartContext } from '../context/CartContext';

const API_URL = process.env.REACT_APP_API_URL;

// Function to render the star rating based on the rating value.
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    
    // Add empty stars to make a total of 5
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
    }
    
    return stars;
};

// Function to calculate the average rating from an array of reviews.
const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
};

// The main SearchResults component
const SearchResults = () => {
    // State variables for managing products, loading state, error messages, and a temporary message for user feedback.
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState("");
    
    // Hook to get the current URL search parameters
    const location = useLocation();
    
    // Use CartContext to get the addToCart function
    const { addToCart } = useContext(CartContext); 

    // Effect hook to fetch search results and their corresponding reviews whenever the URL's search parameters change.
    useEffect(() => {
        const fetchSearchResultsAndReviews = async () => {
            setLoading(true);
            setError('');
            const params = new URLSearchParams(location.search);
            const productType = params.get('type');

            if (!productType) {
                setLoading(false);
                setError('No search term provided.');
                return;
            }

            try {
                // First, fetch the products based on the search term
                const productsRes = await axios.get(`${API_URL}/api/products/search?type=${productType}`);
                const initialProducts = productsRes.data;

                // Then, fetch reviews for each product concurrently
                const productsWithReviews = await Promise.all(
                    initialProducts.map(async (product) => {
                        try {
                            const reviewsRes = await axios.get(`${API_URL}/api/reviews/${product._id}`);
                            return {
                                ...product,
                                reviews: reviewsRes.data || []
                            };
                        } catch (reviewError) {
                            console.error(`Error fetching reviews for product ${product._id}:`, reviewError);
                            return {
                                ...product,
                                reviews: []
                            };
                        }
                    })
                );
                setProducts(productsWithReviews);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]);
                setError(err.response?.data?.msg || 'Error fetching search results.');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResultsAndReviews();
    }, [location.search]); // The dependency array ensures this effect runs only when location.search changes.

    // A function to handle the "Add to Cart" button click.
    const handleClick = (product) => {
        addToCart({
            ...product,
            quantity: 1, 
            timestamp: new Date().toISOString(),
        });
        setMessage(`${product.title} added to cart!`);
        setTimeout(() => setMessage(""), 2000);
    };

    // Render a loading spinner if the data is being fetched.
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    // Render an error message if there was an issue fetching data.
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="container pt-5">
            {message && <div className="alert alert-success mt-3">{message}</div>}
            
            <h2 className="mb-4">Search Results for "{new URLSearchParams(location.search).get('type')}"</h2>
            
            {products.length === 0 ? (
                <p>No products found matching your search.</p>
            ) : (
                <div className="row">
                    {products.map(product => {
                        const avgRating = calculateAverageRating(product.reviews);
                        const reviewCount = product.reviews?.length || 0;
                        
                        return (
                            <div className="col-md-3 mb-4" key={product._id}>
                                <div className="card h-100 shadow-sm">
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={product.image}
                                            className="card-img-top"
                                            alt={product.title}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    </Link>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title">{product.title}</h6>
                                        <p className="card-text small text-muted mb-2 text-start">
                                            <b>{product.productType}</b>
                                        </p>
                                        
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
                                        
                                        <p className="card-text small text-muted mb-3 text-start">
                                            <FaMapMarkerAlt className="me-1" /> {product.city}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center mt-auto mb-2">
                                            <span className="text-success fw-bold">₹{product.price}</span>
                                            <span className="text-decoration-line-through text-muted small">
                                                ₹{product.originalPrice}
                                            </span>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <Link to={`/product/${product._id}`} className="btn btn-outline-dark">
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
            )}
        </div>
    );
};

export default SearchResults;
