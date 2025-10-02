const { validationResult } = require("express-validator");
const Offer = require("../models/offer");

// GET /api/offers → Get active offers
exports.getActiveOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.json({ offers });
  } catch (err) {
    next(err);
  }
};

// POST /api/offers → Admin: Create offer
exports.createOffer = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { title, description, discountPercentage, validFrom, validTill, code } = req.body;

    const existing = await Offer.findOne({ code });
    if (existing) return res.status(422).json({ message: "Offer code must be unique" });

    const offer = new Offer({
      title,
      description,
      discountPercentage,
      validFrom,
      validTill,
      code,
      isActive: true
    });

    await offer.save();
    res.status(201).json({ message: "Offer created", offer });
  } catch (err) {
    next(err);
  }
};

// PUT /api/offers/:id → Admin: Update offer
exports.updateOffer = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    const { title, description, discountPercentage, validFrom, validTill, code, isActive } = req.body;

    if (code && code !== offer.code) {
      const existing = await Offer.findOne({ code });
      if (existing) return res.status(422).json({ message: "Offer code must be unique" });
      offer.code = code;
    }

    offer.title = title || offer.title;
    offer.description = description || offer.description;
    offer.discountPercentage = discountPercentage || offer.discountPercentage;
    offer.validFrom = validFrom || offer.validFrom;
    offer.validTill = validTill || offer.validTill;
    if (typeof isActive === "boolean") offer.isActive = isActive;

    await offer.save();
    res.json({ message: "Offer updated", offer });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/offers/:id → Admin: Delete offer
exports.deleteOffer = async (req, res, next) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin only" });

    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    await offer.deleteOne();
    res.json({ message: "Offer deleted" });
  } catch (err) {
    next(err);
  }
};
