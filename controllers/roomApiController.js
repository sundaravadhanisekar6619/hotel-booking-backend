const { validationResult } = require("express-validator");
const Room = require("../models/room");

// GET /api/rooms → Get all rooms (with filters)
exports.getRooms = async (req, res, next) => {
  try {
    const filters = {};
    const { type, minPrice, maxPrice, amenities, location } = req.query;

    if (type) filters.roomType = type;
    if (minPrice) filters.pricePerNight = { ...filters.pricePerNight, $gte: Number(minPrice) };
    if (maxPrice) filters.pricePerNight = { ...filters.pricePerNight, $lte: Number(maxPrice) };
    if (amenities) filters.amenities = { $all: amenities.split(",") };
    if (location) filters.hotelName = { $regex: location, $options: "i" };

    const rooms = await Room.find(filters);
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
};

// GET /api/rooms/:id → Get room details
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ room });
  } catch (err) {
    next(err);
  }
};

// POST /api/rooms → Add room (Admin only)
exports.addRoom = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const room = new Room(req.body);
    await room.save();

    res.status(201).json({ message: "Room created", room });
  } catch (err) {
    next(err);
  }
};

// PUT /api/rooms/:id → Update room (Admin only)
exports.updateRoom = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room updated", room });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/rooms/:id → Delete room (Admin only)
exports.deleteRoom = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    next(err);
  }
};
