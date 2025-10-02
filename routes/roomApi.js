const express = require("express");
const { body } = require("express-validator");
const roomApiController = require("../controllers/roomApiController");
const isAuthFeed = require("../middleware/is-auth-feed");

const router = express.Router();

// All routes require JWT
router.use(isAuthFeed);

// GET all rooms with optional filters
router.get("/", roomApiController.getRooms);

// GET single room details
router.get("/:id", roomApiController.getRoomById);

// Admin-only routes
router.post(
  "/",
  [
    body("hotelName").notEmpty(),
    body("roomNumber").notEmpty(),
    body("roomType").isIn(["single", "double", "suite", "deluxe"]),
    body("pricePerNight").isNumeric(),
    body("maxGuests").isNumeric()
  ],
  roomApiController.addRoom
);

router.put("/:id", roomApiController.updateRoom);
router.delete("/:id", roomApiController.deleteRoom);

module.exports = router;
