// models/shipping.model.js
const shippingSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  carrier: String,
  service: String,
  cost: Number,
  tracking_url: String,
  status: { 
    type: String, 
    enum: ['label_created', 'in_transit', 'out_for_delivery', 'delivered', 'returned'],
    default: 'label_created'
  }
});

module.exports = mongoose.model('Shipping', shippingSchema);