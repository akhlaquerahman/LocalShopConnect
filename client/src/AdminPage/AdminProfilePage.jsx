// src/AdminPage/AdminProfilePage.jsx

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import '../styles/ProfilePage.css'; // CSS file ko import karein


// Admin-specific components ko import karein
import AdminProductListPage from './AdminProductListPage';
import AdminOrders from './AdminOrders';

const API_URL = process.env.REACT_APP_API_URL;

const AdminProfilePage = () => {
    const { admin, setAdmin, adminLogout } = useContext(AdminAuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Form data ko admin ki properties ke hisaab se update karein
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        shopName: '',
        city: '',
        category: '',
        mobileNumber: ''
    });

    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || '',
                email: admin.email || '',
                shopName: admin.shopName || '',
                city: admin.city || '',
                category: admin.category || '',
                mobileNumber: admin.mobileNumber || ''
            });
        }
    }, [admin]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend API ko update karein jisse admin profile update ho
            const res = await axios.put(
                `${API_URL}/api/admin/profile`, 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                }
            );

            const updatedAdmin = res.data.admin;
            setAdmin(updatedAdmin); // Admin context ko update karein
            localStorage.setItem('admin', JSON.stringify(updatedAdmin)); // Optional: localStorage mein bhi update karein
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating admin profile:', err);
        }
    };

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    if (!admin) {
        return <div>Loading...</div>; // Ya redirect karein login page par
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Seller Dashboard</h2>
                <div className="welcome-message">
                    Hello, {admin.name}!
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div 
                        className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="bi bi-person-fill"></i> Seller Profile
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <i className="bi bi-box-seam"></i> Manage Products
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <i className="bi bi-card-checklist"></i> View Orders
                    </div>
                    <div className="sidebar-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Logout
                    </div>
                </div>

                <div className="profile-main">
                    {activeTab === 'profile' && (
                        <div className="profile-section">
                            <div className="section-header">
                                <h3>Account Information</h3>
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
                                        <label className="form-label">Seller Name</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Shop Name</label>
                                        <input type="text" className="form-control" name="shopName" value={formData.shopName} onChange={handleInputChange} required />
                                    </div>
                                    <div className='mb-3'>
                                        <label className="form-label">Shop Location</label>
                                        <input type="text" className="form-control" name="city" value={formData.city} onChange={handleInputChange} required />
                                    </div>
                                    <div className='mb-3'>
                                        <label className="form-label">Shop Category</label>
                                        <input type="text" className="form-control" name="category" value={formData.category} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mobile Number</label>
                                        <input type="text" className="form-control" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    <div className="button-group">
                                        <button type="submit" className="btn btn-primary">Save Changes</button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-details">
                                    <div className="detail-item"><span className="detail-label">Name:</span><span className="detail-value">{admin.name}</span></div>
                                    <div className="detail-item"><span className="detail-label">Shop Name:</span><span className="detail-value">{admin.shopName}</span></div>
                                    <div className='detail-item'><span className='detail-label'>Location:</span> <span className='detail-value'>{admin.city}</span></div>
                                    <div className='detail-item'><span className='detail-label'>Shop Category:</span> <span className='detail-value'>{admin.category}</span></div>
                                    <div className="detail-item"><span className="detail-label">Mobile:</span><span className="detail-value">{admin.mobileNumber}</span></div>
                                    <div className="detail-item"><span className="detail-label">Email:</span><span className="detail-value">{admin.email}</span></div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'products' && (
                        <AdminProductListPage /> // Naya component jahan products manage honge
                    )}
                    {activeTab === 'orders' && (
                        <AdminOrders /> // Naya component jahan sare orders dikhenge
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;