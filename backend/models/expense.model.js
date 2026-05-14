
// models/expense.model.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., 'Salary', 'Utilities'
  date: { type: Date, default: Date.now },
  paidBy: { type: String }, // e.g., 'Bank', 'Cash'
  notes: { type: String }
});

module.exports = mongoose.model('Expense', expenseSchema);