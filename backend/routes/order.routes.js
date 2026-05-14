
const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const {protect, adminOnly} = require('../middlewares/auth.middleware');

// Get all orders (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ created_at: -1 })
      .populate({
        path: 'user_id',
        select: 'name email'
      });

    // Optionally, populate order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id })
          .populate('product_id', 'name image price sku');
        return { ...order.toObject(), items };
      })
    );

    res.json({ orders: ordersWithItems });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new order from user's cart
router.post('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's cart
    const Cart = require('../models/cart.model');
    const CartItem = require('../models/cartItem.model');

    const cart = await Cart.findOne({ user_id: userId })
      .populate({
        path: 'items',
        populate: {
          path: 'product_id',
          select: 'name price stock'
        }
      });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      const price = parseFloat(item.product_id.price.toFixed(2));
      subtotal += price * item.quantity;

      return {
        order_id: null, // will set after order is created
        product_id: item.product_id._id,
        quantity: item.quantity,
        price
      };
    });

    subtotal = parseFloat(subtotal.toFixed(2));
    const tax_amount = parseFloat((subtotal * 0.08).toFixed(2));
    const shipping_cost = 5.99;
    const discount_amount = 0;
    const total_amount = parseFloat((subtotal + tax_amount + shipping_cost - discount_amount).toFixed(2));

    // Create order
    const order = new Order({
      user_id: userId,
      total_amount,
      order_status: 'pending',
      payment_status: 'pending',
      shipping_address: req.body.shipping_address, // passed from frontend
      tax_amount,
      discount_amount,
      shipping_cost
    });

    const savedOrder = await order.save();

    // Save order items
    const finalOrderItems = orderItems.map(i => ({
      ...i,
      order_id: savedOrder._id
    }));
    await OrderItem.insertMany(finalOrderItems);

    // Clear the cart
    await CartItem.deleteMany({ cart_id: cart._id });
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder,
      items: finalOrderItems
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});


// Get order history for authenticated user
router.get('/history', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id })
      .sort({ created_at: -1 });
    
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order items for a specific order
router.get('/:orderId/items', protect, async (req, res) => {
  try {
    // Verify the order belongs to the user
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user_id: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const orderItems = await OrderItem.find({ order_id: req.params.orderId })
      .populate('product_id', 'name image');
    
    res.json(orderItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific order details
router.get('/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user_id: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
// router.patch('/:orderId', protect, async (req, res) => {
//   try {
//     const { order_status, payment_status } = req.body;
    
//     const order = await Order.findOne({ 
//       _id: req.params.orderId, 
//       user_id: req.user.id 
//     });
    
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     if (order_status) order.order_status = order_status;
//     if (payment_status) order.payment_status = payment_status;
    
//     await order.save();
    
//     res.json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add this admin-only update endpoint to your routes
// router.patch('/orders/:orderId', protect, adminOnly, async (req, res) => {
//   try {
//     const { order_status, payment_status } = req.body;
    
//     const order = await Order.findById(req.params.orderId);
    
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     if (order_status) order.order_status = order_status;
//     if (payment_status) order.payment_status = payment_status;
    
//     await order.save();
    
//     res.json(order);
//   } catch (error) {
//     console.error('Admin update order error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // // General update order (admin only)
// // router.patch('/:id', async (req, res) => {
// //   try {
// //     const order = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       { $set: req.body },
// //       { new: true }
// //     );
// //     res.json(order);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // routes/order.routes.js
// router.patch('/:id', protect, adminOnly, async (req, res) => {
//   try {
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// User can update only payment status
router.patch('/update/:id', protect, async (req, res) => {
  try {
    const { payment_status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (payment_status) order.payment_status = payment_status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin can update order or payment status
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;