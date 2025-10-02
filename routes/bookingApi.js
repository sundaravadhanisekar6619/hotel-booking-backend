const express = require("express");
const { body } = require("express-validator");
const bookingController = require("../controllers/bookingApiController");
const isAuthFeed = require("../middleware/is-auth-feed");

const router = express.Router();

// JWT-protected
router.use(isAuthFeed);

// Create booking
router.post(
  "/",
  [
    body("roomId").notEmpty().withMessage("Room ID required"),
    body("checkInDate").isISO8601().withMessage("Valid check-in date required"),
    body("checkOutDate").isISO8601().withMessage("Valid check-out date required"),
    body("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
    body("totalAmount").isFloat({ min: 0 }).withMessage("Total amount required")
  ],
  bookingController.createBooking
);

// Get single booking
router.get("/:id", bookingController.getBooking);

// Get all bookings (admin only)
router.get("/", bookingController.getAllBookings);

// Cancel booking
router.put("/:id/cancel", bookingController.cancelBooking);

// Update booking
router.put("/:id", bookingController.updateBooking);

module.exports = router;
