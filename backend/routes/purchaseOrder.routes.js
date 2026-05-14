// routes/purchaseOrder.routes.js


const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrder.controller");

// CRUD routes
router.post("/", purchaseOrderController.createPurchaseOrder);
router.get("/", purchaseOrderController.getPurchaseOrders);
router.put("/:id/status", purchaseOrderController.updatePurchaseOrderStatus);

module.exports = router;
