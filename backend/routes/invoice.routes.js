// routes/invoice.routes.js
const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoice.controller");

router.post("/", invoiceController.generateInvoice);
router.get("/", invoiceController.getAllInvoices);
router.get("/:id", invoiceController.getInvoiceById);
router.put("/:id/paid", invoiceController.markInvoicePaid);

module.exports = router;
