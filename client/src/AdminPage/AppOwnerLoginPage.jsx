// src/AppOwner/AppOwnerLoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppOwnerAuthContext } from '../context/AppOwnerContext';
import '../styles/AppOwnerLoginPage.css'; // ✅ नई CSS फ़ाइल import करें

const API_URL = process.env.REACT_APP_API_URL;

const AppOwnerLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { appOwnerLogin } = useContext(AppOwnerAuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/owner/login`, formData);
            const { token, appOwner } = res.data;
            appOwnerLogin(appOwner);
            localStorage.setItem('appOwnerToken', token);
            navigate('/app-owner/profile');
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            // यहाँ आप user को error message दिखा सकते हैं
        }
    };

    return (
        <div className="app-owner-login-page d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 custom-card">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">
                        <i className="bi bi-person-fill-lock me-2"></i> {/* Bootstrap Icon */}
                        App Owner Login
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="email">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppOwnerLoginPage;