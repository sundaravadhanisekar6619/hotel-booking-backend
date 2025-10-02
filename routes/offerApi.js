const express = require("express");
const { body } = require("express-validator");
const offerController = require("../controllers/offerApiController");
const isAuthFeed = require("../middleware/is-auth-feed");

const router = express.Router();

// JWT-protected
router.use(isAuthFeed);

// Get active offers
router.get("/", offerController.getActiveOffers);

// Admin: Create offer
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("discountPercentage").isNumeric().withMessage("Discount percentage is required"),
    body("validFrom").isISO8601().toDate().withMessage("Valid from date required"),
    body("validTill").isISO8601().toDate().withMessage("Valid till date required"),
    body("code").notEmpty().withMessage("Offer code required")
  ],
  offerController.createOffer
);

// Admin: Update offer
router.put(
  "/:id",
  [
    body("title").optional().notEmpty(),
    body("discountPercentage").optional().isNumeric(),
    body("validFrom").optional().isISO8601().toDate(),
    body("validTill").optional().isISO8601().toDate(),
    body("code").optional().notEmpty(),
    body("isActive").optional().isBoolean()
  ],
  offerController.updateOffer
);

// Admin: Delete offer
router.delete("/:id", offerController.deleteOffer);

module.exports = router;
