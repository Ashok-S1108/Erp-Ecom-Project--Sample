// models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, min: 1, required: true },
    unit_price: { 
      type: mongoose.Schema.Types.Decimal128, 
      required: true,
      get: v => parseFloat(v.toString()),
      set: v => parseFloat(v).toFixed(2)
    },
    subtotal: { 
      type: mongoose.Schema.Types.Decimal128, 
      required: true,
      get: v => parseFloat(v.toString()),
      set: v => parseFloat(v).toFixed(2)
    }
  }],

  total_amount: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true,
    get: v => parseFloat(v.toString()),
    set: v => parseFloat(v).toFixed(2)
  },

  order_status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },

  payment_status: {
    type: String,
    enum: [
      'pending',
      'paid',
      'failed',
      'refunded',
      'partially_refunded'
    ],
    default: 'pending'
  },

  shipping_address: { type: String, required: true },
  tracking_number: { type: String },
  estimated_delivery: { type: Date },

  discount_amount: { 
    type: mongoose.Schema.Types.Decimal128, 
    default: 0,
    get: v => parseFloat(v.toString()),
    set: v => parseFloat(v).toFixed(2)
  },

  tax_amount: { 
    type: mongoose.Schema.Types.Decimal128, 
    default: 0,
    get: v => parseFloat(v.toString()),
    set: v => parseFloat(v).toFixed(2)
  }
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Indexes for faster queries
orderSchema.index({ user_id: 1, createdAt: -1 });
orderSchema.index({ order_status: 1 });

module.exports = mongoose.model('Order', orderSchema);
