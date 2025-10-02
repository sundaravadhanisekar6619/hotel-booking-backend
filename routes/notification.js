const express = require('express');
const { body } = require('express-validator');
const notificationController = require('../controllers/notification');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// List notifications
router.get('/notifications', isAuth, notificationController.getNotifications);

// Create form
router.get('/create-notification', isAuth, notificationController.getNotificationForm);

// Edit form
router.get('/notification/edit/:notificationId', isAuth, notificationController.getNotificationForm);

// Create notification
router.post(
  '/notification',
  isAuth,
  [
    body('user').notEmpty().withMessage('User is required'),
    body('type').isIn(['email', 'sms']).withMessage('Select a valid type'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message is required'),
    body('status').isIn(['sent', 'pending', 'failed']).withMessage('Select a valid status'),
  ],
  notificationController.saveNotification
);

// Edit notification
router.post(
  '/notification/edit/:notificationId',
  isAuth,
  [
    body('user').notEmpty().withMessage('User is required'),
    body('type').isIn(['email', 'sms']).withMessage('Select a valid type'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message is required'),
    body('status').isIn(['sent', 'pending', 'failed']).withMessage('Select a valid status'),
  ],
  notificationController.saveNotification
);

// Delete notification
router.delete('/notification/:notificationId', isAuth, notificationController.deleteNotification);

module.exports = router;
