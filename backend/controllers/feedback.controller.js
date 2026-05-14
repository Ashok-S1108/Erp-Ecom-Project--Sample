const Feedback = require("../models/feedback.model");

// Submit feedback/support ticket
exports.createFeedback = async (req, res) => {
    try {
        const { userId, subject, message, status } = req.body;

        const newFeedback = new Feedback({
            userId,
            subject,
            message,
            status: status || "Open",
            createdAt: new Date()
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted", feedback: newFeedback });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all feedbacks (Admin)
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate("userId", "name email").sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update feedback status (e.g. Open, In Progress, Closed)
exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedFeedback) return res.status(404).json({ message: "Feedback not found" });
        res.json({ message: "Feedback status updated", feedback: updatedFeedback });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) return res.status(404).json({ message: "Feedback not found" });
        res.json({ message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
