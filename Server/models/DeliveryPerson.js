// Server/models/DeliveryPerson.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const deliveryPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

// Password hashing se pehle
deliveryPersonSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password match karne ka method
deliveryPersonSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('DeliveryPerson', deliveryPersonSchema);