// src/pages/ProfilePage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

// ✅ FIX: Import the OrderHistoryPage component
import OrderHistoryPage from './OrderHistoryPage';

const API_URL = process.env.REACT_APP_API_URL;

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  // `orders` state ab `OrderHistoryPage` ke andar manage hoga, isliye yahan se hata sakte hain.
  // const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]); // location.state mein change hone par re-run hoga


  // useEffect se `fetchOrders` wala logic remove kar dein
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || ''
      });
    }
    // Ab orders yahan fetch nahi ho rahe hain, woh OrderHistoryPage component khud karega
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); 

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAddAddress = () => {
    navigate('/profile/add-address');
  };

  const handleEditAddress = (addressId) => {
    navigate(`/profile/edit-address/${addressId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };
  
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/auth/addresses/${addressId}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert('Address deleted successfully!');
      } catch (err) {
        console.error('Error deleting address:', err);
        alert('Failed to delete address.');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Account</h2>
        <div className="welcome-message">
          Hello, <i><b>{user?.name || 'User'}</b></i>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div 
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-fill"></i> Profile
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <i className="bi bi-house-door-fill"></i> Addresses
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-bag-fill"></i> My Orders
          </div>
          <div className="sidebar-item" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </div>
        </div>

        <div className="profile-main">
          {/* ... (profile tab) ... */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                {!isEditing && (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* ✅ Add more fields as needed */}
                  
                  <div className="button-group">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{user?.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mobile:</span>
                    <span className="detail-value">{user?.mobileNumber}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ... (addresses tab) ... */}
          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <div className="section-header">
                <h3>Saved Addresses</h3>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddAddress}
                >
                  + Add New Address
                </button>
              </div>
              
              {user?.addresses?.length > 0 ? (
                <div className="address-list">
                  {user.addresses.map((address) => (
                    <div key={address._id} className="address-card">
                      <ul className="list-unstyled mb-2">
                        <li><strong>Name:</strong> {address.name}</li>
                        <li><strong>Phone:</strong> {address.phone}</li>
                        <li><strong>Village:</strong> {address.village}</li>
                        <li><strong>City:</strong> {address.city}</li>
                        <li><strong>District: </strong>{address.district}</li>
                        <li><strong>State: </strong>{address.state}</li>
                        <li><strong>Pin Code: </strong>{address.pinCode}</li>
                      </ul>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEditAddress(address._id)}
                      >
                        Edit Address
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="bi bi-house-door"></i>
                  <p>You haven't saved any addresses yet</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddAddress}
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ FIX: Render the OrderHistoryPage component here */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <OrderHistoryPage />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;