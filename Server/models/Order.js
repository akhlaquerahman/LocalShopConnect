// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    productType: {
      type: String,
      required: true
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // ✅ New field to store the delivery person ID
    deliveryPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPerson',
        required: false, // यह optional है, जब तक accept नहीं होता
        index: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    shippingAddress: {
        // ... your address fields
    },
    status: {
        type: String,
        // ✅ Updated enum for better status tracking
        enum: ['Processing', 'Accepted', 'Shifted', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    estimatedDeliveryDate: { // ✅ यह नया फ़ील्ड है
        type: Date,
    },
}, { timestamps: true });

// Add index to prevent similar orders
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);