// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth'); // assuming this middleware correctly adds req.user.userId

// Add to cart
// Add to cart route
router.post('/', auth, async (req, res) => {
    const { productId, name, price, image, quantity } = req.body;
    const userId = req.user.userId;

    try {
        // Validate input
        if (!productId || !name || price === undefined || !image) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingItem = await Cart.findOne({ productId, userId });

        if (existingItem) {
            existingItem.quantity += quantity || 1;
            await existingItem.save();
            return res.json(existingItem);
        }

        const newCartItem = new Cart({
            productId,
            userId,
            name,
            price,
            image,
            quantity: quantity || 1,
            timestamp: new Date()
        });

        await newCartItem.save();
        res.status(201).json(newCartItem);
    } catch (err) {
        console.error("Cart add error:", err);
        res.status(500).json({ 
            message: 'Error adding to cart',
            error: err.message 
        });
    }
});

// Get cart items for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user.userId }); // Find all cart items for the specific user
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

// Delete cart item (you need to complete this)
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!result) {
            return res.status(404).json({ message: 'Cart item not found or you are not authorized to delete it.' });
        }
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting item from cart' });
    }
});

// Update cart item quantity
router.patch('/:id', auth, async (req, res) => {
    const { quantity } = req.body;
    try {
        const cartItem = await Cart.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { quantity },
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found or you are not authorized to update it.' });
        }
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ message: 'Error updating cart item quantity' });
    }
});

// Clear the entire cart for a user
router.delete('/clear', auth, async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.user.userId });
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing cart' });
    }
});

module.exports = router;