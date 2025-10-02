const express = require("express");
const { body } = require("express-validator");
const reviewController = require("../controllers/reviewApiController");
const isAuthFeed = require("../middleware/is-auth-feed");

const router = express.Router();

// JWT-protected
router.use(isAuthFeed);

// Add review
router.post(
  "/",
  [
    body("roomId").notEmpty().withMessage("Room ID is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("comment").optional().isString()
  ],
  reviewController.addReview
);

// Get reviews for a room
router.get("/:roomId", reviewController.getReviewsForRoom);

// Admin: Delete review
router.delete("/:id", reviewController.deleteReview);

// Admin: Approve review
router.put("/:id/approve", reviewController.approveReview);

module.exports = router;
