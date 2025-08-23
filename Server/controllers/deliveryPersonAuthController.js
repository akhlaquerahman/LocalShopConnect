// server/controllers/deliveryPersonAuthController.js
const DeliveryPerson = require('../models/DeliveryPerson');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); 
const DeliveryRequest = require('../models/DeliveryRequest');
const deliveryauth = require('../middleware/deliveryPerson');

const generateToken = (deliveryPerson) => {
    return jwt.sign(
        { id: deliveryPerson._id, email: deliveryPerson.email, role: 'deliveryPerson' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// Delivery Person Registration
exports.deliveryPersonRegister = asyncHandler(async (req, res) => {
    const { name, email, password, mobileNumber, age, gender, city } = req.body;
    const deliveryPersonExists = await DeliveryPerson.findOne({ email });

    if (deliveryPersonExists) {
        res.status(400);
        throw new Error('Delivery Person already exists');
    }

    const newDeliveryPerson = await DeliveryPerson.create({ name, email, password, mobileNumber, age, gender, city });
    const token = generateToken(newDeliveryPerson);
    
    res.status(201).json({ 
        token, 
        deliveryPerson: {
            _id: newDeliveryPerson._id,
            name: newDeliveryPerson.name,
            email: newDeliveryPerson.email,
            mobileNumber: newDeliveryPerson.mobileNumber,
            age: newDeliveryPerson.age,
            gender: newDeliveryPerson.gender,
            city: newDeliveryPerson.city,
        }
    });
});

// Delivery Person Login
exports.deliveryPersonLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const deliveryPerson = await DeliveryPerson.findOne({ email });

    if (deliveryPerson && (await deliveryPerson.matchPassword(password))) {
        const token = generateToken(deliveryPerson);
        res.json({ 
            token, 
            deliveryPerson: {
                _id: deliveryPerson._id,
                name: deliveryPerson.name,
                email: deliveryPerson.email,
                mobileNumber: deliveryPerson.mobileNumber,
                age: deliveryPerson.age,
                gender: deliveryPerson.gender,
                city: deliveryPerson.city,
            }
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// Update Delivery Person Profile (Optional, but good to have)
exports.updateDeliveryPersonProfile = asyncHandler(async (req, res) => {
    const { name, email, mobileNumber, age, gender, city } = req.body;
    const deliveryPerson = await DeliveryPerson.findById(req.user.id);

    if (deliveryPerson) {
        deliveryPerson.name = name || deliveryPerson.name;
        deliveryPerson.mobileNumber = mobileNumber || deliveryPerson.mobileNumber;
        deliveryPerson.email = email || deliveryPerson.email; // ✅ Fixed line
        deliveryPerson.age = age || deliveryPerson.age;
        deliveryPerson.gender = gender || deliveryPerson.gender;
        deliveryPerson.city = city || deliveryPerson.city;

        const updatedDeliveryPerson = await deliveryPerson.save();
        res.json({
            message: 'Profile updated successfully',
            deliveryPerson: {
                _id: updatedDeliveryPerson._id,
                name: updatedDeliveryPerson.name,
                email: updatedDeliveryPerson.email,
                mobileNumber: updatedDeliveryPerson.mobileNumber,
                age: updatedDeliveryPerson.age,
                gender: updatedDeliveryPerson.gender,
                city: updatedDeliveryPerson.city,
            }
        });
    } else {
        res.status(404);
        throw new Error('Delivery Person not found');
    }
});
exports.acceptDeliveryRequest = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const deliveryPersonId = req.user.id;

        const existingRequest = await DeliveryRequest.findOne({ orderId });
        if (existingRequest) {
            return res.status(400).json({ msg: 'Request for this order has already been sent.' });
        }

        // नया अनुरोध बनाएं
        const newRequest = new DeliveryRequest({
            orderId,
            deliveryPersonId,
            status: 'Pending'
        });
        await newRequest.save();

        res.status(200).json({ msg: 'Delivery request sent successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});