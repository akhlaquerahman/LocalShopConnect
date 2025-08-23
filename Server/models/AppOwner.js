// models/AppOwner.js
const mongoose = require('mongoose');

const AppOwnerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('AppOwner', AppOwnerSchema);