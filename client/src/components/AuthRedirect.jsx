// client/src/components/AuthRedirect.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { DeliveryAuthContext } from '../context/DeliveryAuthContext';
import { AppOwnerAuthContext } from '../context/AppOwnerContext';

function AuthRedirect({ children }) {
  const { user } = useContext(UserContext);
  const { admin } = useContext(AdminAuthContext);
  const { deliveryPerson } = useContext(DeliveryAuthContext);
  const { appOwner } = useContext(AppOwnerAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if user, admin, or deliveryPerson is logged in, redirect them to the home page
    if (user || admin || deliveryPerson || appOwner) {
      // Redirect to home page if already logged in
      navigate('/');
    }
  }, [user, admin, deliveryPerson, appOwner, navigate]);

  return <>{children}</>;
}

export default AuthRedirect;