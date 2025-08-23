// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ New route: Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    // Convert to title case for better matching (electronics -> Electronics)
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    
    const products = await Product.find({ 
      category: { $regex: formattedCategory, $options: 'i' } 
    }).populate('sellerId', 'name shopName');
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
// ✅ सबसे पहले 'search' route रखें
// Search products by type (Public Route)
router.get('/search', async (req, res) => {
    try {
        const { type } = req.query; // URL से 'type' क्वेरी पैरामीटर लें

        if (!type) {
            return res.status(400).json({ msg: 'Please provide a product type to search for.' });
        }

        // MongoDB में case-insensitive खोज करें
        const products = await Product.find({ 
            productType: { $regex: type, $options: 'i' } 
        });

        if (products.length === 0) {
            return res.status(404).json({ msg: 'No products found for this type.' });
        }

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET all products (Public Route)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).populate('sellerId', 'email');;
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a single product by ID (Public Route)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;