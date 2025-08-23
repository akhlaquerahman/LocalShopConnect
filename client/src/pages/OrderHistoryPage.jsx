import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const ordersData = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response.data.orders) ? response.data.orders : 
                         [];
        
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '600px' }}>
        <h4 className="alert-heading">Error Loading Orders</h4>
        <p>{error}</p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <Link to="/" className="btn btn-outline-secondary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4>No Orders Found</h4>
        <p className="lead">You haven't placed any orders yet.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Order History</h2>
      <div className="row">
        {orders.map(order => (
          <div key={order._id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between">
                  <h5 className="mb-0">Order #{order._id.substring(0, 8)}</h5>
                  <span className={`badge ${
                    order.status === 'Delivered' ? 'bg-success' :
                    order.status === 'Cancelled' ? 'bg-danger' :
                    'bg-warning text-dark'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <small className="text-muted">
                  Ordered on: {new Date(order.createdAt || order.orderDate).toLocaleString()}
                </small>
              </div>
              <div className="card-body">
                <h6>Products:</h6>
                <ul className="list-group list-group-flush mb-3">
                  {order.products.map(product => (
                    <li key={product.productId} className="list-group-item">
                      <div className="d-flex align-items-center mb-2">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="img-thumbnail me-3"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <h6 className="mb-1">{product.name}</h6>
                          <small className="text-muted">{product.productType}</small>
                          {product.description && (
                            <p className="text-muted small mb-1">
                              {product.description.length > 50 
                                ? `${product.description.substring(0, 50)}...` 
                                : product.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">
                          Qty: {product.quantity}
                        </span>
                        <span className="fw-bold">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <div>
                    <small className="text-muted">
                      Ordered: {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="text-end">
                    <h5 className="mb-0">Total: ₹{order.totalAmount.toFixed(2)}</h5>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-white">
                <Link 
                  to={`/order/${order._id}`} 
                  className="btn btn-sm btn-outline-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;