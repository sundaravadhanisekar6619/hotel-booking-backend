const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/review');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// List reviews
router.get('/reviews', isAuth, reviewController.getReviews);

// Create form
router.get('/create-review', isAuth, reviewController.getReviewForm);

// Edit form
router.get('/review/edit/:reviewId', isAuth, reviewController.getReviewForm);

// Create review
router.post(
  '/review',
  isAuth,
  [
    body('user').notEmpty().withMessage('User is required'),
    body('room').notEmpty().withMessage('Room is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim(),
  ],
  reviewController.saveReview
);

// Edit review
router.post(
  '/review/edit/:reviewId',
  isAuth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim(),
  ],
  reviewController.saveReview
);

// Delete review
router.delete('/review/:reviewId', isAuth, reviewController.deleteReview);

module.exports = router;
