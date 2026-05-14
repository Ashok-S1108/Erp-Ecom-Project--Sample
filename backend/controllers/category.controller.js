// controllers/category.controller.js
const Category = require("../models/category.model");

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        const category = new Category({ name, parentCategory });
        await category.save();
        res.status(201).json({ message: "Category created successfully", category });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category updated successfully", category: updatedCategory });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
