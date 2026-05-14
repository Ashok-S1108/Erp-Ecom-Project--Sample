// models/cart.model.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
