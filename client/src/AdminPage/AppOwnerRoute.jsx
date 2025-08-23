// src/AppOwner/AppOwnerRoute.jsx
import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppOwnerAuthContext } from '../context/AppOwnerContext';

const AppOwnerRoute = () => {
    // AppOwnerAuthContext से appOwner की स्थिति प्राप्त करें
    const { appOwner } = useContext(AppOwnerAuthContext);

    // यदि appOwner मौजूद है, तो प्रोटेक्टेड कंपोनेंट को रेंडर करें,
    // अन्यथा, login पेज पर रीडायरेक्ट करें
    return appOwner ? <Outlet /> : <Navigate to="/app-owner/login" />;
};

export default AppOwnerRoute;
