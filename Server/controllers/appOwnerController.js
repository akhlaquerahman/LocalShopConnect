// controllers/appOwnerController.js
const AppOwner = require('../models/AppOwner');
const User = require('../models/Users'); // User model import करें
const Admin = require('../models/Admin'); // Admin model import करें
const DeliveryPerson = require('../models/DeliveryPerson'); // DeliveryPerson model import करें
const Order = require('../models/Order'); // Order model import करें
const jwt = require('jsonwebtoken');

// Owner login logic
exports.loginOwner = async (req, res) => {
    const { email, password } = req.body;
    try {
        const owner = await AppOwner.findOne({ email });
        if (!owner || owner.password !== password) { // Production में password को hash करें
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            owner: {
                id: owner.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, appOwner: owner });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Owner Profile data fetch
exports.getOwnerData = async (req, res) => {
    try {
        // Find all users
        const users = await User.find().select('-password');

        // Find all sellers (admin)
        const sellers = await Admin.find().select('-password');

        // Find all delivery persons
        const deliveryPersons = await DeliveryPerson.find().select('-password');

        res.json({ users, sellers, deliveryPersons });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllOrdersForOwner = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email mobileNumber')
            .populate('products.productId', 'title category productType image price')
            .populate('deliveryPersonId', 'name mobileNumber email')
            .populate('shopId', 'name email') // Populate shopId to get seller details
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching all orders for app owner:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
