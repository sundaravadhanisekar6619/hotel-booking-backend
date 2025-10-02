const { validationResult } = require('express-validator');
const Review = require('../models/review');
const User = require('../models/user');
const Room = require('../models/room');

// Get all reviews
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('room', 'roomNumber hotelName')
      .sort({ createdAt: -1 });

    res.render('review/reviews', {
      pageTitle: 'Review Management',
      reviews,
      isAuth: req.isAuth
    });
  } catch (err) {
    next(err);
  }
};

// Render create/edit form
exports.getReviewForm = async (req, res, next) => {
  try {
    const users = await User.find();
    const rooms = await Room.find();

    let oldInput = {};
    let editing = false;

    if (req.params.reviewId) {
      editing = true;
      const review = await Review.findById(req.params.reviewId);
      if (!review) return res.redirect('/reviews');

      oldInput = {
        id: review._id,
        user: review.user.toString(),
        room: review.room.toString(),
        rating: review.rating,
        comment: review.comment,
        approved: review.approved
      };
    }

    res.render('review/create-review', {
      pageTitle: editing ? 'Edit Review' : 'Create Review',
      editing,
      oldInput,
      users,
      rooms
    });
  } catch (err) {
    next(err);
  }
};

// Create or update review
exports.saveReview = async (req, res, next) => {
  const errors = validationResult(req);
  const { user, room, rating, comment, approved } = req.body;

  if (!errors.isEmpty()) {
    const users = await User.find();
    const rooms = await Room.find();

    return res.status(422).render('review/create-review', {
      pageTitle: req.params.reviewId ? 'Edit Review' : 'Create Review',
      editing: !!req.params.reviewId,
      oldInput: req.body,
      users,
      rooms,
      errorMessage: errors.array()[0].msg
    });
  }

  try {
    if (req.params.reviewId) {
      // Update review
      const review = await Review.findById(req.params.reviewId);
      if (!review) return res.redirect('/reviews');

      review.user = user;
      review.room = room;
      review.rating = rating;
      review.comment = comment;
      review.approved = approved === 'true' || approved === true;

      await review.save();
    } else {
      // Create new review
      const review = new Review({
        user,
        room,
        rating,
        comment,
        approved: approved === 'true' || approved === true
      });
      await review.save();
    }

    res.redirect('/reviews');
  } catch (err) {
    next(err);
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting review failed' });
  }
};
