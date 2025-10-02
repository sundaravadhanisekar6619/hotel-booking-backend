const { validationResult } = require('express-validator');
const Offer = require('../models/offer');

// List all offers
exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.render('offer/offers', {
      pageTitle: 'Offer Management',
      offers,
      isAuth: req.isAuth
    });
  } catch (err) {
    next(err);
  }
};

// Render create/edit form
exports.getOfferForm = async (req, res, next) => {
  try {
    let editing = false;
    let oldInput = {
      title: '',
      description: '',
      discountPercentage: '',
      validFrom: '',
      validTill: '',
      code: '',
      isActive: true
    };

    if (req.params.offerId) {
      editing = true;
      const offer = await Offer.findById(req.params.offerId);
      if (!offer) return res.redirect('/offers');

      oldInput = {
        id: offer._id,
        title: offer.title,
        description: offer.description,
        discountPercentage: offer.discountPercentage,
        validFrom: offer.validFrom.toISOString().slice(0, 10),
        validTill: offer.validTill.toISOString().slice(0, 10),
        code: offer.code,
        isActive: offer.isActive
      };
    }

    res.render('offer/create-offer', {
      pageTitle: editing ? 'Edit Offer' : 'Create Offer',
      editing,
      oldInput
    });
  } catch (err) {
    next(err);
  }
};

// Create or update offer
exports.saveOffer = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, description, discountPercentage, validFrom, validTill, code, isActive } = req.body;
  const editing = !!req.body.offerId;

  if (!errors.isEmpty()) {
    return res.status(422).render('offer/create-offer', {
      pageTitle: editing ? 'Edit Offer' : 'Create Offer',
      editing,
      oldInput: req.body,
      validationErrors: errors.array()
    });
  }

  try {
    if (editing) {
      const offer = await Offer.findById(req.body.offerId);
      if (!offer) return res.redirect('/offers');

      offer.title = title;
      offer.description = description;
      offer.discountPercentage = discountPercentage;
      offer.validFrom = validFrom;
      offer.validTill = validTill;
      offer.code = code;
      offer.isActive = isActive === 'true' || isActive === true;

      await offer.save();
    } else {
      const offer = new Offer({
        title,
        description,
        discountPercentage,
        validFrom,
        validTill,
        code,
        isActive: isActive === 'true' || isActive === true
      });
      await offer.save();
    }

    res.redirect('/offers');
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.code) {
      return res.status(422).render('offer/create-offer', {
        pageTitle: editing ? 'Edit Offer' : 'Create Offer',
        editing,
        oldInput: req.body,
        validationErrors: [{ path: 'code', msg: 'Code already exists' }]
      });
    }
    next(err);
  }
};

// Delete offer
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting offer failed' });
  }
};
