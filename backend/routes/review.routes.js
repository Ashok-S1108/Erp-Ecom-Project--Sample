// routes/review.routes.js

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// Public routes
router.post("/", reviewController.createReview);
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Admin routes
router.get("/", reviewController.getAllReviews);
router.put("/:id/approval", reviewController.updateReviewApproval);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
