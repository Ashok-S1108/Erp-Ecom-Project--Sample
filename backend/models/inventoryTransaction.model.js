// models/inventoryTransaction.model.js
const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true
  },
  transaction_type: {
    type: String,
    enum: ['sale', 'procurement', 'return', 'adjustment', 'damage', 'procurement_reversal', 'procurement_deletion'],
    required: true
  },
  reference_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  unit_cost: {
    type: Number,
    min: 0
  },
  total_value: {
    type: Number,
    min: 0
  },
  notes: String,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Calculate total value before saving
inventoryTransactionSchema.pre('save', function(next) {
  if (this.unit_cost && this.quantity) {
    this.total_value = this.unit_cost * Math.abs(this.quantity);
  }
  next();
});

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);