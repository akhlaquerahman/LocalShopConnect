// server/controllers/productController.js

const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinaryConfig');

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, originalPrice, category, productType, city } = req.body;
    const sellerId = req.user.id; // auth middleware से user ID मिलती है
    const image = req.file ? req.file.path : null;

    if (!image) {
        res.status(400);
        throw new Error('Image upload failed. Please try again.');
    }
    
    const newProduct = new Product({
        title,
        description,
        price,
        originalPrice,
        image,
        category, // ✅ Added category field
        productType,
        city,
        sellerId
    });
    
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product by ID
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
    // ✅ 'image' अब req.body में नहीं, बल्कि req.file.path में है
    const { title, description, price, originalPrice, category, productType, city } = req.body;
    const sellerId = req.user.id;
    const updatedFields = { 
        title, description, price, originalPrice, category, productType, city
    };

    if (req.file) {
        // ✅ अगर नई इमेज अपलोड हुई है तो उसे अपडेट करें
        updatedFields.image = req.file.path;
    }

    const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, sellerId: req.user.id }, // ✅ Ensure only the seller can update
        updatedFields,
        { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
        res.status(404);
        throw new Error('Product not found or not authorized to update');
    }
    
    res.json(updatedProduct);
});

// @desc    Delete a product by ID
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
    
    if (!deletedProduct) {
        res.status(404);
        throw new Error('Product not found or not authorized to delete');
    }
    
    res.json({ message: 'Product deleted successfully' });
});

// @desc    Get all products created by the logged-in admin
// @route   GET /api/admin/products/me
// @access  Private/Admin
exports.getAdminProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ sellerId: req.user.id });
    res.json(products);
});