// src/AdminPage/AdminRoute.jsx

import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const AdminRoute = () => {
    const { admin, loading } = useContext(AdminAuthContext);

    // ✅ Wait for the loading state to become false before making a decision.
    if (loading) {
        return <div>Loading...</div>; // You can use a spinner or a loading message here
    }

    // ✅ If the admin is authenticated, render the child routes.
    // Otherwise, redirect them to the admin login page.
    return admin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;