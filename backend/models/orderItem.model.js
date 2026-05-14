
// models/orderItem.model.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, min: 1, required: true },
  price: { type: Number, min: 0, required: true }
});

module.exports = mongoose.model('orderItem', orderItemSchema);
