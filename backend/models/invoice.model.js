// models/invoice.model.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  invoice_date: { type: Date, default: Date.now },
  total_amount: Number,
  payment_status: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
