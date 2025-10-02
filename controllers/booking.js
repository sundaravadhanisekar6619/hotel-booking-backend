const { validationResult } = require('express-validator');
const Booking = require('../models/booking');
const User = require('../models/user');
const Room = require('../models/room');

// Get all bookings
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'roomNumber hotelName')
      .sort({ createdAt: -1 });

    res.render('booking/bookings', {
      pageTitle: 'Booking Management',
      bookings,
      isAuth: req.isAuth
    });
  } catch (err) {
    next(err);
  }
};

// Render create / edit form
exports.getBookingForm = async (req, res, next) => {
  try {
    const users = await User.find();
    const rooms = await Room.find();

    let oldInput = {};
    let editing = false;

    if (req.params.bookingId) {
      editing = true;
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking) {
        return res.redirect('/bookings');
      }
      oldInput = {
        id: booking._id,
        user: booking.user.toString(),
        room: booking.room.toString(),
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        guests: booking.guests,
        specialRequests: booking.specialRequests,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
        totalAmount: booking.totalAmount
      };
    }

    res.render('booking/create-booking', {
      pageTitle: editing ? 'Edit Booking' : 'Create Booking',
      editing,
      oldInput,
      users,
      rooms
    });
  } catch (err) {
    next(err);
  }
};

// Create or update booking
exports.saveBooking = async (req, res, next) => {
  const errors = validationResult(req);
  const {
    user,
    room,
    checkInDate,
    checkOutDate,
    guests,
    specialRequests,
    paymentStatus,
    bookingStatus,
    totalAmount
  } = req.body;

  if (!errors.isEmpty()) {
    const users = await User.find();
    const rooms = await Room.find();
    return res.status(422).render('booking/create-booking', {
      pageTitle: req.params.bookingId ? 'Edit Booking' : 'Create Booking',
      editing: !!req.params.bookingId,
      oldInput: req.body,
      users,
      rooms,
      errorMessage: errors.array()[0].msg
    });
  }

  try {
    if (req.params.bookingId) {
      // Update existing booking
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking) return res.redirect('/bookings');

      booking.user = user;
      booking.room = room;
      booking.checkInDate = checkInDate;
      booking.checkOutDate = checkOutDate;
      booking.guests = guests;
      booking.specialRequests = specialRequests;
      booking.paymentStatus = paymentStatus;
      booking.bookingStatus = bookingStatus;
      booking.totalAmount = totalAmount;

      await booking.save();
    } else {
      // Create new booking
      const booking = new Booking({
        user,
        room,
        checkInDate,
        checkOutDate,
        guests,
        specialRequests,
        paymentStatus,
        bookingStatus,
        totalAmount
      });
      await booking.save();
    }

    res.redirect('/bookings');
  } catch (err) {
    next(err);
  }
};

// Delete booking
exports.deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting booking failed' });
  }
};
