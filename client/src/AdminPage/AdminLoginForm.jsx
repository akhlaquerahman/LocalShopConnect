// src/AdminPage/AdminLoginForm.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from '../context/AdminAuthContext';
import "../styles/LoginForm.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminLoginForm = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    city: "",
    category: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const navigate = useNavigate();
  const { adminLogin } = useContext(AdminAuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Admin Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/register`, formData);
      alert("Registration successful! Please log in.");
      setIsLoginView(true);
    } catch (err) {
      alert(err.response?.data?.message || "Admin Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-80 fade-in mt-5">
      <div className="card shadow p-4 login-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 text-danger">Seller {isLoginView ? "Login" : "Register"}</h2>
        
        {isLoginView ? (
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label>Email address</label>
              <input type="email" className="form-control" name="email" onChange={handleChange} required />
            </div>
            <div className="form-group mb-4">
              <label>Password</label>
              <input type="password" className="form-control" name="password" onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-danger w-100 animate-button mb-3">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3"><label>Name.</label><input type="text" className="form-control" name="name" placeholder="Enter Your Name." onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Shop Name.</label><input type="text" className="form-control" name="shopName" placeholder="Enter Your Shop Name." onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Shop Location.</label><input type="text" className="form-control" name="city" placeholder="City, District, State." onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Shop Category.</label><input type="text" className="form-control" name="category" placeholder="Electronics, Fashion Books etc." onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Email.</label><input type="email" className="form-control" name="email" placeholder="Enter Your email." onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Password.</label><input type="password" className="form-control" name="password" placeholder="Enter your Password." onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Mobile Number.</label><input type="text" className="form-control" name="mobileNumber" placeholder="Enter Your Mobile Number." onChange={handleChange} required /></div>
            <button type="submit" className="btn btn-success w-100 animate-button mb-3">Register</button>
          </form>
        )}
        
        <button onClick={() => setIsLoginView(!isLoginView)} className="btn btn-outline-secondary w-100">
          {isLoginView ? "New Seller? Register here" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLoginForm;