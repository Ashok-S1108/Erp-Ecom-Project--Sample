// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const { protect } = require('../middlewares/auth.middleware');

// Get user's cart with populated items
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user.id })
      .populate({
        path: 'items',
        populate: {
          path: 'product_id',
          select: 'name price image description category stock'
        }
      });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({ user_id: req.user.id });
      await cart.save();
      return res.json({ 
        success: true, 
        message: 'Cart created',
        items: [],
        cartId: cart._id
      });
    }

    // Format response to match your existing structure
    res.json({
      _id: cart._id,
      user_id: cart.user_id,
      items: cart.items,
      created_at: cart.created_at,
      __v: cart.__v
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get cart' 
    });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Validate input
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    let cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      cart = new Cart({ user_id: req.user.id });
      await cart.save();
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      cart_id: cart._id,
      product_id: product_id
    });

    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = new CartItem({
        cart_id: cart._id,
        product_id: product_id,
        quantity: quantity
      });
      await cartItem.save();
      
      // Add to cart's items array
      cart.items.push(cartItem._id);
      await cart.save();
    }

    // Populate the product details
    await cartItem.populate('product_id', 'name price image description category stock');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      item: cartItem,
      cartId: cart._id
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item to cart. Please try again.' 
    });
  }
});

// Update cart item quantity
router.put('/update/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cartItem = await CartItem.findById(itemId)
      .populate('product_id', 'name price image description category stock');

    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    // Verify the cart item belongs to the user's cart
    const cart = await Cart.findOne({ 
      _id: cartItem.cart_id, 
      user_id: req.user.id 
    });

    if (!cart) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await CartItem.findByIdAndDelete(itemId);
      cart.items = cart.items.filter(item => item.toString() !== itemId);
      await cart.save();
      
      res.json({ 
        success: true, 
        message: 'Item removed from cart' 
      });
    } else {
      // Update quantity
      cartItem.quantity = quantity;
      await cartItem.save();
      
      res.json({
        success: true,
        message: 'Cart updated',
        item: cartItem
      });
    }
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update cart' 
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cartItem = await CartItem.findById(itemId);

    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    // Verify the cart item belongs to the user's cart
    const cart = await Cart.findOne({ 
      _id: cartItem.cart_id, 
      user_id: req.user.id 
    });

    if (!cart) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    await CartItem.findByIdAndDelete(itemId);
    cart.items = cart.items.filter(item => item.toString() !== itemId);
    await cart.save();

    res.json({ 
      success: true, 
      message: 'Item removed from cart' 
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove item from cart' 
    });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Remove all cart items
    await CartItem.deleteMany({ cart_id: cart._id });
    
    // Clear items array
    cart.items = [];
    await cart.save();

    res.json({ 
      success: true, 
      message: 'Cart cleared' 
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear cart' 
    });
  }
});

module.exports = router;