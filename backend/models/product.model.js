// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: { type: Number, min: 0, required: true },
  stock_quantity: { type: Number, min: 0, default: 0 },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  image_url: String,
  created_at: { type: Date, default: Date.now },
  sku: { type: String, unique: true },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  is_featured: { type: Boolean, default: false },
  tags: [String]
});

module.exports = mongoose.model('Product', productSchema);
