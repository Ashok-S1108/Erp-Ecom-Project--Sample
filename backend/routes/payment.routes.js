
const express = require('express');
const router = express.Router();
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const {adminOnly, protect} = require('../middlewares/auth.middleware');

// Process payment
router.post('/process', protect, async (req, res) => {
  try {
    const { order_id, payment_method, card_data } = req.body;
    
    // Validate order exists and belongs to user
    const order = await Order.findOne({ 
      _id: order_id, 
      user_id: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Simulate payment processing
    // In a real application, you would integrate with a payment gateway here
    let paymentStatus = 'completed';
    let transactionId = generateTransactionId();
    
    // Simulate potential payment failure (10% chance for demo)
    if (Math.random() < 0.1) {
      paymentStatus = 'failed';
      transactionId = null;
    }
    
    // Create payment record
    const payment = new Payment({
      order_id: order_id,
      payment_method: payment_method,
      payment_status: paymentStatus,
      transaction_id: transactionId,
      paid_at: paymentStatus === 'completed' ? new Date() : null
    });
    
    await payment.save();
    
    // Update order payment status
    order.payment_status = paymentStatus;
    await order.save();
    
    res.json({
      message: paymentStatus === 'completed' ? 'Payment successful' : 'Payment failed',
      payment_status: paymentStatus,
      transaction_id: transactionId
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// Get payment details for an order
router.get('/order/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Verify the order belongs to the user
    const order = await Order.findOne({ 
      _id: orderId, 
      user_id: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const payment = await Payment.findOne({ order_id: orderId });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate transaction ID
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = router;