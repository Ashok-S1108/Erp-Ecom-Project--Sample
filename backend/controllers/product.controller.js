// controllers/product.controller.js
const Product = require("../models/product.model");

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;
        const product = new Product({ name, description, price, category, stock, images });
        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all products (with search/filter)
exports.getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;
        let query = {};

        if (search) query.name = { $regex: search, $options: "i" };
        if (category) query.category = category;
        if (minPrice || maxPrice) query.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update stock (ERP integration)
exports.updateStock = async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.stock += quantity;
        await product.save();

        res.json({ message: "Stock updated successfully", product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
