const { validationResult } = require("express-validator");
const Review = require("../models/review");
const Booking = require("../models/booking");
const Room = require("../models/room");

// POST /api/reviews → Add review (only after completed booking)
exports.addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { roomId, rating, comment } = req.body;

    // Check if user has a completed booking for the room
    const booking = await Booking.findOne({
      room: roomId,
      user: req.userId,
      bookingStatus: "completed"
    });

    if (!booking) {
      return res.status(403).json({ message: "You can only review rooms you have completed booking for." });
    }

    const review = new Review({
      room: roomId,
      user: req.userId,
      rating,
      comment,
      approved: false
    });

    await review.save();
    res.status(201).json({ message: "Review added, pending approval", review });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/:roomId → Get reviews for a room
exports.getReviewsForRoom = async (req, res, next) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId, approved: true }).populate("user", "name");
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reviews/:id → Admin: Remove review
exports.deleteReview = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};

// PUT /api/reviews/:id/approve → Admin: Approve review
exports.approveReview = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.approved = true;
    await review.save();

    res.json({ message: "Review approved", review });
  } catch (err) {
    next(err);
  }
};
