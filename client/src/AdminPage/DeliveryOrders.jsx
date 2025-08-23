import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { DeliveryAuthContext } from '../context/DeliveryAuthContext';
import '../styles/DeliveryOrders.css';

const API_URL = process.env.REACT_APP_API_URL;

const DeliveryOrders = () => {
    // find the delivery person from context
    const { deliveryPerson, loading: authLoading } = useContext(DeliveryAuthContext); 
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useCallback to fetch orders
    const fetchOrders = useCallback(async () => {
        // if authLoading is true, return early
        if (authLoading) {
            return;
        }
        
        // if deliveryPerson is not available, set loading to false and return
        if (!deliveryPerson) {
            setLoading(false);
            return;
        }

        try {
            // Get the delivery token from localStorage
            const token = localStorage.getItem('deliveryToken');
            // API call to fetch delivery orders
            const response = await axios.get(
                `${API_URL}/api/deliveryperson/orders`, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            // Set the fetched orders to state
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching delivery orders:', err);
            setError('Failed to load your deliveries.');
            setLoading(false);
        }
    }, [deliveryPerson, authLoading]); // dependencies: deliveryPerson and authLoading

    // useEffect to fetch orders when component mounts or auth changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // handle status update for orders
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('deliveryToken');
            await axios.put(
                `${API_URL}/api/deliveryperson/orders/${orderId}/status`,
                { newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            // ✅ New: Fetch orders again to reflect status change
            fetchOrders(); 
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status.');
        }
    };

    // ✅ Helper function to check if the status is active
    const isStatusActive = (orderStatus, statusToCheck) => {
        const statuses = ['Accepted', 'Shifted', 'Out for Delivery', 'Delivered'];
        const currentStatusIndex = statuses.indexOf(orderStatus);
        const checkStatusIndex = statuses.indexOf(statusToCheck);
        return checkStatusIndex <= currentStatusIndex;
    };

    // ✅ Format date and time for better readability
    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        try {
            const date = new Date(isoString);
            const options = {
                day: '2-digit', 
                month: 'long', 
                year: 'numeric'
            };
            return date.toLocaleDateString('en-GB', options);
        } catch (e) {
            return "N/A";
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return "N/A";
        try {
            const date = new Date(isoString);
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            return date.toLocaleTimeString('en-GB', options);
        } catch (e) {
            return "N/A";
        }
    };

    const formatDateTime = (isoString) => {
        try {
            const options = {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: true
            };
            return new Date(isoString).toLocaleString('en-IN', options);
        } catch (e) {
            return "N/A";
        }
    };
    
    // If authLoading is true, show loading state
    if (authLoading) {
        return <div className="loading">Checking login status...</div>;
    }

    // If no delivery person is found, show a message
    if (!deliveryPerson) {
        return <div className="no-orders-message">Please log in to view your deliveries.</div>;
    }
    
    // If loading is true, show loading state
    if (loading) {
        return <div className="loading">Loading your deliveries...</div>;
    }

    // If there's an error, show the error message
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    // Render the delivery orders
    return (
        <div className="delivery-orders-container">
            <h3>My Deliveries</h3>
            {orders.length === 0 ? (
                <div className="no-orders-message">You have no active deliveries at the moment.</div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Order ID:</strong> {order._id}<br />
                                    <strong>Order Date:</strong> {order.createdAt ? formatDateTime(order.createdAt) : "Not available"}
                                </div>
                                <span className={`status-badge status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-sections mt-3">
                                <div className="order-section">
                                    <h5>🛍️ Shop Details</h5>
                                    <hr />
                                    <p><strong>Shop Name:</strong> {order.shopId?.shopName || 'N/A'}</p>
                                    <p><strong>Seller:</strong> {order.shopId?.name || 'N/A'}</p>
                                    <p><strong>Location:</strong> {order.shopId?.city || 'N/A'}</p>
                                    <p><strong>Mobile:</strong> {order.shopId?.mobileNumber || 'N/A'}</p>
                                </div>

                                <div className="order-section">
                                    <h5>🏡 Shipping Address</h5>
                                    <hr />
                                    <p><strong>Customer:</strong> {order.shippingAddress.name || 'N/A'}</p>
                                    <p><strong>House No./Village:</strong> {order.shippingAddress.village || 'N/A'}</p>
                                    <p><strong>City:</strong> {order.shippingAddress.city || 'N/A'}, {order.shippingAddress.district || 'N/A'}, {order.shippingAddress.state}</p>
                                    <p><strong>Pin Code:</strong> {order.shippingAddress.pinCode || 'N/A'}</p>
                                    <p><strong>Phone Number:</strong> {order.shippingAddress.phone || 'N/A'}</p>
                                </div>
                                
                                {/* ✅ New section for date  */}
                                <div className="order-section estimated-delivery-section">
                                    <h5>⏳ Estimated Delivery</h5>
                                    <hr />
                                    <p>
                                        <strong>Date:</strong> {formatDate(order.estimatedDeliveryDate)}
                                    </p>
                                    <p>
                                        <strong>Time:</strong> {formatTime(order.estimatedDeliveryDate)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <h5>📦 Ordered Items</h5>
                                    <hr />
                                    {order.products.map(item => (
                                        <div key={item._id} className="product-item">
                                            <img src={item.productId?.image || item.image || 'placeholder-image-url'} alt={item.productId?.title || item.name} className="product-image" />
                                            <div className="product-details">
                                                <p><strong>{item.productId?.title || item.name}</strong></p>
                                                <p className="product-type">{item.productId?.productType || item.productType || 'N/A'}</p>
                                                <p className="product-description">{item.productId?.description || 'No description available.'}</p>
                                                <p>Price: ₹{item.price}</p>
                                                <p>Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-md-6 mt-4 mt-md-0">
                                    <h5>🚚 Order Status</h5>
                                    <div className="order-timeline-container">
                                        <ul className="order-timeline">
                                            {['Accepted', 'Shifted', 'Out for Delivery', 'Delivered'].map((status, index) => (
                                                <li
                                                    key={status}
                                                    className={`timeline-item ${isStatusActive(order.status, status) ? 'active' : ''}`}
                                                >
                                                    <div className="timeline-point"></div>
                                                    <div className="timeline-content">{status}</div>
                                                    {index < 3 && <div className="timeline-line"></div>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="status-buttons mt-4">
                                {order.status === 'Accepted' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleStatusUpdate(order._id, 'Shifted')}
                                    >
                                        Mark as Shifted
                                    </button>
                                )}
                                
                                {order.status === 'Shifted' && (
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')}
                                    >
                                        Mark as Out for Delivery
                                    </button>
                                )}

                                {order.status === 'Out for Delivery' && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryOrders;