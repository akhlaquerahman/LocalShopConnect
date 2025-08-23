import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import '../styles/AdminProductList.css';

const API_URL = process.env.REACT_APP_API_URL;

const AdminProductListPage = () => {
    const { admin } = useContext(AdminAuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newProduct, setNewProduct] = useState({
        title: '',
        category: '',
        productType: '',
        description: '',
        price: '',
        originalPrice: '',
        city: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editingProductImage, setEditingProductImage] = useState('');

    const fetchProducts = useCallback(async () => {
        if (!admin) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/admin/products/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch products.');
            setLoading(false);
        }
    }, [admin]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files?.[0]);
        if (e.target.files?.length > 0) {
            setEditingProductImage('');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in newProduct) {
                formData.append(key, newProduct?.[key]);
            }
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const res = await axios.post(`${API_URL}/api/admin/products`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProducts([...products, res.data]);
            setNewProduct({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
            setImageFile(null);
            setIsAdding(false);
            setEditingProductImage('');
        } catch (err) {
            console.error('Error adding product:', err);
            setError('Failed to add product.');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/api/admin/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                setProducts(products.filter(product => product._id !== id));
            } catch (err) {
                console.error('Error deleting product:', err);
                setError('Failed to delete product.');
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingProductId(product._id);
        setNewProduct({
            ...product,
            price: product.price?.toString(),
            originalPrice: product.originalPrice?.toString()
        });
        setEditingProductImage(product.image);
        setIsAdding(false);
        setImageFile(null);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in newProduct) {
                formData.append(key, newProduct?.[key]);
            }
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (editingProductImage) {
                // If no new file is selected, but there was an old image, append its URL (backend needs to handle this)
                formData.append('image', editingProductImage);
            }

            await axios.put(`${API_URL}/api/admin/products/${editingProductId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchProducts();
            setEditingProductId(null);
            setNewProduct({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
            setImageFile(null);
            setEditingProductImage('');
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product.');
        }
    };

    if (loading) return <div className="loading-message">Loading products...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!admin) return <div className="auth-message">Please log in as an admin to view this page.</div>;

    return (
        <div className="admin-products-container">
            <div className="admin-products-header">
                <h3>Manage Products</h3>
                <button className="btn btn-success" onClick={() => {
                    setEditingProductId(null);
                    setNewProduct({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
                    setImageFile(null);
                    setIsAdding(!isAdding);
                    setEditingProductImage('');
                }}>
                    {isAdding ? 'Cancel Add' : '+ Add New Product'}
                </button>
            </div>

            {(isAdding || editingProductId) && (
                <div className="add-product-form-container">
                    <h4>{editingProductId ? 'Edit Product' : 'Add New Product'}</h4>
                    <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}>
                        <label htmlFor="productTitle">Product Title</label>
                        <input type="text" name="title" placeholder="Product Title" value={newProduct.title} onChange={handleNewProductChange} required />
                        <label htmlFor="productType">Product Type</label>
                        <input type="text" name="productType" placeholder="Product Type" value={newProduct.productType} onChange={handleNewProductChange} required />
                        <label htmlFor="productDescription">Description</label>
                        <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleNewProductChange} required></textarea>
                        <label htmlFor="productCategory">Category</label>
                        <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleNewProductChange} required />
                        <label htmlFor="productPrice">Price</label>
                        <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleNewProductChange} required />
                        <label htmlFor="productOriginalPrice">Original Price (Optional)</label>
                        <input type="number" name="originalPrice" placeholder="Original Price (Optional)" value={newProduct.originalPrice} onChange={handleNewProductChange} />
                        <label htmlFor="productImage">Image</label>
                        {editingProductId && editingProductImage && (
                            <div className="mb-2">
                                <img src={editingProductImage} alt="Current Product" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                            </div>
                        )}
                        <input type="file" name="image" onChange={handleImageChange} required={!editingProductId} />
                        <label htmlFor="productCity">Shop Location</label>
                        <input type="text" name="city" placeholder="City" value={newProduct.city} onChange={handleNewProductChange} required />
                        <button type="submit" className="btn btn-primary">
                            {editingProductId ? 'Update Product' : 'Add Product'}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => {
                            setEditingProductId(null);
                            setIsAdding(false);
                            setNewProduct({ title: '', category: '', productType: '', description: '', price: '', originalPrice: '', city: '' });
                            setImageFile(null);
                            setEditingProductImage('');
                        }}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
            
            <div className="admin-product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="product-card">
                            <Link to={`/product/${product._id}`}>
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.title}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="product-info">
                                <h5>{product.title}</h5>
                                <p>{product.productType}</p>
                                <p>{product.description}</p>
                                <p>{product.category}</p>
                                <p><i className="fa-solid fa-location-dot"></i> {product.city}</p>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-success fw-bold">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-decoration-line-through text-muted small">₹{product.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                            <div className="product-actions">
                                <button className="btn btn-warning" onClick={() => handleEditClick(product)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminProductListPage;