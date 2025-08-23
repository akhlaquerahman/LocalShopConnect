// src/AdminPage/AdminProductManagement.jsx
import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const AdminProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
    const [imageFile, setImageFile] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editingProductImage, setEditingProductImage] = useState(null); // नया स्टेट
    const { admin, loading } = useContext(AdminAuthContext);
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        const token = localStorage.getItem('adminToken');
        if (!token || !admin) {
            console.error("Admin not authenticated. Cannot fetch products.");
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/api/admin/products/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching admin products:', err);
        }
    }, [admin]);

    useEffect(() => {
        if (!loading && admin) {
            fetchProducts();
        }
    }, [admin, loading, fetchProducts]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token) {
            console.error("No admin token found. Please log in.");
            return;
        }
        
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            await axios.post(`${API_URL}/api/admin/products`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
            setImageFile(null);
            fetchProducts();
            navigate('/');
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token || !editingProductId) {
            console.error("No admin token found or no product selected for editing.");
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (imageFile) {
            data.append('image', imageFile);
        } else if (editingProductImage) { // पुरानी इमेज को बनाए रखें अगर नई इमेज अपलोड न हो
            data.append('image', editingProductImage);
        }

        try {
            await axios.put(`${API_URL}/api/admin/products/${editingProductId}`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
            setImageFile(null);
            setEditingProductId(null);
            setEditingProductImage(null); // अपडेट के बाद इमेज प्रीव्यू साफ करें
            fetchProducts();
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleDelete = async (productId) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            console.error("No admin token found. Please log in.");
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Product deleted successfully");
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
      }
    };

    const handleEditClick = (product) => {
        setFormData(product);
        setImageFile(null);
        setEditingProductId(product._id);
        setEditingProductImage(product.image); // मौजूदा इमेज URL सेट करें
    };

    const handleCancelEdit = () => {
        setFormData({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
        setImageFile(null);
        setEditingProductId(null);
        setEditingProductImage(null); // कैंसिल करने पर इमेज प्रीव्यू साफ करें
    };

    return (
        <div className="container mt-5">
            <h2>Manage Your Products</h2>
            <div className="card p-4 mb-5">
                <h4>{editingProductId ? "Edit Product" : "Add New Product"}</h4>
                <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Product Type</label>
                        <input type="text" className="form-control" name="productType" value={formData.productType} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Original Price</label>
                        <input type="number" className="form-control" name="originalPrice" value={formData.originalPrice} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        {editingProductImage && (
                             <div className="mb-2">
                                <img src={editingProductImage} alt="Current Product" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                             </div>
                        )}
                        <input type="file" className="form-control" onChange={handleFileChange} required={!editingProductId} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Shop Location</label>
                        <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        {editingProductId ? "Update Product" : "Add Product"}
                    </button>
                    {editingProductId && (
                        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>
            <h3>Your Products</h3>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 mb-4" key={product._id}>
                        <div className="card h-100">
                            <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{product.title}</h5>
                                <p className="card-text">{product.productType}</p>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">{product.category}</p>
                                <p><i className="fa-solid fa-location-dot"></i> {product.city}</p>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-success fw-bold">₹{product.price}</span>
                                <span className="text-decoration-line-through text-muted small">₹{product.originalPrice}</span>
                                </div>
                                <button className="btn btn-warning me-2" onClick={() => handleEditClick(product)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProductManagement;