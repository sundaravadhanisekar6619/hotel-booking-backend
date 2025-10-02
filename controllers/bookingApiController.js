const { validationResult } = require("express-validator");
const Booking = require("../models/booking");
const Room = require("../models/room");

// POST /api/bookings → Create booking (user selects room & dates)
exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { roomId, checkInDate, checkOutDate, guests, specialRequests, totalAmount } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!room.availability) return res.status(400).json({ message: "Room not available" });

    const booking = new Booking({
      user: req.userId,
      room: roomId,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests,
      totalAmount,
      bookingStatus: "confirmed",
      paymentStatus: "pending"
    });

    await booking.save();

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:id → Get booking details
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // User can only access own booking unless admin
    if (req.userRole !== "admin" && booking.user._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings → Admin: Get all bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const bookings = await Booking.find().populate("user room");
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookings/:id/cancel → Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // User can cancel own booking, admin can cancel any
    if (req.userRole !== "admin" && booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookings/:id → Update booking (admin/user)
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only admin or booking owner
    if (req.userRole !== "admin" && booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(booking, req.body);
    await booking.save();

    res.json({ message: "Booking updated", booking });
  } catch (err) {
    next(err);
  }
};
