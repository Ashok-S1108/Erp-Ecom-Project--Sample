const InventoryTransaction = require("../models/inventoryTransaction.model");

// Log inventory transaction
exports.createTransaction = async (req, res) => {
    try {
        const transaction = new InventoryTransaction(req.body);
        await transaction.save();
        res.status(201).json({ message: "Inventory transaction logged", transaction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.find().populate("product");
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get transactions by product
exports.getTransactionsByProduct = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.find({ product: req.params.productId });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
