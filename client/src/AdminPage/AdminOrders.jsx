// client/src/AdminPage/AdminOrders.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";
import "../styles/AdminOrders.css"; 

const API_URL = process.env.REACT_APP_API_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryRequests, setDeliveryRequests] = useState({}); 
  const { admin, loading } = useContext(AdminAuthContext);

  const fetchAdminOrders = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No admin token found. Not fetching orders.");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/api/orders/admin-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    }
  }, []);

  // ✅ new function to fetch delivery requests
  const fetchDeliveryRequests = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const res = await axios.get(
        `${API_URL}/api/admin/delivery-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const requestsMap = res.data.reduce((acc, req) => {
        acc[req.orderId._id] = req; // use orderId._id 
        return acc;
      }, {});
      setDeliveryRequests(requestsMap);
    } catch (err) {
      console.error("Error fetching delivery requests:", err);
    }
  }, []);

  // ✅ new function to handle accepting and rejecting delivery requests
  const handleAcceptDeliveryRequest = async (orderId, deliveryPersonId) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      await axios.put(
        `${API_URL}/api/admin/accept-delivery-request/${orderId}`,
        { deliveryPersonId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Delivery request accepted successfully! Order assigned.");
      fetchAdminOrders(); // orders load again to reflect changes
      fetchDeliveryRequests(); // Fetch requests again to update the UI
    } catch (err) {
      console.error("Error accepting delivery request:", err);
      alert("Failed to accept delivery request.");
    }
  };

  const handleRejectDeliveryRequest = async (orderId, deliveryPersonId) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      await axios.put(
        `${API_URL}/api/admin/reject-delivery-request/${orderId}`,
        { deliveryPersonId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Delivery request rejected successfully.");
      fetchDeliveryRequests(); // Fetch requests again to update the UI
    } catch (err) {
      console.error("Error rejecting delivery request:", err);
      alert("Failed to reject delivery request.");
    }
  };

  useEffect(() => {
    if (!loading && admin) {
      fetchAdminOrders();
      fetchDeliveryRequests();
    }
  }, [admin, loading, fetchAdminOrders, fetchDeliveryRequests]);

  const formatDateTime = (isoString) => {
    try {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      return new Date(isoString).toLocaleString("en-IN", options);
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Processing":
        return "bg-secondary";
      case "Accepted":
        return "bg-info";
      case "Shifted":
      case "Out for Delivery":
        return "bg-warning";
      case "Delivered":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-light text-dark";
    }
  };

  const isStatusActive = (orderStatus, statusToCheck) => {
    const statuses = [
      "Processing",
      "Accepted",
      "Shifted",
      "Out for Delivery",
      "Delivered",
    ];
    const currentStatusIndex = statuses.indexOf(orderStatus);
    const checkStatusIndex = statuses.indexOf(statusToCheck);
    return checkStatusIndex <= currentStatusIndex;
  };

  return (
    <div className="container mt-5">
      <h2>Seller Orders Dashboard</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="card mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <div>
                <strong>Order ID:</strong> {order._id}
                <br />
                <strong>Order Date:</strong>{" "}
                {order.createdAt
                  ? formatDateTime(order.createdAt)
                  : "Not available"}
              </div>
              <span
                className={`badge rounded-pill ${getStatusBadgeClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            {/* ✅ delivery request btn */}
            {deliveryRequests[order._id] && order.status === "Processing" && (
              <div className="alert alert-info d-flex justify-content-between align-items-center mt-3">
                <span>
                  Delivery request from{" "}
                  <strong>
                    {deliveryRequests[order._id].deliveryPersonId?.name}
                  </strong>
                  .
                </span>
                <div>
                  <button
                    className="btn btn-success me-2" // Add me-2 (margin-end) for spacing
                    onClick={() =>
                      handleAcceptDeliveryRequest(
                        order._id,
                        deliveryRequests[order._id].deliveryPersonId._id
                      )
                    }
                  >
                    Accept Request
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleRejectDeliveryRequest(
                        order._id,
                        deliveryRequests[order._id].deliveryPersonId._id
                      )
                    }
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            )}
            <div className="card-body">
              <div className="order-sections mt-3">
                <div className="order-section">
                  <h5>👤User Details:</h5>
                  <hr />
                  <p>
                    <strong>Name:</strong> {order.userId?.name}
                  </p>
                  <p>
                    <strong>Mobile No:</strong> {order.userId?.mobileNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.userId?.email}
                  </p>
                  {/* Delivery person Detail */}
                  <h5>🚴Delivery Person:</h5>
                  <hr />
                  {order.deliveryPersonId ? (
                    <>
                      <p>
                        <strong>Delivery Person Name:</strong>{" "}
                        {order.deliveryPersonId.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.deliveryPersonId.email}
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        {order.deliveryPersonId.mobileNumber}
                      </p>
                    </>
                  ) : (
                    <p>Not yet assigned.</p>
                  )}
                </div>

                <div className="order-section">
                  <h5>🏡Shipping Address:</h5>
                  <hr />
                  {order.shippingAddress ? (
                    <>
                      <p>
                        <strong>Name:</strong> {order.shippingAddress.name}
                      </p>
                      <p>
                        <strong>House No./Village:</strong>{" "}
                        {order.shippingAddress.village}
                      </p>
                      <p>
                        <strong>City:</strong> {order.shippingAddress.city}
                      </p>
                      <p>
                        <strong>District:</strong>{" "}
                        {order.shippingAddress.district}
                      </p>
                      <p>
                        <strong>State:</strong> {order.shippingAddress.state}
                      </p>
                      <p>
                        <strong>Pin Code:</strong>{" "}
                        {order.shippingAddress.pinCode}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.shippingAddress.phone}
                      </p>
                    </>
                  ) : (
                    <p>No shipping address provided.</p>
                  )}
                </div>
                {/* new section delivery date */}
                <div className="order-section estimated-delivery-section">
                  <h5>⏳ Estimated Delivery</h5>
                  <hr />
                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(order.estimatedDeliveryDate)}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {formatTime(order.estimatedDeliveryDate)}
                  </p>
                </div>
              </div>

              <hr />
              <div className="row">
                <div className="col-md-7">
                  <h5>📦Products Ordered</h5>
                  <ul className="list-group">
                    {order.products.map((p) => (
                      <li
                        key={p.productId?._id}
                        className="list-group-item d-flex align-items-center"
                      >
                        <div className="d-flex align-items-center flex-grow-1">
                          {p.productId?.image && (
                            <Link
                              to={`/product/${p.productId._id}`}
                              className="text-decoration-none text-dark"
                            >
                              <img
                                src={p.productId.image}
                                alt={p.productId.title}
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  objectFit: "cover",
                                  marginRight: "10px",
                                }}
                              />
                            </Link>
                          )}
                          <div>
                            <strong>
                              {p.productId?.title || "Unknown Product"}
                            </strong>
                            <p>{p.productId?.productType}</p>
                            <p>{p.productId?.description}</p>
                            <p>Quantity: {p.quantity}</p>
                            <span className="badge bg-primary rounded-pill">
                              ₹{p.price}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-5">
                  <h5>🚚Order Status</h5>
                  <div className="order-timeline-container">
                    <ul className="order-timeline">
                      {[
                        "Processing",
                        "Accepted",
                        "Shifted",
                        "Out for Delivery",
                        "Delivered",
                      ].map((status, index) => (
                        <li
                          key={status}
                          className={`timeline-item ${
                            isStatusActive(order.status, status) ? "active" : ""
                          }`}
                        >
                          <div className="timeline-point"></div>
                          <div className="timeline-content">{status}</div>
                          {index < 4 && <div className="timeline-line"></div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <h4 className="mt-3 text-end">
                Total Amount: ₹{order.totalAmount}
              </h4>
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default AdminOrders;
