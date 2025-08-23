// src/context/AdminAuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL;

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAdminStatus = () => {
        const token = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('admin');
        
        if (token && adminData) {
            try {
                const decoded = jwtDecode(token);
                if (decoded && decoded.role === 'admin' && decoded.exp * 1000 > Date.now()) {
                    setAdmin(JSON.parse(adminData));
                } else {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('admin');
                }
            } catch (err) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const adminLogin = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/admin/login`, { email, password });
            localStorage.setItem('adminToken', res.data.token);
            // ✅ Store admin data in localStorage
            localStorage.setItem('admin', JSON.stringify(res.data.admin)); 
            setAdmin(res.data.admin); 
        } catch (error) {
            throw error
        }
    };

    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, loading, adminLogin, adminLogout, setAdmin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};