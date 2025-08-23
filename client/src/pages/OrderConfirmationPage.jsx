import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom"; // ✅ Link bhi import karein
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

const API_URL = process.env.REACT_APP_API_URL;

const OrderConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useContext(CartContext);
    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const orderPlacedFlag = sessionStorage.getItem('orderPlaced');
        
        if (!user) {
            console.log("❌ User not logged in. Redirecting to login.");
            navigate('/login', { replace: true });
            return;
        }

        const placeOrder = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const { cartData, shippingAddress, fromBuyNow } = location.state || {};
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login', { replace: true });
                    return;
                }

                if (!cartData || !shippingAddress) {
                    setError("Order data is missing. Please return to the checkout page.");
                    setLoading(false);
                    return;
                }
                
                // ✅ Check if the order has been successfully placed in this session
                if (orderPlacedFlag) {
                    // Yahaan hum server se order ki details fetch kar sakte hain
                    // lekin simplification ke liye, hum bas error dikha rahe hain
                    // ya user ko history page par bhej sakte hain
                    console.log("Order already placed in this session. Redirecting to order history.");
                    navigate('/profile/orderhistory', { replace: true });
                    return;
                }

                // Prepare order data for the API call
                const orderData = {
                    products: cartData.items.map(item => ({
                        productId: item.productId || item._id,
                        productType: item.productType,
                        name: item.name || item.title,
                        quantity: item.quantity || 1,
                        price: item.price,
                        image: item.image,
                        category: item.category
                    })),
                    totalAmount: cartData.total,
                    shippingAddress: shippingAddress
                };
                
                // ✅ API call to place the order
                const response = await axios.post(
                    `${API_URL}/api/orders`,
                    orderData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // ✅ SUCCESS BLOCK
                // Set the order state and clear cart ONLY on success
                setOrder(response.data.order);
                sessionStorage.setItem('orderPlaced', 'true');
                if (!fromBuyNow) {
                    clearCart();
                }

            } catch (err) {
                // ✅ ERROR BLOCK
                // Only set error state here
                console.error("Order failed:", err);
                setError(err.response?.data?.message || err.message || "Order placement failed.");
                
            } finally {
                setLoading(false);
            }
        };

        placeOrder();

    }, [location.state, clearCart, navigate, user]);

    if (loading) {
        return (
            <div className="order-confirmation-container loading text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Placing Order...</span>
                </div>
                <p className="mt-3">Placing your order. Please wait...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-confirmation-container error text-center mt-5">
                <h2 className="text-danger">Order Placement Failed</h2>
                <p className="lead">{error}</p>
                <div className="d-flex justify-content-center gap-3 mt-3">
                    <Link to="/checkout" className="btn btn-primary">
                        Return to Checkout
                    </Link>
                    <Link to="/" className="btn btn-outline-secondary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="order-confirmation-container success text-center mt-5">
            <h2 className="text-success">
                <i className="bi bi-check-circle-fill me-2"></i>
                Order Placed Successfully!
            </h2>
            <p className="lead">Thank you for your purchase.</p>
            <div className="order-summary-card card p-4 mt-4 mx-auto" style={{ maxWidth: '500px' }}>
                <h5>Order ID: {order?._id || 'N/A'}</h5>
                <p className="fs-4 mt-3">
                    Total Amount: <strong>₹{(order?.totalAmount || 0).toFixed(2)}</strong>
                </p>
            </div>
            <div className="d-flex justify-content-center gap-3 mt-4">
                <Link to="/profile/orderhistory" className="btn btn-primary">
                    View Order History
                </Link>
                <Link to="/" className="btn btn-outline-success">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;