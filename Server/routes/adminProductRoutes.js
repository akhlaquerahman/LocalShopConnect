// server/routes/adminProductRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer')
const { storage } = require('../config/cloudinaryConfig');
const { 
    createProduct,
    updateProduct,
    deleteProduct,
    getAdminProducts 
} = require('../controllers/productController'); // ✅ products के लिए controller फ़ाइल से import करें

const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// ✅ Multer middleware को configure करें
const upload = multer({ storage: storage });

// Add New Product
router.post('/', auth, adminMiddleware, upload.single('image'), createProduct);

// Update a Product
router.put('/:id', auth, adminMiddleware, upload.single('image'), updateProduct);

// Delete a Product
router.delete('/:id', auth, adminMiddleware, deleteProduct);

// Get All Products created by the logged-in Admin
router.get('/me', auth, adminMiddleware, getAdminProducts);

module.exports = router;