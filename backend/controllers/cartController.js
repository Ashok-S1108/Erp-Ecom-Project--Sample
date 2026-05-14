const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cartItem.model.js");
const Product = require("../models/product.model.js");

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user._id;

    // Find or create a cart
    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({ user_id });
      await cart.save();
    }

    // Find or create a cart item
    let cartItem = await CartItem.findOne({ cart_id: cart._id, product_id });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ cart_id: cart._id, product_id, quantity });
      await cartItem.save();
    }

    res.json({ message: "Product added to cart successfully", cartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const cart = await Cart.findOne({ user_id });
    if (!cart) return res.json({ items: [] });

    const items = await CartItem.find({ cart_id: cart._id }).populate("product_id");
    res.json({ cart, items: items.map(i => ({ ...i._doc, product: i.product_id })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.cartItemId);
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
