// src/pages/EditProduct.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: '',
    category: '',
    productType: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState(null); // Multer के लिए नया स्टेट
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product details for editing
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  
  // New handler for file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("You are not authorized to edit this product.");
      return;
    }
    
    // Create FormData object to handle text and file data
    const formData = new FormData();
    for (const key in product) {
      // Don't append the image URL if a new file is selected
      if (key === 'image' && imageFile) {
          continue;
      }
      formData.append(key, product[key]);
    }
    
    // Append the new image file if it exists
    if (imageFile) {
        formData.append('image', imageFile);
    }

    // Send PUT request to the admin product route with the token
    axios.put(`${API_URL}/api/admin/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // Required for Multer
      }
    })
    .then(res => {
      alert("Product updated successfully!");
      navigate(`/product/${id}`);
    })
    .catch(err => {
      console.error("Update error:", err.response?.data?.message || err.message);
      alert(`❌ Failed to update product: ${err.response?.data?.message || 'Server error'}`);
    });
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="container mt-5">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            className="form-control"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            id="category"
            type="text"
            name="category"
            className="form-control"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productType" className="form-label">Product Type</label>
          <input
            id="productType"
            type="text"
            name="productType"
            className="form-control"
            value={product.productType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            id="price"
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="originalPrice" className="form-label">Original Price</label>
          <input
            id="originalPrice"
            type="number"
            name="originalPrice"
            className="form-control"
            value={product.originalPrice}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          {product.image && !imageFile && (
            <div className="mb-2">
              <img src={product.image} alt="Current Product" style={{ maxWidth: '50px', maxHeight: '50px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
          )}
          <input
            id="image"
            type="file"
            name="image"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;