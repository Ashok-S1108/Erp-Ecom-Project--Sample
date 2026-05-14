
// models/taxReport.model.js
const mongoose = require('mongoose');

const taxReportSchema = new mongoose.Schema({
  period: { type: String, required: true }, // e.g., '2025-Q3'
  totalIncome: { type: Number, required: true },
  totalExpense: { type: Number, required: true },
  taxDue: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaxReport', taxReportSchema);