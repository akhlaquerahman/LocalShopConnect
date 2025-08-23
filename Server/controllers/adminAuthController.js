// server/controllers/adminAuthController.js

const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler'); 
const DeliveryRequest = require('../models/DeliveryRequest');

const generateToken = (admin) => {
    return jwt.sign(
        { id: admin._id, email: admin.email, role: 'admin', name: admin.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// Admin Registration
exports.adminRegister = asyncHandler(async (req, res) => {
    const { name, email, password, shopName, city, category, mobileNumber } = req.body;
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    const newAdmin = await Admin.create({ name, email, password, shopName, city, category, mobileNumber });
    const token = generateToken(newAdmin);
    // ✅ Registration के बाद भी साफ-सुथरा admin object भेजें
    res.status(201).json({ 
        token, 
        admin: {
            _id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email,
            shopName: newAdmin.shopName,
            city: newAdmin.city,
            category: newAdmin.category,
            mobileNumber: newAdmin.mobileNumber,
        }
    });
});

// Admin Login
exports.adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
        const token = generateToken(admin);
        res.json({ 
            token, 
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                shopName: admin.shopName,
                city: admin.city,
                category: admin.category,
                mobileNumber: admin.mobileNumber,
            }
        });
        console.log("Successfull seller login")
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// Admin Profile Update
exports.updateAdminProfile = asyncHandler(async (req, res) => {
    const { name, shopName, city, category, mobileNumber, email } = req.body;
    const admin = await Admin.findById(req.user.id);
    
    if (admin) {
        admin.name = name || admin.name;
        admin.shopName = shopName || admin.shopName;
        admin.mobileNumber = mobileNumber || admin.mobileNumber;
        admin.city = city || admin.city;
        admin.category = category || admin.category;
        admin.email = email || admin.email;
        
        const updatedAdmin = await admin.save();
        res.json({
            message: 'Profile updated successfully',
            admin: {
                _id: updatedAdmin._id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
                shopName: updatedAdmin.shopName, // ✅ Ensure this is included
                city: updatedAdmin.city, // ✅ Ensure this is included
                category: updatedAdmin.category, // ✅ Ensure this is included
                mobileNumber: updatedAdmin.mobileNumber, // ✅ Ensure this is included
            }
        });
    } else {
        res.status(404);
        throw new Error('Admin not found');
    }
});

// ✅ Get All Orders (Modified to show all orders)
exports.getAllOrders = asyncHandler(async (req, res) => {
    // Note: This function name might be confusing. It should be fetching all orders from all shops.
    // If you want a dashboard for a specific admin's orders, you should use getAdminSpecificOrders.
    // Based on your previous request, AdminOrders.jsx fetches ALL orders, so this is correct.
    const orders = await Order.find({})
        .populate('userId', 'name email mobileNumber')
        .populate('deliveryPersonId', 'name email mobileNumber')
        .populate('products.productId', 'title category productType description image price')
        .populate('shopId', 'name shopName city mobileNumber')
        .sort({ createdAt: -1 });

    res.json(orders);
});

// ✅ Update Order Status (Modified to handle `deliveryPersonId` as well)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

// ✅ New function to get pending delivery requests for a specific admin's orders
exports.getPendingDeliveryRequests = asyncHandler(async (req, res) => {
    const adminId = req.user.id;
    try {
        const requests = await DeliveryRequest.find({ status: 'Pending' })
            .populate({
                path: 'orderId',
                match: { shopId: adminId } // Only get requests for this admin's orders
            })
            .populate('deliveryPersonId', 'name mobileNumber');

        // Filter out requests where orderId is null (due to the match filter)
        const filteredRequests = requests.filter(req => req.orderId);
        res.json(filteredRequests);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ✅ New function to accept a delivery request and assign the order
// ✅ Add the rejectDeliveryRequest function here
exports.rejectDeliveryRequest = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { deliveryPersonId } = req.body;

    const request = await DeliveryRequest.findOne({ orderId, deliveryPersonId });

    if (!request) {
        res.status(404);
        throw new Error('Delivery request not found.');
    }

    request.status = 'Rejected';
    await request.save();

    res.status(200).json({ message: 'Delivery request rejected successfully.' });
});

// ✅ Add the acceptDeliveryRequest function here as well
exports.acceptDeliveryRequest = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const { deliveryPersonId } = req.body; // Assuming admin sends this in the body

    const order = await Order.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.status !== 'Processing' || order.deliveryPersonId) {
        res.status(400);
        throw new Error('This order cannot be accepted');
    }

    order.status = 'Accepted';
    order.deliveryPersonId = deliveryPersonId;
    await order.save();
    
    // Also update the request status to Accepted
    const request = await DeliveryRequest.findOne({ orderId, deliveryPersonId });
    if (request) {
        request.status = 'Accepted';
        await request.save();
    }

    res.json({ message: 'Order accepted successfully', order });
});