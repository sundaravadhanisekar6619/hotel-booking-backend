const { validationResult } = require("express-validator");
const Notification = require("../models/notification");
const User = require("../models/user");

// GET /api/notifications/:userId → Get user notifications
exports.getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Only admin or the user themselves can access
    if (req.userId !== userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications → Admin: Send notification
exports.sendNotification = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { userId, type, message } = req.body;

    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = new Notification({
      user: userId,
      type,
      message,
      status: "pending"
    });

    await notification.save();

    // Optional: Implement actual sending (email, SMS) here
    notification.status = "sent";
    await notification.save();

    res.status(201).json({ message: "Notification sent", notification });
  } catch (err) {
    next(err);
  }
};
