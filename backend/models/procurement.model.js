// models/procurement.model.js
const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  products: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit_price: {
      type: Number,
      min: 0
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'ordered', 'shipped', 'completed', 'cancelled'],
    default: 'pending'
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  expected_delivery_date: Date,
  actual_delivery_date: Date,
  notes: String,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
procurementSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Calculate unit price before saving
procurementSchema.pre('save', async function(next) {
  if (this.isModified('products') || this.isNew) {
    for (const item of this.products) {
      if (!item.unit_price) {
        const product = await mongoose.model('Product').findById(item.product_id);
        if (product) {
          item.unit_price = product.price;
        }
      }
    }
  }
  next();
});

module.exports = mongoose.model('Procurement', procurementSchema);