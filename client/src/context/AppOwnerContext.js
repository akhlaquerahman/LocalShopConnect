// src/context/AppOwnerContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AppOwnerAuthContext = createContext();

export const AppOwnerAuthContextProvider = ({ children }) => {
    const [appOwner, setAppOwner] = useState(null);

    useEffect(() => {
        const storedAppOwner = localStorage.getItem('appOwner');
        if (storedAppOwner) {
            setAppOwner(JSON.parse(storedAppOwner));
        }
    }, []);

    const appOwnerLogin = (ownerData) => {
        setAppOwner(ownerData);
        localStorage.setItem('appOwner', JSON.stringify(ownerData));
    };

    const appOwnerLogout = () => {
        setAppOwner(null);
        localStorage.removeItem('appOwner');
        localStorage.removeItem('appOwnerToken');
    };

    return (
        <AppOwnerAuthContext.Provider value={{ appOwner, appOwnerLogin, appOwnerLogout }}>
            {children}
        </AppOwnerAuthContext.Provider>
    );
};