// src/context/DeliveryAuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL;

export const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
    const [deliveryPerson, setDeliveryPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkDeliveryPersonStatus = async () => {
        const token = localStorage.getItem('deliveryToken');
        // ✅ Check if token and deliveryPerson data exist in localStorage
        const deliveryPersonData = localStorage.getItem('deliveryPerson');

        if (token && deliveryPersonData) {
            try {
                const decoded = jwtDecode(token);
                if (decoded && decoded.role === 'deliveryPerson' && decoded.exp * 1000 > Date.now()) {
                    // ✅ If token is valid, set deliveryPerson state
                    setDeliveryPerson(JSON.parse(deliveryPersonData));
                } else {
                    // ✅ If token is invalid or expired, clear localStorage
                    localStorage.removeItem('deliveryToken');
                    localStorage.removeItem('deliveryPerson');
                    setDeliveryPerson(null);
                }
            } catch (err) {
                // ✅ Handle any errors in decoding the token
                console.error("Failed to decode token or load profile:", err);
                localStorage.removeItem('deliveryToken');
                localStorage.removeItem('deliveryPerson');
                setDeliveryPerson(null);
            }
        }
        // ✅ Set loading to false after checking the token
        setLoading(false);
    };

    useEffect(() => {
        checkDeliveryPersonStatus();
    }, []);

    const deliveryLogin = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/deliveryperson/login`, { email, password });
            localStorage.setItem('deliveryToken', res.data.token);
            // ✅ Store deliveryPerson data in localStorage
            localStorage.setItem('deliveryPerson', JSON.stringify(res.data.deliveryPerson));
            setDeliveryPerson(res.data.deliveryPerson);
            return res.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const deliveryLogout = () => {
        localStorage.removeItem('deliveryToken');
        localStorage.removeItem('deliveryPerson');
        setDeliveryPerson(null);
    };

    return (
        <DeliveryAuthContext.Provider value={{
            deliveryPerson,
            loading, // ✅ Provide loading state
            setDeliveryPerson,
            deliveryLogin,
            deliveryLogout,
        }}>
            {children}
        </DeliveryAuthContext.Provider>
    );
};