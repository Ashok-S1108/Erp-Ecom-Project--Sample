// models/supplier.model.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);
