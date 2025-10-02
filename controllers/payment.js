const { validationResult } = require('express-validator');
const Payment = require('../models/payment');
const Booking = require('../models/booking');

// List all payments
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate('booking');
    res.render('payment/payments', {
      payments,
      pageTitle: 'Payment Management',
      path: '/payments'
    });
  } catch (err) {
    next(err);
  }
};

// Create/Edit form
exports.getPaymentForm = async (req, res, next) => {
  const paymentId = req.params.paymentId;
  const editing = !!paymentId;

  let oldInput = {
    booking: '',
    transactionId: '',
    amount: '',
    method: '',
    status: 'pending',
    paidAt: ''
  };

  try {
    // Fetch all bookings for dropdown
    const bookings = await Booking.find().populate('room');

    if (editing) {
      const payment = await Payment.findById(paymentId);
      if (!payment) return res.redirect('/payments');

      oldInput = {
        id: payment._id,
        booking: payment.booking,
        transactionId: payment.transactionId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt ? payment.paidAt.toISOString().slice(0,16) : ''
      };
    }

    res.render('payment/create-payment', {
      pageTitle: editing ? 'Edit Payment' : 'Add Payment',
      path: editing ? `/payment/edit/${paymentId}` : '/payment',
      oldInput,
      editing,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// Create/Update payment
exports.savePayment = async (req, res, next) => {
  const paymentId = req.body.paymentId;
  const editing = !!paymentId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('payment/create-payment', {
      pageTitle: editing ? 'Edit Payment' : 'Add Payment',
      editing,
      oldInput: req.body,
      bookings: await Booking.find(),
      validationErrors: errors.array()
    });
  }

  const { booking, transactionId, amount, method, status, paidAt } = req.body;

  try {
    let payment;
    if (editing) {
      payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).send('Payment not found');

      payment.booking = booking;
      payment.transactionId = transactionId;
      payment.amount = amount;
      payment.method = method;
      payment.status = status;
      payment.paidAt = paidAt ? new Date(paidAt) : null;
    } else {
      payment = new Payment({
        booking,
        transactionId,
        amount,
        method,
        status,
        paidAt: paidAt ? new Date(paidAt) : null
      });
    }

    await payment.save();
    res.redirect('/payments');
  } catch (err) {
    next(err);
  }
};

// Delete payment
exports.deletePayment = async (req, res, next) => {
  const paymentId = req.params.paymentId;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await payment.deleteOne();
    res.status(200).json({ message: 'Payment deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting payment failed.' });
  }
};
