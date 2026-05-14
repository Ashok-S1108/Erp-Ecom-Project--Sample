// models/review.model.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: Number,
  comment: String,
  is_approved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
