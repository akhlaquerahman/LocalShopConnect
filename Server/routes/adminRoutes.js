// server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { 
    adminRegister, 
    adminLogin,
    updateAdminProfile, 
    getAllOrders, 
    updateOrderStatus,
    getPendingDeliveryRequests, // ✅ New controller import
    acceptDeliveryRequest,      // ✅ New controller import
    rejectDeliveryRequest
} = require('../controllers/adminAuthController'); 
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Admin Authentication Routes
router.post('/register', adminRegister);
router.post('/login', adminLogin);

// Admin Profile Update Route
router.put('/profile', auth, adminMiddleware, updateAdminProfile);

// Admin Order Management Routes
router.get('/orders', auth, adminMiddleware, getAllOrders);
router.put('/orders/:id', auth, adminMiddleware, updateOrderStatus);

// ✅ New routes for Delivery Person requests
router.get('/delivery-requests', auth, adminMiddleware, getPendingDeliveryRequests);
router.put('/accept-delivery-request/:orderId', auth, adminMiddleware, acceptDeliveryRequest);
router.put('/reject-delivery-request/:orderId', auth, adminMiddleware, rejectDeliveryRequest);

module.exports = router;