const Order = require("../models/order.model");
const InventoryTransaction = require("../models/inventoryTransaction.model");
const Customer = require("../models/customer.model");

// Sales report: total sales, orders count, revenue in a date range
exports.getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const match = {};
        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = new Date(startDate);
            if (endDate) match.createdAt.$lte = new Date(endDate);
        }

        const sales = await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        res.json(sales[0] || { totalOrders: 0, totalRevenue: 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Inventory report: stock ins, stock outs, adjustments in a date range
exports.getInventoryReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const match = {};
        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = new Date(startDate);
            if (endDate) match.createdAt.$lte = new Date(endDate);
        }

        const inventory = await InventoryTransaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$transaction_type",
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        // Format results
        const report = {
            stock_in: 0,
            stock_out: 0,
            adjustment: 0
        };

        inventory.forEach(item => {
            report[item._id] = item.totalQuantity;
        });

        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Customer activity report: number of active customers, new customers in date range
exports.getCustomerActivityReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const match = {};
        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = new Date(startDate);
            if (endDate) match.createdAt.$lte = new Date(endDate);
        }

        const totalCustomers = await Customer.countDocuments();
        const newCustomers = await Customer.countDocuments(match);

        res.json({
            totalCustomers,
            newCustomers
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
