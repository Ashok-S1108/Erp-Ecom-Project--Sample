const Notification = require("../models/notification.model");

// Send/create notification
exports.createNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;

        const newNotification = new Notification({
            userId,
            message,
            type,
            isRead: false,
            sentAt: new Date()
        });

        await newNotification.save();
        res.status(201).json({ message: "Notification sent", notification: newNotification });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ sentAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        res.json({ message: "Notification marked as read", notification });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const deleted = await Notification.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Notification not found" });
        res.json({ message: "Notification deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
