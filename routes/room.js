const express = require('express');
const { body } = require('express-validator');

const roomController = require('../controllers/room');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// List rooms
router.get('/rooms', isAuth, roomController.getRooms);

// Create form
router.get('/create-room', isAuth, roomController.getRoomForm);

// Edit form
router.get('/room/edit/:roomId', isAuth, roomController.getRoomForm);

// Create room
router.post(
  '/room',
  isAuth,
  [
    body('hotelName')
      .notEmpty()
      .withMessage('Hotel name is required')
      .isLength({ min: 2 })
      .trim(),
    body('roomNumber')
      .notEmpty()
      .withMessage('Room number is required')
      .trim(),
    body('roomType')
      .isIn(['single', 'double', 'suite'])
      .withMessage('Please select a valid room type'),
    body('pricePerNight')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('availability')
      .optional()
      .isBoolean()
      .withMessage('Availability must be true/false'),
  ],
  roomController.saveRoom
);

// Edit room
router.post(
  '/room/edit/:roomId',
  isAuth,
  [
    body('hotelName')
      .notEmpty()
      .withMessage('Hotel name is required')
      .isLength({ min: 2 })
      .trim(),
    body('roomNumber')
      .notEmpty()
      .withMessage('Room number is required')
      .trim(),
    body('roomType')
      .isIn(['single', 'double', 'suite'])
      .withMessage('Please select a valid room type'),
    body('pricePerNight')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('availability')
      .optional()
      .isBoolean()
      .withMessage('Availability must be true/false'),
  ],
  roomController.saveRoom
);

// Delete room
router.delete('/room/:roomId', isAuth, roomController.deleteRoom);

module.exports = router;
