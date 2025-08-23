// Server/models/Users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define a separate schema for the address
const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }, // Changed to String for better handling
  village: { type: String, required: true },
  city: { type: String, required: true },
  pinCode: { type: String, required: true }, // Changed to String
  district: { type: String, required: true },
  state: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Change address to an array of addressSchema
  addresses: [addressSchema]
});

// ... (rest of the code is the same)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);