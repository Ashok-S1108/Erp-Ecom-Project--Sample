const Invoice = require("../models/invoice.model");

// Generate new invoice
exports.generateInvoice = async (req, res) => {
    try {
        const { orderId, amount, dueDate } = req.body;

        const newInvoice = new Invoice({
            orderId,
            amount,
            dueDate,
            status: "Unpaid",
            issuedAt: new Date()
        });

        await newInvoice.save();
        res.status(201).json({ message: "Invoice generated successfully", invoice: newInvoice });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("orderId");
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("orderId");
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark invoice as paid
exports.markInvoicePaid = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { status: "Paid", paidAt: new Date() },
            { new: true }
        );
        if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice marked as paid", invoice: updatedInvoice });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
