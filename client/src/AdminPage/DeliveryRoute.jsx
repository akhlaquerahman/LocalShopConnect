import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { DeliveryAuthContext } from '../context/DeliveryAuthContext'; // ✅ Import the DeliveryAuthContext

const DeliveryPersonRoute = () => {
    const { deliveryPerson, loading } = useContext(DeliveryAuthContext); // ✅ Use the DeliveryAuthContext to get deliveryPerson and loading state

    // ✅ wait for the loading state to finish
    if (loading) {
        return <div>Loading...</div>; // show a loading state while checking auth
    }

    // ✅ If deliveryPerson is not found, redirect to login page
    return deliveryPerson ? <Outlet /> : <Navigate to="/delivery/login" />;
};

export default DeliveryPersonRoute;