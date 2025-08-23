// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  image: String,
  category: String,
  productType: String,
  city: String,
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
}, {timestamps: true
  
});

module.exports = mongoose.model('Product', productSchema);