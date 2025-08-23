// src/components/LoginForm.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import "../styles/LoginForm.css";

const API_URL = process.env.REACT_APP_API_URL;

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, credentials);
      const { token, user } = res.data;
      
      if (token) {
        login(token, user);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 fade-in">
      <div className="card shadow p-4 login-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 text-primary">User Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 animate-button mb-3">
            Login
          </button>
        </form>

        <button onClick={() => navigate("/register")} className="btn btn-outline-secondary w-100 mb-3">
          New user? Register here
        </button>

        <div className="text-center mb-3">
          <span className="text-muted">──── or ────</span>
        </div>

        <button className="btn btn-danger w-100">
          <i className="bi bi-google me-2"></i> Continue with Google
        </button>

        {/* ✅ Admin Login Link */}
        <div className="text-center mt-3">
            <Link to="/admin/login" className="btn btn-link text-decoration-none">
                Are you an Seller? Login here
            </Link>
        </div>
        
        {/* ✅ Delivery Person Login Link */}
        <div className="text-center mt-2">
            <Link to="/delivery/login" className="btn btn-link text-decoration-none">
                Are you a Delivery Person? Login here
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;