import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import {useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const EditAddressPage = () => {
  const { user, login } = useContext(UserContext);
  const { addressId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.address?.name || "",
    village: user?.address?.village || "",
    city: user?.address?.city || "",
    district: user?.address?.district || "",
    state: user?.address?.state || "",
    pinCode: user?.address?.pinCode || "",
    phone: user?.address?.phone || ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/auth/addresses/${addressId}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      login(res.data.token, res.data.user);
      navigate("/checkout");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating address");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Edit Delivery Address</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Recipient Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Village</label>
              <input
                type="text"
                className="form-control"
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-control"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">PIN Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Save Address
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAddressPage;