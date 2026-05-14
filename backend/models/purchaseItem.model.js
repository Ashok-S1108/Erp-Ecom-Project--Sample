// models/purchaseItem.model.js
const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  purchase_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  unit_price: Number
});

module.exports = mongoose.model('PurchaseItem', purchaseItemSchema);
