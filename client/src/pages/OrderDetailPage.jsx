// src/pages/OrderDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderDetailPage.css';

const API_URL = process.env.REACT_APP_API_URL;

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(res.data);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError(err.response?.data?.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

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

    const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      return date.toLocaleDateString("en-GB", options);
    } catch (e) {
      return "N/A";
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleTimeString("en-GB", options);
    } catch (e) {
      return "N/A";
    }
  };

    if (loading) {
        return <div className="text-center mt-5">Loading order details...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '600px' }}>{error}</div>;
    }

    if (!order) {
        return <div className="text-center mt-5">Order not found.</div>;
    }

    const isStatusActive = (orderStatus, statusToCheck) => {
        const statuses = ['Processing', 'Accepted', 'Shifted', 'Out for Delivery', 'Delivered'];
        const currentStatusIndex = statuses.indexOf(orderStatus);
        const checkStatusIndex = statuses.indexOf(statusToCheck);
        return checkStatusIndex <= currentStatusIndex;
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Order Details</h2>
            <div className="card mb-4">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Order ID:</strong> {order._id}<br />
                        <strong>Order Date:</strong> {order.createdAt ? formatDateTime(order.createdAt) : "Not available"}
                    </div>
                    <span className={`status-badge status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {order.status}
                    </span>
                </div>
                <div className="card-body">
                    <div className="row">
                        {/* Left Column for Products and Shipping */}
                        <div className="col-md-8 order-section">
                            <h5>📦Products</h5>
                            <hr />
                            <ul className="list-group mb-3">
                                {order.products.map(p => (
                                    <li key={p.productId?._id} className="list-group-item d-flex align-items-center">
                                        <img
                                            src={p.productId?.image || p.image}
                                            alt={p.productId?.title || p.name}
                                            className="img-thumbnail me-3"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <strong>{p.productId?.title || p.name}</strong><br />
                                            <small className="text-muted">{p.productId?.productType || p.productType}</small><br />
                                            <small className="text-muted">{p.productId?.description || p.description}</small><br />
                                            <small className="text-muted">Quantity: {p.quantity}</small><br />
                                            <small className="fw-bold">₹{p.price}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <h5 className="text-end">Total Amount: ₹{order.totalAmount.toFixed(2)}</h5>
                        <div className="order-sections mt-5">
                            <div className="order-section">
                            <h5>🏡Shipping Details</h5>
                            <hr />
                            {order.shippingAddress ? (
                                <>
                                    <p><strong>Name:</strong> {order.shippingAddress.name}</p>
                                    <p><strong>House No./Village:</strong> {order.shippingAddress.village}</p>
                                    <p><strong>City:</strong> {order.shippingAddress.city}</p>
                                    <p><strong>district:</strong> {order.shippingAddress.district}</p>
                                    <p><strong>State:</strong> {order.shippingAddress.state}</p>
                                    <p><strong>Pin Code:</strong> {order.shippingAddress.pinCode}</p>
                                    <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                                </>
                            ) : (
                                <p>No shipping address provided.</p>
                            )}
                            </div>
                            {/* ✅ new section for delivery date */}
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
                        </div>

                        {/* Right Column for Order Status and Delivery Person */}
                        <div className="col-md-4">
                            <h5 style={{color: "blue"}}>🚚Order Status</h5>
                            <div className="order-timeline-container">
                                <ul className="order-timeline">
                                    {['Processing', 'Accepted', 'Shifted', 'Out for Delivery', 'Delivered'].map((status, index) => (
                                        <li
                                            key={status}
                                            className={`timeline-item ${isStatusActive(order.status, status) ? 'active' : ''}`}
                                        >
                                            <div className="timeline-point"></div>
                                            <div className="timeline-content">{status}</div>
                                            {/* ✅ Add a connecting line for all but the last item */}
                                            {index < 4 && <div className="timeline-line"></div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {order.deliveryPersonId && order.status === 'Out for Delivery' && (
                                <>
                                    <h4 className="mt-4">Delivery Person Details</h4>
                                    <hr />
                                    <p><strong>Name:</strong> {order.deliveryPersonId.name}</p>
                                    <p><strong>Contact:</strong> {order.deliveryPersonId.mobileNumber}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;