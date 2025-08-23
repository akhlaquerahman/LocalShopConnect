const Order = require('../models/Order');
const User = require('../models/Users');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const moment = require('moment'); // ✅ moment लाइब्रेरी को आयात करें
const asyncHandler = require('express-async-handler'); 

const DELIVERY_FEE = 10; // ✅ Delivery fee को यहां define करें

exports.createOrder = asyncHandler(async (req, res) => {
    const { products, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid products data' 
        });
    }

    const productIds = products.map(p => p.productId?.toString());
    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();

    const dbProductMap = dbProducts.reduce((map, product) => {
        map[product._id.toString()] = product;
        return map;
    }, {});
    
    let subtotal = 0;
    const orderProducts = [];
    let shopId = null;

    for (const item of products) {
        const product = dbProductMap[item.productId.toString()];

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with ID ${item.productId} not found.`
            });
        }

        if (!shopId) {
            shopId = product.sellerId;
        } else if (shopId.toString() !== product.sellerId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'All products in an order must be from the same seller.'
            });
        }

        // ✅ Subtotal की गणना करें
        subtotal += product.price * item.quantity;

        orderProducts.push({
            productId: product._id,
            name: product.title,
            productType: product.productType,
            category: product.category,
            quantity: item.quantity,
            price: product.price,
            image: product.image
        });
    }

    if (!shopId) {
        return res.status(404).json({
            success: false,
            message: 'No shop information found for the products.'
        });
    }

    // ✅ Total amount की गणना करें (subtotal + delivery fee)
    const totalAmount = subtotal + DELIVERY_FEE;

    const now = moment();
    const estimatedDeliveryDate = now.add(2, 'days').set({
        hour: 21, 
        minute: 0,
        second: 0,
    }).toDate();

    const orderData = {
        userId: req.user.userId,
        products: orderProducts,
        totalAmount: totalAmount, // ✅ Updated totalAmount
        shippingAddress: shippingAddress,
        shopId: shopId,
        estimatedDeliveryDate: estimatedDeliveryDate,
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    res.status(201).json({
        success: true,
        order: savedOrder
    });
});

// @desc      Get all orders for user
// @route     GET /api/orders
// @access    Private
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .sort({ orderDate: -1 })
            .populate('products.productId', 'name price image')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (err) {
        console.error('Error fetching orders:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Server Error: Failed to fetch orders.'
        });
    }
};

exports.getAdminOrders = async (req, res) => {
    try {
        // auth middleware से मिली user ID का उपयोग करें
        const sellerId = req.user.id; 

        // sellerId फ़ील्ड का उपयोग करके प्रोडक्ट खोजें
        const products = await Product.find({ sellerId: sellerId }).select('_id');
        const productIds = products.map(product => product._id);

        const orders = await Order.find({
            'products.productId': { $in: productIds }
        })
        .populate('userId', 'name email mobileNumber')
        .populate('products.productId', 'title category productType description image price')
        .populate('deliveryPersonId', 'name mobileNumber email')
        .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching admin orders:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single order by ID
exports.getSingleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.userId;

        const order = await Order.findById(orderId)
            .populate('products.productId')
            .populate('deliveryPersonId', 'name mobileNumber'); 

        // Check if order exists
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the authenticated user is the owner of the order
        if (order.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error('Error fetching single order:', err);
        res.status(500).json({ message: 'Server error' });
    }
};