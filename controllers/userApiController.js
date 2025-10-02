const { validationResult } = require("express-validator");
const User = require("../models/user");
const Booking = require("../models/booking");
const Room = require("../models/room");

// GET /api/users/:id → Get user profile
exports.getUserProfile = async (req, res, next) => {  
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("favorites", "hotelName roomNumber pricePerNight")
      .populate("bookingHistory");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id → Update profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // password update handled separately

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id → Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id/bookings → Get user’s booking history
exports.getUserBookings = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "bookingHistory",
      populate: { path: "room", select: "hotelName roomNumber pricePerNight" }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ bookings: user.bookingHistory });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/:id/favorites → Add to favorites
exports.addFavorite = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites.includes(roomId)) {
      user.favorites.push(roomId);
      await user.save();
    }

    res.json({ message: "Added to favorites", favorites: user.favorites });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id/favorites → Get favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("favorites", "hotelName roomNumber pricePerNight");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ favorites: user.favorites });
  } catch (err) {
    next(err);
  }
};
