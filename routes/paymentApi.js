const express = require("express");
const { body } = require("express-validator");
const paymentController = require("../controllers/paymentApiController");
const isAuthFeed = require("../middleware/is-auth-feed");

const router = express.Router();

// JWT-protected
router.use(isAuthFeed);

// Create payment
router.post(
  "/",
  [
    body("bookingId").notEmpty().withMessage("Booking ID required"),
    body("transactionId").notEmpty().withMessage("Transaction ID required"),
    body("amount").isFloat({ min: 0 }).withMessage("Amount required"),
    body("method").isIn(["card", "upi", "wallet", "netbanking"]).withMessage("Invalid payment method"),
  ],
  paymentController.createPayment
);

// Get single payment
router.get("//:id", paymentController.getPayment);

// Get all payments (admin only)
router.get("/", paymentController.getAllPayments);

module.exports = router;
