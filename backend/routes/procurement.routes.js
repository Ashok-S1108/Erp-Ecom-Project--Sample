// routes/procurement.routes.js
const express = require("express");
const router = express.Router();
const procurementController = require("../controllers/procurement.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

// Procurement routes
router.post("/", protect, adminOnly, procurementController.createProcurement);
router.get("/", protect, adminOnly, procurementController.getProcurements);
router.get("/:id", protect, adminOnly, procurementController.getProcurementById);
router.put("/:id", protect, adminOnly, procurementController.updateProcurement);
router.delete("/:id", protect, adminOnly, procurementController.deleteProcurement);
router.put("/:id/status", protect, adminOnly, procurementController.updateProcurementStatus);
router.get("/supplier/:supplierId", protect, adminOnly, procurementController.getProcurementsBySupplier);
router.get("/stats/overview", protect, adminOnly, procurementController.getProcurementStats);

module.exports = router;