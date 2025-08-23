// client/src/AdminPage/DeliveryLoginForm.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DeliveryAuthContext } from '../context/DeliveryAuthContext';
import "../styles/LoginForm.css";

const API_URL = process.env.REACT_APP_API_URL;

const DeliveryPersonLoginForm = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    age: "",
    gender: "",
    city: "",
  });
  const navigate = useNavigate();
  const { deliveryLogin } = useContext(DeliveryAuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await deliveryLogin(formData.email, formData.password);
      navigate("/"); // Redirect to home after login
    } catch (err) {
      alert(err.response?.data?.message || "Delivery Person Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, mobileNumber, age, gender, city } = formData;
      await axios.post(`${API_URL}/api/deliveryperson/register`, { name, email, password, mobileNumber, age, gender, city });
      alert("Registration successful! Please log in.");
      setIsLoginView(true);
    } catch (err) {
      alert(err.response?.data?.message || "Delivery Person Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-95 fade-in mt-5">
      <div className="card shadow p-4 login-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Delivery Person {isLoginView ? "Login" : "Register"}</h2>
        
        {isLoginView ? (
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3"><label>Email address</label><input type="email" className="form-control" name="email" onChange={handleChange} required /></div>
            <div className="form-group mb-4"><label>Password</label><input type="password" className="form-control" name="password" onChange={handleChange} required /></div>
            <button type="submit" className="btn btn-primary w-100 animate-button mb-3">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3"><label>Name</label><input type="text" className="form-control" name="name" onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Email</label><input type="email" className="form-control" name="email" onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Password</label><input type="password" className="form-control" name="password" onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Mobile Number</label><input type="text" className="form-control" name="mobileNumber" onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Age</label><input type="number" className="form-control" name="age" onChange={handleChange} required /></div>
            <div className="form-group mb-3"><label>Gender</label><select className="form-control" name="gender" onChange={handleChange} required><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
            <div className="form-group mb-3"><label>City</label><input type="text" className="form-control" name="city" onChange={handleChange} required /></div>
            <button type="submit" className="btn btn-success w-100 animate-button mb-3">Register</button>
          </form>
        )}
        
        <button onClick={() => setIsLoginView(!isLoginView)} className="btn btn-outline-secondary w-100">
          {isLoginView ? "New Delivery Person? Register here" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default DeliveryPersonLoginForm;