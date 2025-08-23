// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const auth = require('../middleware/auth');
const { register, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// ✅ Register Route
router.post('/register', register);

// ✅ Login Route
router.post('/login', login);

// server/routes/authRoutes.js
router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

// Update user address
// ✅ Update user profile (already exists, but make sure it works with the new model)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber; // Update mobile number
    
    await user.save();
    // Return updated user object to the frontend
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add new address
// POST /api/auth/addresses
router.post('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update an existing address
// PUT /api/auth/addresses/:id
router.put('/addresses/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addressToUpdate = user.addresses.id(req.params.id);
    if (!addressToUpdate) return res.status(404).json({ message: 'Address not found' });
    Object.assign(addressToUpdate, req.body);
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete an address
// DELETE /api/auth/addresses/:id
router.delete('/addresses/:id', auth, async (req, res) => {
  try {
    // 1. Find the user by ID from the `auth` middleware
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Remove the address with the specified ID
    user.addresses.pull(req.params.id);

    // 3. Save the updated user document
    await user.save();

    // 4. Return the updated user object to the frontend
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
