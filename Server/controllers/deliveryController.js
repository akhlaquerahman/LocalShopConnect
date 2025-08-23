const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPerson');
const DeliveryRequest = require('../models/DeliveryRequest');

// @desc    Get delivery requests by city
// @route   GET /api/deliveryperson/requests?city=...
// @access  Private (delivery person only)
exports.getDeliveryRequests = asyncHandler(async (req, res) => {
    // Delivery person की city query parameter से प्राप्त करें
    const { city } = req.query;

    if (!city) {
        res.status(400);
        throw new Error('City is required to find delivery requests');
    }

    // उन orders को खोजें जो "Processing" status में हैं और जिनका shippingAddress का city match करता हो
    // साथ ही, सुनिश्चित करें कि उनका कोई delivery person assigned न हो
    const orders = await Order.find({
        status: 'Processing',
        'shippingAddress.city': { $regex: new RegExp(city, 'i') }, // Case-insensitive search
        deliveryPersonId: { $exists: false } // Only show unassigned orders
    })
    .populate('userId', 'name mobileNumber') // user details fetch करें
    .populate('products.productId', 'title description image') // product details fetch करें
    .populate('shopId', 'name shopName city mobileNumber') // shop details fetch करें
    .sort({ createdAt: -1 }); // Newest orders first

    res.status(200).json(orders);
});

// @desc    Accept a delivery request
// @route   PUT /api/deliveryperson/accept/:id
// @access  Private (delivery person only)
exports.acceptDeliveryRequest = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const deliveryPersonId = req.user.id; // auth middleware से user ID प्राप्त करें

    // Order को खोजें और update करें
    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Order को सिर्फ तभी accept करें जब वह 'Processing' में हो और unassigned हो
    if (order.status !== 'Processing' || order.deliveryPersonId) {
        res.status(400);
        throw new Error('This order cannot be accepted');
    }

    order.status = 'Accepted';
    order.deliveryPersonId = deliveryPersonId;

    await order.save();

    res.json({ message: 'Order accepted successfully', order });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body; // Frontend से नया स्टेटस प्राप्त करें
    const deliveryPersonId = req.user.id; // Authenticated delivery person की ID

    // ऑर्डर को उसकी ID और deliveryPersonId से खोजें
    const order = await Order.findOne({ _id: id, deliveryPersonId });

    if (!order) {
        res.status(404);
        throw new Error('Order not found or not assigned to you');
    }

    // Status transition logic को implement करें
    // यह सुनिश्चित करता है कि स्टेटस सही क्रम में अपडेट हो
    const validTransitions = {
        'Accepted': 'Shifted',
        'Shifted': 'Out for Delivery',
        'Out for Delivery': 'Delivered'
    };

    if (validTransitions[order.status] !== newStatus) {
        res.status(400);
        throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
    }

    // स्टेटस को अपडेट करें
    order.status = newStatus;
    await order.save();

    res.status(200).json({
        message: 'Order status updated successfully',
        order: order // अपडेटेड ऑर्डर को वापस भेजें
    });
});

// @desc    Get delivery orders for a specific delivery person
exports.getDeliveryOrders = asyncHandler(async (req, res) => {
    const deliveryPersonId = req.user.id; // auth middleware से delivery person ID

    // उन orders को खोजें जो इस delivery person को assign किए गए हैं
    // और जिनकी status 'Processing' या 'Cancelled' नहीं है
    const orders = await Order.find({
        deliveryPersonId: deliveryPersonId,
        // 👇 यहाँ 'Shifted' और 'Delivered' को भी शामिल करें
        status: { $in: ['Accepted', 'Shifted', 'Out for Delivery', 'Delivered'] } 
    })
    .populate('userId', 'name mobileNumber')
    .populate('products.productId', 'name image description price')
    .populate('shopId', 'name shopName city mobileNumber')
    .sort({ createdAt: -1 });

    res.status(200).json(orders);
});

// @desc    Send a delivery request to the seller
// @route   PUT /api/deliveryperson/request-to-deliver/:orderId
// @access  Private (delivery person only)
exports.sendDeliveryRequest = asyncHandler(async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const deliveryPersonId = req.user.id;

        // सुनिश्चित करें कि ऑर्डर अभी भी 'Processing' स्थिति में है
        const order = await Order.findById(orderId);
        if (!order || order.status !== 'Processing') {
            return res.status(400).json({ msg: 'This order is not available for delivery requests.' });
        }
        
        // ✅ 1. उस ऑर्डर के लिए पहले से कोई 'Pending' रिक्वेस्ट है या नहीं, इसकी जाँच करें।
        const existingPendingRequest = await DeliveryRequest.findOne({ 
            orderId, 
            status: 'Pending' 
        });

        if (existingPendingRequest) {
            return res.status(400).json({ msg: 'A pending request for this order already exists.' });
        }

        // ✅ 2. किसी भी स्टेटस के साथ, उस ऑर्डर के लिए मौजूदा रिक्वेस्ट को खोजें।
        //      यह जाँच करती है कि उस ऑर्डर के लिए कोई भी रिक्वेस्ट पहले भेजी गई है या नहीं।
        const existingRequest = await DeliveryRequest.findOne({ orderId });
        
        if (existingRequest) {
            // यदि रिक्वेस्ट मौजूद है, तो इसे वर्तमान डिलीवरी पर्सन को असाइन करें
            // और उसका स्टेटस 'Pending' पर सेट करें।
            // यह E11000 त्रुटि को रोकता है क्योंकि हम एक नया दस्तावेज़ नहीं बना रहे हैं।
            existingRequest.deliveryPersonId = deliveryPersonId;
            existingRequest.status = 'Pending';
            await existingRequest.save();
            return res.status(200).json({ msg: 'Delivery request sent successfully.' });
        }
        
        // ✅ 3. यदि कोई भी मौजूदा रिक्वेस्ट नहीं है, तो एक नया रिक्वेस्ट बनाएं।
        const newRequest = new DeliveryRequest({
            orderId,
            deliveryPersonId,
            status: 'Pending'
        });
        await newRequest.save();

        res.status(200).json({ msg: 'Delivery request sent successfully.' });

    } catch (err) {
        console.error(err.message);
        // MongoDB डुप्लिकेट कुंजी त्रुटि के लिए विशिष्ट प्रतिक्रिया
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Duplicate request found. Please contact support if you believe this is an error.' });
        }
        res.status(500).send('Server Error');
    }
});