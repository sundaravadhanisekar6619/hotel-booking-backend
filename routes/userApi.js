const express = require("express");
const { body } = require("express-validator");
const userApiController = require("../controllers/userApiController");
const isAuthFeed = require("../middleware/is-auth-feed");

const router = express.Router();

// All routes require JWT
router.use(isAuthFeed);

// Get user profile
router.get("/:id", userApiController.getUserProfile);

// Update profile
router.put(
  "/:id",
  [
    body("name").optional().trim(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().trim()
  ],
  userApiController.updateUserProfile
);

// Delete user
router.delete("/:id", userApiController.deleteUser);

// Get user booking history
router.get("/:id/bookings", userApiController.getUserBookings);

// Add favorite
router.post(
  "/:id/favorites",
  body("roomId").notEmpty().withMessage("roomId is required"),
  userApiController.addFavorite
);

// Get favorites
router.get("/:id/favorites", userApiController.getFavorites);

module.exports = router;
