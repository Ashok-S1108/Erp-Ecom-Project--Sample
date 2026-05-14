// Add return/exchange model
// models/return.model.js
const returnSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  status: { type: String, enum: ['requested', 'approved', 'rejected', 'processed'], default: 'requested' },
  refund_amount: Number,
  processed_at: Date
});

module.exports = mongoose.model('Return', returnSchema);
