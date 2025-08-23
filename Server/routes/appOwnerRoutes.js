// routes/appOwnerRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Auth middleware
const { loginOwner, getOwnerData, getAllOrdersForOwner } = require('../controllers/appOwnerController');

// @route   POST /api/owner/login
// @desc    App Owner Login
router.post('/login', loginOwner);

// @route   GET /api/owner/data
// @desc    Get all users, sellers, and delivery persons
// @access  Private (only for App Owner)
router.get('/data', auth, getOwnerData);

// @route   GET /api/owner/orders
// @desc    Get all orders for the App Owner
router.get('/orders', auth, getAllOrdersForOwner);

module.exports = router;