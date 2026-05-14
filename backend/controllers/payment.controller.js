const Payment = require("../models/payment.model");

// Process payment
exports.processPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, amount, transactionId } = req.body;

        const newPayment = new Payment({
            orderId,
            paymentMethod,
            amount,
            transactionId,
            status: "Completed",
            paidAt: new Date()
        });

        await newPayment.save();
        res.status(201).json({ message: "Payment processed successfully", payment: newPayment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate("orderId");
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate("orderId");
        if (!payment) return res.status(404).json({ message: "Payment not found" });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Refund payment
exports.refundPayment = async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status: "Refunded" },
            { new: true }
        );
        if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });
        res.json({ message: "Payment refunded successfully", payment: updatedPayment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
