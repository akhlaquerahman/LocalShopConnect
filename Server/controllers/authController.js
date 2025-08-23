const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// ✅ Updated Token Generator with name & email
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,  // Include name in token
      email: user.email, // Include email in token
      mobileNumber: user.mobileNumber // Include mobile number in token
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

exports.register = async (req, res) => {
  const { name, email, password, address, mobileNumber } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    // Create the user with the new addresses array
    const newUser = await User.create({
      name,
      email,
      mobileNumber,
      password,
      addresses: address ? [address] : [] // If address is provided, add it to the array
    });
    
    const token = generateToken(newUser);
    res.status(201).json({ token, user: newUser }); // Return the full user object
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ 
      token, 
      user: {  // Send back user data
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        addresses: user.addresses
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

