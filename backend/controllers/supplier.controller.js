const Supplier = require("../models/supplier.model");

// Create Supplier
exports.createSupplier = async (req, res) => {
    try {
        const { name, contactName, email, phone, address } = req.body;

        const existingSupplier = await Supplier.findOne({ email });
        if (existingSupplier) {
            return res.status(400).json({ message: "Supplier already exists" });
        }

        const newSupplier = new Supplier({
            name,
            contactName,
            email,
            phone,
            address
        });

        await newSupplier.save();
        res.status(201).json({ message: "Supplier created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all suppliers
exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
    try {
        const { name, contactName, email, phone, address } = req.body;
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, contactName, email, phone, address },
            { new: true }
        );

        if (!updatedSupplier) return res.status(404).json({ message: "Supplier not found" });
        res.json({ message: "Supplier updated successfully", supplier: updatedSupplier });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) return res.status(404).json({ message: "Supplier not found" });

        res.json({ message: "Supplier deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
