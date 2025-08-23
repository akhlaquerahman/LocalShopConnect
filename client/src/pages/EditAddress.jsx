// src/pages/EditAddress.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL;

const EditAddress = () => {
    const { addressId } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        village: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
    });

    useEffect(() => {
        if (user && user.addresses) {
            const addressToEdit = user.addresses.find(
                (address) => address._id === addressId
            );
            if (addressToEdit) {
                setFormData(addressToEdit);
            } else {
                console.error('Address not found in user data');
                navigate('/profile');
            }
        }
    }, [user, addressId, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${API_URL}/api/auth/addresses/${addressId}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            const updatedUser = res.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            navigate('/profile');
        } catch (err) {
            console.error('Failed to update address:', err);
        }
    };

    return (
        // ✅ Improved UI with Bootstrap
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title text-center mb-0">Edit Address</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* ✅ Full Name Field */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* ✅ Phone Number Field */}
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* ✅ Village & City in a single row */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="village" className="form-label">House No./Village</label>
                                        <input
                                            type="text"
                                            id="village"
                                            name="village"
                                            className="form-control"
                                            value={formData.village}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="form-control"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* ✅ Pin Code & District in a single row */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="pinCode" className="form-label">Pin Code</label>
                                        <input
                                            type="text"
                                            id="pinCode"
                                            name="pinCode"
                                            className="form-control"
                                            value={formData.pinCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="district" className="form-label">District</label>
                                        <input
                                            type="text"
                                            id="district"
                                            name="district"
                                            className="form-control"
                                            value={formData.district}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* ✅ State Field */}
                                <div className="mb-3">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        className="form-control"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Update Address
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAddress;