const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/booking');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// List bookings
router.get('/bookings', isAuth, bookingController.getBookings);

// Create form
router.get('/create-booking', isAuth, bookingController.getBookingForm);

// Edit form
router.get('/booking/edit/:bookingId', isAuth, bookingController.getBookingForm);

// Create booking
router.post(
  '/booking',
  isAuth,
  [
    body('user').notEmpty().withMessage('User is required'),
    body('room').notEmpty().withMessage('Room is required'),
    body('checkInDate').isISO8601().toDate().withMessage('Invalid check-in date'),
    body('checkOutDate').isISO8601().toDate().withMessage('Invalid check-out date'),
    body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be valid'),
  ],
  bookingController.saveBooking
);

// Edit booking
router.post(
  '/booking/edit/:bookingId',
  isAuth,
  [
    body('checkInDate').isISO8601().toDate().withMessage('Invalid check-in date'),
    body('checkOutDate').isISO8601().toDate().withMessage('Invalid check-out date'),
    body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be valid'),
  ],
  bookingController.saveBooking
);

// Delete booking
router.delete('/booking/:bookingId', isAuth, bookingController.deleteBooking);

module.exports = router;
