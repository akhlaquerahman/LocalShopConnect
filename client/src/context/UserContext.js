// src/context/UserContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL;

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // Add token state

  const verifyToken = async (token) => {
    try {
      await axios.get(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (err) {
      try {
        jwtDecode(token);
        return true;
      } catch (decodeErr) {
        return false;
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const isValid = await verifyToken(token);
        if (isValid) {
          setUser(JSON.parse(userData));
          setToken(token); // Set the token in state
        } else {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(token); // Set the token in state
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null); // Clear token
  };


  if (loading) {
    return <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <UserContext.Provider value={{ user, token, login, logout, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};