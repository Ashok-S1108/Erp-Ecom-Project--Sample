const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItem.model.js");
const auth = require("../middlewares/auth.middleware.js");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, shippingAddress } = req.body;

    // Step 1: Create order
    const newOrder = new Order({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      order_status: "pending",
      payment_status: "pending",
      created_at: new Date()
    });

    const savedOrder = await newOrder.save();

    // Step 2: Create order items
    const orderItems = products.map((p) => ({
      order_id: savedOrder._id,
      product_id: p.productId,
      quantity: p.quantity,
      price: p.price
    }));

    await OrderItem.insertMany(orderItems);

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
      items: orderItems
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user_id", "name email");

    // Fetch items for each order
    const results = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id }).populate("product_id");
        return { ...order.toObject(), items };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user_id", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const items = await OrderItem.find({ order_id: order._id }).populate("product_id");

    res.json({ ...order.toObject(), items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status: status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    // Also delete order items
    await OrderItem.deleteMany({ order_id: req.params.id });

    res.json({ message: "Order and related items deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUserOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserOrderItems = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const items = await OrderItem.find({ order_id: req.params.id });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
