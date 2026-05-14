// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
  password: String,
  phone: String,
  address: String,
  role: { type: String, enum: ['customer', 'admin', 'staff', 'supplier'], default: 'customer' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
