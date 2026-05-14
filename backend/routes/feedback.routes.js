// routes/feedback.routes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

router.post("/", feedbackController.createFeedback);
router.get("/", feedbackController.getAllFeedbacks);
router.put("/:id/status", feedbackController.updateFeedbackStatus);
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;
