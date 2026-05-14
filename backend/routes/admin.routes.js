// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");



// Dashboard Statistics
router.get("/dashboard-stats", protect, adminOnly, adminController.getDashboardStats);

// User Management
router.get("/users", protect, adminOnly, userController.getAllUsers);
router.put("/users/:id/role", protect, adminOnly, userController.updateUserRole);
router.put("/users/:id/status", protect, adminOnly, userController.updateUserStatus);

// System Operations
router.get("/system-settings", protect, adminOnly, adminController.getSystemSettings);
router.put("/system-settings", protect, adminOnly, adminController.updateSystemSettings);

// Activity Monitoring
router.get("/recent-activity", protect, adminOnly, adminController.getRecentActivity);
router.get("/audit-logs", protect, adminOnly, adminController.getAuditLogs);

// Data Overview
router.get("/sales-overview", protect, adminOnly, adminController.getSalesOverview);
router.get("/inventory-overview", protect, adminOnly, adminController.getInventoryOverview);
router.get("/customer-overview", protect, adminOnly, adminController.getCustomerOverview);

module.exports = router;