// server/routes/deliveryPersonRoutes.js

const express = require('express');
const router = express.Router();
const { 
    deliveryPersonRegister, 
    deliveryPersonLogin,
    updateDeliveryPersonProfile 
} = require('../controllers/deliveryPersonAuthController'); 
const { 
    getDeliveryRequests, 
    sendDeliveryRequest, // ✅ Updated from acceptDeliveryRequest
    getDeliveryOrders, 
    updateOrderStatus 
} = require('../controllers/deliveryController');
const auth = require('../middleware/auth');
const deliveryPersonMiddleware = require('../middleware/deliveryPerson');

// Delivery Person Authentication Routes
router.post('/register', deliveryPersonRegister);
router.post('/login', deliveryPersonLogin);

// Delivery Person Profile Update Route
router.put('/profile', auth, deliveryPersonMiddleware, updateDeliveryPersonProfile);

// Delivery Person routes
router.get('/requests', auth, deliveryPersonMiddleware, getDeliveryRequests);

// ✅ New route to send a delivery request
router.put('/request-to-deliver/:orderId', auth, deliveryPersonMiddleware, sendDeliveryRequest);

// New Route to update an order's status
router.put('/orders/:id/status', auth, deliveryPersonMiddleware, updateOrderStatus);

// New Route to get all assigned orders for a delivery person
router.get('/orders', auth, deliveryPersonMiddleware, getDeliveryOrders);

module.exports = router;