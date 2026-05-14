const Review = require("../models/review.model");

// Create a review
exports.createReview = async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;

        const newReview = new Review({
            userId,
            productId,
            rating,
            comment,
            isApproved: false, // default pending approval
            createdAt: new Date()
        });

        await newReview.save();
        res.status(201).json({ message: "Review submitted and pending approval", review: newReview });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all approved reviews for a product
exports.getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId, isApproved: true }).populate("userId", "name");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get all reviews (including pending)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("userId", "name").populate("productId", "name");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Approve or reject a review
exports.updateReviewApproval = async (req, res) => {
    try {
        const { isApproved } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { isApproved },
            { new: true }
        );
        if (!updatedReview) return res.status(404).json({ message: "Review not found" });
        res.json({ message: `Review ${isApproved ? "approved" : "rejected"}`, review: updatedReview });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) return res.status(404).json({ message: "Review not found" });
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
