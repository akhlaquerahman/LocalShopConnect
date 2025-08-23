// client/src/AdminPage/DeliveryRequests.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DeliveryAuthContext } from '../context/DeliveryAuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const DeliveryRequests = () => {
    const { deliveryPerson, loading: authLoading } = useContext(DeliveryAuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            if (authLoading) return;
            if (!deliveryPerson) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('deliveryToken');
                const response = await axios.get(
                    `${API_URL}/api/deliveryperson/requests?city=${deliveryPerson.city}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setRequests(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching delivery requests:', err);
                setError('Failed to load delivery requests.');
                setLoading(false);
            }
        };

        fetchRequests();
    }, [deliveryPerson, authLoading]);

    // ✅ Function to handle sending a delivery request
    const handleSendRequest = async (orderId) => {
        try {
            const token = localStorage.getItem('deliveryToken');
            await axios.put(
                `${API_URL}/api/deliveryperson/request-to-deliver/${orderId}`,
                {}, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // ✅ Update the requests state after sending the request
            setRequests(requests.filter(req => req._id !== orderId));
            alert('Request sent to seller for delivery!');

        } catch (err) {
            console.error('Error sending request:', err);
            setError('Failed to send delivery request.');
        }
    };

    // ✅ Helper function to format date
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

    if (authLoading) {
        return <div className="alert alert-info text-center mt-4">Checking login status...</div>;
    }

    if (!deliveryPerson) {
        return <div className="alert alert-warning text-center mt-4">Please log in to view delivery requests.</div>;
    }
    
    if (loading) {
        return <div className="alert alert-info text-center mt-4">Loading available requests...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-4">Error: {error}</div>;
    }
    
    return (
        <div className="container py-4">
            <h3 className="text-center mb-4">Available Delivery Requests ({deliveryPerson.city})</h3>
            {requests.length === 0 ? (
                <div className="alert alert-secondary text-center mt-4">No new delivery requests in your area.</div>
            ) : (
                <div className="row g-4">
                    {requests.map(request => (
                        <div key={request._id} className="col-12">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <div>
                                    <strong>Order ID:</strong> {request._id}<br />
                                    <strong>Order Date:</strong> {request.createdAt ? formatDateTime(request.createdAt) : "Not available"}
                                </div>
                                    <span className="badge bg-warning text-dark">Pending</span>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <h6 className="text-primary d-flex align-items-center mb-2"><i className="bi bi-shop me-2"></i>🛍️ Shop Details</h6>
                                            <p className="mb-1"><strong>Shop Name:</strong> {request.shopId?.shopName || 'N/A'}</p>
                                            <p className="mb-0"><strong>Location:</strong> {request.shopId?.city || 'N/A'}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <h6 className="text-primary d-flex align-items-center mb-2"><i className="bi bi-geo-alt me-2"></i>🏡 Shipping Address</h6>
                                            <p className="mb-1"><strong>Customer:</strong> {request.shippingAddress?.name || 'N/A'}</p>
                                            <p className="mb-0"><strong>Address:</strong> {request.shippingAddress?.village || 'N/A'}, {request.shippingAddress?.city || 'N/A'}, {request.shippingAddress?.pinCode || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <h6 className="text-primary d-flex align-items-center mb-2">⏳ Estimated Delivery</h6>
                                            <hr />
                                            <p>
                                                <strong>Date:</strong> {formatDate(request.estimatedDeliveryDate)}
                                            </p>
                                            <p>
                                                <strong>Time:</strong> {formatTime(request.estimatedDeliveryDate)}
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <h6 className="text-primary d-flex align-items-center mb-2"><i className="bi bi-box me-2"></i>📦 Ordered Items</h6>
                                            <ul className="list-group list-group-flush">
                                                {request.products.map(item => (
                                                    <li key={item._id} className="list-group-item d-flex align-items-center">
                                                        <img src={item.productId?.image || 'https://via.placeholder.com/50'} alt={item.productId?.title || 'Product'} className="img-thumbnail me-3" style={{ width: '50px', height: '50px' }} />
                                                        <div>
                                                            <p className="fw-bold mb-0">{item.productId?.title || 'N/A'}</p>
                                                            <p className="text-muted mb-0">{item.productId?.productType || 'N/A'}</p>
                                                            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{item.productId?.description || 'No description'}</p>
                                                            <p className="mb-0"><strong>Price:</strong> ₹{item.price} | <strong>Quantity:</strong> {item.quantity}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0">
                                    <button 
                                        className="btn btn-primary w-100"
                                        onClick={() => handleSendRequest(request._id)}
                                    >
                                        Send Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryRequests;