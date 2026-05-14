// routes/inventoryTransaction.routes.js
const express = require("express");
const router = express.Router();
const inventoryTransactionController = require("../controllers/inventoryTransaction.controller");

// CRUD routes
router.post("/", inventoryTransactionController.createTransaction);
router.get("/", inventoryTransactionController.getTransactions);
router.get("/product/:productId", inventoryTransactionController.getTransactionsByProduct);

module.exports = router;
