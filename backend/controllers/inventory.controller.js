// controllers/inventory.controller.js
const Product = require("../models/product.model");

// Get all inventory
exports.getInventory = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Adjust stock
exports.adjustStock = async (req, res) => {
    try {
        const { quantity, reason } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.stock += quantity;
        await product.save();

        // Optionally: log stock transaction
        res.json({ message: `Stock adjusted: ${reason}`, product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Low stock alerts
exports.lowStockAlert = async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 5;
        const lowStockProducts = await Product.find({ stock: { $lt: threshold } });
        res.json(lowStockProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
