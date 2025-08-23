// src/AdminPage/DeliveryProfilePage.jsx

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DeliveryAuthContext } from '../context/DeliveryAuthContext';
import '../styles/ProfilePage.css';


// Delivery-specific components ko import karein
import DeliveryOrders from './DeliveryOrders';
import DeliveryRequests from './DeliveryRequests';

const API_URL = process.env.REACT_APP_API_URL;

const DeliveryProfilePage = () => {
    const { deliveryPerson, setDeliveryPerson, deliveryLogout } = useContext(DeliveryAuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        age: '',
        gender: '',
        city: '',
    });

    useEffect(() => {
        if (deliveryPerson) {
            setFormData({
                name: deliveryPerson.name || '',
                email: deliveryPerson.email || '',
                mobileNumber: deliveryPerson.mobileNumber || '',
                age: deliveryPerson.age || '',
                gender: deliveryPerson.gender || '',
                city: deliveryPerson.city || '',
            });
        }
    }, [deliveryPerson]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${API_URL}/api/deliveryperson/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('deliveryToken')}`
                    }
                }
            );

            const updatedDeliveryPerson = res.data.deliveryPerson;
            setDeliveryPerson(updatedDeliveryPerson);
            localStorage.setItem('deliveryPerson', JSON.stringify(updatedDeliveryPerson));
            setIsEditing(false);
            alert("Profile updated successfully!"); // User feedback ke liye alert
        } catch (err) {
            console.error('Error updating delivery person profile:', err);
            alert(`Failed to update profile. Please try again. ${err.response ? err.response.data.message : err.message}`); // User feedback ke liye alert
        }
    };

    const handleLogout = () => {
        deliveryLogout();
        navigate('/delivery/login');
    };

    if (!deliveryPerson) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Delivery Dashboard</h2>
                <div className="welcome-message">
                    Hello, <i><b>{deliveryPerson.name}</b></i>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div
                        className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="bi bi-person-fill"></i> My Profile
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <i className="bi bi-box-seam"></i> Delivery Requests
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <i className="bi bi-box-seam"></i> My Deliveries
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
                                        onClick={handleEditClick}
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Name:</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mobile Number:</label>
                                        <input type="text" className="form-control" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email:</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Age:</label>
                                        <input type="number" className="form-control" name="age" value={formData.age} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Gender:</label>
                                        <input type="text" className="form-control" name="gender" value={formData.gender} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">City:</label>
                                        <input type="text" className="form-control" name="city" value={formData.city} onChange={handleInputChange} required />
                                    </div>
                                    <div className="button-group">
                                        <button type="submit" className="btn btn-primary">Save Changes</button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={handleCancelClick}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-details">
                                    <div className="detail-item"><span className="detail-label">Name:</span><span className="detail-value">{deliveryPerson.name}</span></div>
                                    <div className="detail-item"><span className="detail-label">Mobile:</span><span className="detail-value">{deliveryPerson.mobileNumber}</span></div>
                                    <div className="detail-item"><span className="detail-label">Email:</span><span className="detail-value">{deliveryPerson.email}</span></div>
                                    <div className="detail-item"><span className="detail-label">Age:</span><span className="detail-value">{deliveryPerson.age}</span></div>
                                    <div className="detail-item"><span className="detail-label">Gender:</span><span className="detail-value">{deliveryPerson.gender}</span></div>
                                    <div className="detail-item"><span className="detail-label">City:</span><span className="detail-value">{deliveryPerson.city}</span></div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'requests' && <DeliveryRequests />}
                    {activeTab === 'orders' && <DeliveryOrders />}
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfilePage;