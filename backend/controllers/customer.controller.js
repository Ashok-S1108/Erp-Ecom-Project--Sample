const Customer = require("../models/customer.model");

// Create new customer
exports.createCustomer = async (req, res) => {
    try {
        const { userId, loyaltyPoints, notes } = req.body;

        const existingCustomer = await Customer.findOne({ userId });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer record already exists" });
        }

        const newCustomer = new Customer({
            userId,
            loyaltyPoints: loyaltyPoints || 0,
            notes
        });

        await newCustomer.save();
        res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate("userId", "name email");
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate("userId", "name email");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update customer
exports.updateCustomer = async (req, res) => {
    try {
        const { loyaltyPoints, notes } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { loyaltyPoints, notes },
            { new: true }
        );
        if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer updated successfully", customer: updatedCustomer });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
