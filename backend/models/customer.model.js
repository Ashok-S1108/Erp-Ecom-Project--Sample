// models/customer.model.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loyalty_points: { type: Number, default: 0 },
  notes: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
