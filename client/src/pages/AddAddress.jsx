// src/pages/AddAddress.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL;

const AddAddress = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    city: '',
    pinCode: '',
    district: '',
    state: ''
  });
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/addresses`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // ✅ CORRECT: Update both context and localStorage
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate('/profile');
    } catch (err) {
      console.error('Error adding address:', err);
    }
  };

  return (
    // ✅ Improved UI with Bootstrap
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title text-center mb-0">Add New Address</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* ✅ Full Name Field */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                {/* ✅ Phone Number Field */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                {/* ✅ Village & City in a single row */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="village" className="form-label">Village</label>
                    <input
                      type="text"
                      id="village"
                      name="village"
                      className="form-control"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="Enter village"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                </div>

                {/* ✅ Pin Code & District in a single row */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="pinCode" className="form-label">Pin Code</label>
                    <input
                      type="text"
                      id="pinCode"
                      name="pinCode"
                      className="form-control"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Enter pin code"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="district" className="form-label">District</label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      className="form-control"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Enter district"
                      required
                    />
                  </div>
                </div>
                
                {/* ✅ State Field */}
                <div className="mb-3">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;