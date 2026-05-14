// routes/inventory.routes.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");

// Inventory management
router.get("/", inventoryController.getInventory);                // Get all inventory
router.patch("/:id/adjust", inventoryController.adjustStock);     // Adjust stock
router.get("/low-stock", inventoryController.lowStockAlert);      // Low stock alerts

module.exports = router;
