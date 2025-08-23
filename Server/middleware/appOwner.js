// middleware/appOwner.js
const jwt = require('jsonwebtoken');
const AppOwner = require('../models/AppOwner');

module.exports = async function(req, res, next) {
    // Auth middleware से मिला हुआ token प्राप्त करें
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // token को सत्यापित करें
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // AppOwner model में user id खोजें
        const owner = await AppOwner.findById(decoded.user.id);

        if (!owner) {
            return res.status(401).json({ msg: 'Not an App Owner, authorization denied' });
        }
        
        // Request object में owner को जोड़ें
        req.owner = owner;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};