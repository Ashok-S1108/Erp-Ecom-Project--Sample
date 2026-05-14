const User = require("../models/user.model");
const SystemSetting = require("../models/systemSetting.model");
// controllers/admin.controller.js
const Order = require('../models/order.model');
const Product = require('../models/product.model');

const InventoryTransaction = require('../models/inventoryTransaction.model');



exports.getSalesOverview = async (req, res) => {
  try {
    // Get sales data for the last 12 months grouped by month
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo }, payment_status: 'paid' } },
      { $group: {
        _id: { $month: '$created_at' },
        total: { $sum: '$total_amount' }
      }},
      { $sort: { '_id': 1 } }
    ]);
    
    // Format data for chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = salesData.map(item => monthNames[item._id - 1]);
    const sales = salesData.map(item => item.total);
    
    res.json({ labels, sales });
  } catch (error) {
    console.error('Error fetching sales overview:', error);
    res.status(500).json({ message: 'Error fetching sales overview' });
  }
};

// Get dashboard stats: total users by role, total orders, products count
exports.getDashboardStats = async (req, res) => {
  try {
    // Date for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aggregate all stats concurrently
    const [totalUsers, totalAdmins, totalCustomers, totalStaff, totalInstructors, totalSales, newOrders, lowStockItems, newCustomers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "staff" }),
      User.countDocuments({ role: "instructor" }), // if applicable
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, payment_status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.countDocuments({ stock_quantity: { $lt: 10 } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, role: 'customer' })
    ]);

    // Construct response
    const stats = {
      totalUsers,
      totalAdmins,
      totalCustomers,
      totalStaff,
      totalInstructors,
      totalSales: totalSales[0]?.total || 0,
      newOrders,
      lowStockItems,
      newCustomers,
      // Placeholder percentage changes
      salesChange: 12.5, // You can calculate based on previous period
      ordersChange: 8.3,
      customersChange: 5.7
    };

    res.json(stats);

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};


// Get system settings
exports.getSystemSettings = async (req, res) => {
    try {
        const settings = await SystemSetting.findOne();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update system settings
exports.updateSystemSettings = async (req, res) => {
    try {
        const updates = req.body;
        let settings = await SystemSetting.findOne();

        if (!settings) {
            settings = new SystemSetting(updates);
        } else {
            Object.assign(settings, updates);
        }

        await settings.save();
        res.json({ message: "Settings updated", settings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Role management: update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User role updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getAllUsers = async (req, res) => res.json({ message: "getAllUsers not implemented yet" });
exports.updateUserStatus = async (req, res) => res.json({ message: "updateUserStatus not implemented yet" });
exports.getRecentActivity = async (req, res) => res.json({ message: "getRecentActivity not implemented yet" });
exports.getAuditLogs = async (req, res) => res.json({ message: "getAuditLogs not implemented yet" });
exports.getInventoryOverview = async (req, res) => res.json({ message: "getInventoryOverview not implemented yet" });
exports.getCustomerOverview = async (req, res) => res.json({ message: "getCustomerOverview not implemented yet" });
