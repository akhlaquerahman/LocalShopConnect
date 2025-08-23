// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { createOrder, getUserOrders, getAdminOrders, getSingleOrder } = require('../controllers/orderController');

router.post('/', auth, createOrder);

router.get('/', auth, getUserOrders);

router.get('/admin-orders', auth, adminMiddleware, getAdminOrders);

router.get('/:id', auth, getSingleOrder); 


module.exports = router;