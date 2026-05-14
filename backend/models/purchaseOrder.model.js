// models/purchaseOrder.model.js
const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  order_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['ordered', 'received', 'cancelled'], default: 'ordered' },
  total_amount: Number
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
