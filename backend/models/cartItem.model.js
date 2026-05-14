// models/cartItem.model.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number
});

module.exports = mongoose.model('CartItem', cartItemSchema);
