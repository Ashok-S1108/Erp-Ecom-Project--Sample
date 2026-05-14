// models/payment.model.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  payment_method: String,
  payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transaction_id: String,
  paid_at: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
