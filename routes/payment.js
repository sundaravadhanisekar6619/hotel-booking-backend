const express = require('express');
const { body } = require('express-validator');

const paymentController = require('../controllers/payment');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// List payments
router.get('/payments', isAuth, paymentController.getPayments);

// Create form
router.get('/create-payment', isAuth, paymentController.getPaymentForm);

// Edit form
router.get('/payment/edit/:paymentId', isAuth, paymentController.getPaymentForm);

// Create payment
router.post(
  '/payment',
  isAuth,
  [
    body('booking').notEmpty().withMessage('Booking is required'),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('method').isIn(['card', 'upi', 'wallet', 'netbanking']).withMessage('Select a valid method')
  ],
  paymentController.savePayment
);

// Edit payment
router.post(
  '/payment/edit/:paymentId',
  isAuth,
  [
    body('booking').notEmpty().withMessage('Booking is required'),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('method').isIn(['card', 'upi', 'wallet', 'netbanking']).withMessage('Select a valid method')
  ],
  paymentController.savePayment
);

// Delete payment
router.delete('/payment/:paymentId', isAuth, paymentController.deletePayment);

module.exports = router;
