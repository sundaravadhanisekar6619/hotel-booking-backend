const express = require("express");
const { body } = require("express-validator");
const notificationController = require("../controllers/notificationApiController");
const isAuthFeed = require("../middleware/is-auth-feed");

const router = express.Router();

// JWT-protected
router.use(isAuthFeed);

// Get notifications for a user
router.get("/:userId", notificationController.getUserNotifications);

// Admin: Send notification
router.post(
  "/",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("type").isIn(["email", "sms"]).withMessage("Type must be email or sms"),
    body("message").notEmpty().withMessage("Message is required")
  ],
  notificationController.sendNotification
);

module.exports = router;
