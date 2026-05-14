// routes/report.routes.js

const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

router.get("/sales", reportController.getSalesReport);
router.get("/inventory", reportController.getInventoryReport);
router.get("/customer-activity", reportController.getCustomerActivityReport);

module.exports = router;
