const { validationResult } = require("express-validator");
const Payment = require("../models/payment");
const Booking = require("../models/booking");

// POST /api/payments → Create payment (Stripe/Razorpay placeholder)
exports.createPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { bookingId, transactionId, amount, method, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only booking owner can pay
    if (req.userRole !== "admin" && booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Payment creation
    const payment = new Payment({
      booking: bookingId,
      transactionId,
      amount,
      method,
      status: status || "pending",
      paidAt: status === "success" ? new Date() : null
    });

    await payment.save();

    // Update booking paymentStatus
    if (status === "success") {
      booking.paymentStatus = "paid";
      await booking.save();
    }

    res.status(201).json({ message: "Payment created", payment });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/:id → Get payment details
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Only admin or booking owner can view
    if (req.userRole !== "admin" && payment.booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments → Admin: Get all payments
exports.getAllPayments = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const payments = await Payment.find().populate("booking");
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};
