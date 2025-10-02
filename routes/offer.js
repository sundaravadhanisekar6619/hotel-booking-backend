const express = require('express');
const { body } = require('express-validator');
const offerController = require('../controllers/offer');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// List all offers
router.get('/offers', isAuth, offerController.getOffers);

// Create form
router.get('/create-offer', isAuth, offerController.getOfferForm);

// Edit form
router.get('/offer/edit/:offerId', isAuth, offerController.getOfferForm);

// Create offer
router.post(
  '/offer',
  isAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('discountPercentage').isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0-100'),
    body('validFrom').isDate().withMessage('Valid from is required'),
    body('validTill').isDate().withMessage('Valid till is required'),
    body('code').notEmpty().withMessage('Code is required')
  ],
  offerController.saveOffer
);

// Edit offer
router.post(
  '/offer/edit/:offerId',
  isAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('discountPercentage').isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0-100'),
    body('validFrom').isDate().withMessage('Valid from is required'),
    body('validTill').isDate().withMessage('Valid till is required'),
    body('code').notEmpty().withMessage('Code is required')
  ],
  offerController.saveOffer
);

// Delete offer
router.delete('/offer/:offerId', isAuth, offerController.deleteOffer);

module.exports = router;
