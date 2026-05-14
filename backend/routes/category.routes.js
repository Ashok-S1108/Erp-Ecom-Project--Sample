// routes/category.routes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// CRUD
router.post("/", categoryController.createCategory);     // Create category
router.get("/", categoryController.getCategories);       // Get all categories
router.put("/:id", categoryController.updateCategory);   // Update category
router.delete("/:id", categoryController.deleteCategory);// Delete category

module.exports = router;
