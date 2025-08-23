// src/AdminPage/AppOwnerProfilePage.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// The following lines are placeholders. In a real application,
// you would need to ensure these files exist at the specified paths.
import { AppOwnerAuthContext } from "../context/AppOwnerContext";
import "../styles/ProfilePage.css";

const API_URL = process.env.REACT_APP_API_URL;

const AppOwnerProfilePage = () => {
  // Destructure appOwner and logout function from context
  const { appOwner, appOwnerLogout } = useContext(AppOwnerAuthContext);

  // State variables for managing active tab and fetched data
  const [activeTab, setActiveTab] = useState("myAccount");
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // React Router hook for navigation
  const navigate = useNavigate();

  // Async function to fetch all dashboard data from the API
  const fetchData = async () => {
    try {
      // Get the authentication token from local storage
      const token = localStorage.getItem("appOwnerToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch users, sellers, and delivery persons data
      const res = await axios.get(`${API_URL}/api/owner/data`, config);
      const { users, sellers, deliveryPersons } = res.data;

      // Map over the data to add a serial number for display purposes
      setUsers(
        users.map((item, index) => ({ ...item, serialNumber: index + 1 }))
      );
      setSellers(
        sellers.map((item, index) => ({ ...item, serialNumber: index + 1 }))
      );
      setDeliveryPersons(
        deliveryPersons.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );

      // Fetch products data with seller and creation date information
      const productsRes = await axios.get(
        `${API_URL}/api/products`,
        config
      );
      setProducts(
        productsRes.data.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );

      // Fetch orders data
      const ordersRes = await axios.get(
        `${API_URL}/api/owner/orders`,
        config
      );
      setOrders(
        ordersRes.data.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      // Set loading to false once all data is fetched or an error occurs
      setLoading(false);
    }
  };

  // State for My Account form data
  const [formData, setFormdata] = useState({
    name: '',
    email: '',
    location: '',
    mobile: ''
  });

  // Effect hook to handle authentication and data fetching
  useEffect(() => {
    if (!appOwner) {
      // If appOwner is not authenticated, redirect to login page
      navigate("/app-owner/login");
    } else {
      // If authenticated, populate the form with appOwner's data and fetch dashboard data
      setFormdata({
        name: appOwner.name || '',
        email: appOwner.email || '',
        location: appOwner.location || '',
        mobile: appOwner.mobile || ''
      });
      fetchData();
    }
  }, [appOwner, navigate]); // Re-run effect when appOwner or navigate changes

  // Handler for logging out the app owner
  const handleLogout = () => {
    appOwnerLogout();
    navigate("/");
  };
  
  // Handler for clicking a product row to navigate to its detail page
  const handleProductRowClick = (product) => {
    if (product && product._id) { 
      navigate(`/product/${product._id}`);
    }
  };

  // Handler for clicking an order row to navigate to the first product's detail page
  const handleOrderRowClick = (order) => {
    // Check if the order and its products array exist and are not empty
    if (order.products && order.products.length > 0) {
      const firstProduct = order.products[0];
      // Check if the first product has a valid product ID
      if (firstProduct.productId && firstProduct.productId._id) { 
        navigate(`/product/${firstProduct.productId._id}`);
      }
    }
  };

  // Helper function to format ISO date strings
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      const options = {
        day: "2-digit",
        month: "numeric", // Corrected this to 'long' for better display
        year: "numeric",
      };
      return date.toLocaleDateString("en-GB", options);
    } catch (e) {
      return "N/A";
    }
  };

  // Display a loading message while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Main component rendering
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>App Owner Dashboard</h2>
        <div className="welcome-message">Hello, <i><b>{appOwner?.name}</b></i></div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <ul className="nav flex-column">
            <li className="nav-item">
              <div
                className={`sidebar-item nav-link ${
                  activeTab === "myAccount" ? "active" : ""
                }`}
                onClick={() => setActiveTab("myAccount")}
              >
                <i className="bi bi-person-circle me-2"></i> My Account
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`sidebar-item nav-link ${
                  activeTab === "users" ? "active" : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                <i className="bi bi-people-fill me-2"></i> Manage Users
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`sidebar-item nav-link ${
                  activeTab === "sellers" ? "active" : ""
                }`}
                onClick={() => setActiveTab("sellers")}
              >
                <i className="bi bi-shop me-2"></i> Manage Sellers
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`sidebar-item nav-link ${
                  activeTab === "delivery" ? "active" : ""
                }`}
                onClick={() => setActiveTab("delivery")}
              >
                <i className="bi bi-truck me-2"></i> Manage Delivery Persons
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`sidebar-item nav-link ${
                  activeTab === "products" ? "active" : ""
                }`}
                onClick={() => setActiveTab("products")}
              >
                <i className="bi bi-box-seam me-2"></i> Manage Products
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`sidebar-item nav-link ${
                  activeTab === "orders" ? "active" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <i className="bi bi-receipt me-2"></i> Manage Orders
              </div>
            </li>
            <li className="nav-item mt-4">
              <div className="sidebar-item nav-link" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </div>
            </li>
          </ul>
        </div>

        <div className="profile-main p-4 flex-grow-1">
          {activeTab === "myAccount" && (
            <div className="profile-section card shadow-sm p-4">
              <h3 className="card-title">My Account</h3>
              <p className="card-text">
                <strong>Name:</strong> {formData.name}
              </p>
              <p className="card-text">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="card-text">
                <strong>Location:</strong> {formData.location}
              </p>
              <p className="card-text">
                <strong>Mobile:</strong> {formData.mobile}
              </p>
            </div>
          )}
          {activeTab === "users" && (
            <div className="profile-section card shadow-sm p-4">
              <h3 className="card-title">All Users</h3>
              <div className="table-responsive">
                {users.length > 0 ? (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.serialNumber}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.mobileNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No users found.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "sellers" && (
            <div className="profile-section card shadow-sm p-4">
              <h3 className="card-title">All Sellers</h3>
              <div className="table-responsive">
                {sellers.length > 0 ? (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>ShopName</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.map((seller) => (
                        <tr key={seller._id}>
                          <td>{seller.serialNumber}</td>
                          <td>{seller.name}</td>
                          <td>{seller.email}</td>
                          <td>{seller.shopName}</td>
                          <td>{seller.category}</td>
                          <td>{seller.city}</td>
                          <td>{seller.mobileNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No sellers found.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "delivery" && (
            <div className="profile-section card shadow-sm p-4">
              <h3 className="card-title">All Delivery Persons</h3>
              <div className="table-responsive">
                {deliveryPersons.length > 0 ? (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>City</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryPersons.map((dp) => (
                        <tr key={dp._id}>
                          <td>{dp.serialNumber}</td>
                          <td>{dp.name}</td>
                          <td>{dp.age}</td>
                          <td>{dp.email}</td>
                          <td>{dp.mobileNumber}</td>
                          <td>{dp.city}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No delivery persons found.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "products" && (
            <div className="profile-section card shadow-sm p-4">
              <h3 className="card-title">All Products</h3>
              <div className="table-responsive">
                {products.length > 0 ? (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Seller</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr 
                          key={product._id}
                          onClick={() => handleProductRowClick(product)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{product.serialNumber}</td>
                          <td>
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{ width: "50px", height: "50px" }}
                            />
                          </td>
                          <td>{product.title}</td>
                          {/* Ensure your API returns seller and creation data. */}
                          <td>{product.sellerId?.email || "N/A"}</td>
                          <td>₹ {product.price}</td>
                          <td>{product.category}</td>
                          <td>
                            {product.createdAt
                              ? formatDate(product.createdAt)
                              : "Not available"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="profile-section card shadow-sm p-4">
              <h3 className="card-title">All Orders</h3>
              <div className="table-responsive">
                {orders.length > 0 ? (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Product</th>
                        <th>OrderID</th>
                        <th>User Email</th>
                        <th>Seller Email</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          onClick={() => handleOrderRowClick(order)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{order.serialNumber}</td>
                          <td>
                            {/* Map over the products array specific to this order */}
                            {order.products.map((item, index) => (
                              <div key={index} style={{ marginBottom: '5px' }}>
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                )}
                                <p>{item.productType} ({item.quantity})</p>
                              </div>
                            ))}
                          </td>
                          <td>{order._id.slice(-8)}</td>
                          <td>{order.userId?.email || "N/A"}</td>
                          <td>{order.shopId?.email || "N/A"}</td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            {order.createdAt
                              ? formatDate(order.createdAt)
                              : "Not available"}
                          </td>
                          <td>{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppOwnerProfilePage;