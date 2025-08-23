// src/components/RegisterForm.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import '../styles/RegisterForm.css';

const API_URL = process.env.REACT_APP_API_URL;

const RegisterForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    password: "",
    address: {
      name: "", // Renamed addressName to name for consistency with backend
      phone: "",
      village: "",
      city: "",
      pinCode: "",
      district: "",
      state: ""
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle both top-level and nested address fields
    setFormData(prev => {
        if (["name", "phone", "village", "city", "pinCode", "district", "state"].includes(name)) {
            return {
                ...prev,
                address: { ...prev.address, [name]: value }
            };
        } else {
            return { ...prev, [name]: value };
        }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.userName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        address: formData.address,
      };

      const res = await axios.post(`${API_URL}/api/auth/register`, payload);
      const { token, user } = res.data;

      if (token) {
        login(token, user);
        alert("🎉 Registration successful!");
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeInDown">
      <div className="row justify-content-center">
        <div className="col-lg-10"> {/* ✅ Larger column for the two-column layout */}
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4 text-primary">📝 Create Your Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="row"> {/* ✅ Main row for the two columns */}
                {/* --- Your Details Column --- */}
                <div className="col-md-6 mb-4">
                  <h4 className="border-bottom pb-2 mb-3 text-secondary">👤 Your Details</h4>
                  
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label">Full Name</label>
                    <input
                      id="userName"
                      name="userName"
                      className="form-control"
                      placeholder="Your Full Name"
                      onChange={handleChange}
                      value={formData.userName}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      className="form-control"
                      placeholder="Your Mobile Number"
                      onChange={handleChange}
                      value={formData.mobileNumber}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      value={formData.email}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={handleChange}
                      value={formData.password}
                      required
                    />
                  </div>
                </div>

                {/* --- Shipping Address Column --- */}
                <div className="col-md-6 mb-4">
                  <h4 className="border-bottom pb-2 mb-3 text-secondary">📦 Shipping Address</h4>

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Recipient Name</label>
                    <input
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Recipient Name"
                      onChange={handleChange}
                      value={formData.address.name}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      value={formData.address.phone}
                      required
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="village" className="form-label">House No./Village</label>
                      <input
                        id="village"
                        name="village"
                        className="form-control"
                        placeholder="House No./Village"
                        onChange={handleChange}
                        value={formData.address.village}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        id="city"
                        name="city"
                        className="form-control"
                        placeholder="City"
                        onChange={handleChange}
                        value={formData.address.city}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="pinCode" className="form-label">Pin Code</label>
                      <input
                        id="pinCode"
                        name="pinCode"
                        className="form-control"
                        placeholder="Pin Code"
                        onChange={handleChange}
                        value={formData.address.pinCode}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="district" className="form-label">District</label>
                      <input
                        id="district"
                        name="district"
                        className="form-control"
                        placeholder="District"
                        onChange={handleChange}
                        value={formData.address.district}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      id="state"
                      name="state"
                      className="form-control"
                      placeholder="State"
                      onChange={handleChange}
                      value={formData.address.state}
                      required
                    />
                  </div>
                </div>
              </div> {/* End of main row */}

              <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                🚀 Register Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;