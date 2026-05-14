// routes/product.routes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// CRUD
router.post("/", productController.createProduct);         // Create product
router.get("/", productController.getProducts);            // Get all products (with filters)
router.get("/:id", productController.getProductById);       // Get single product
router.put("/:id", productController.updateProduct);        // Update product
router.delete("/:id", productController.deleteProduct);     // Delete product

// Stock update
router.patch("/:id/stock", productController.updateStock);  // Update stock (ERP sync)

module.exports = router;
