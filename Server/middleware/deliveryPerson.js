// server/middleware/deliveryPerson.js
module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'deliveryPerson') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Delivery Person permissions required.' });
    }
};