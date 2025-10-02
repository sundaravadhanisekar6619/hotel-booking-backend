const Notification = require('../models/notification');
const User = require('../models/user');
const { validationResult } = require('express-validator');

// List all notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().populate('user');
    res.render('notification/notifications', {
      pageTitle: 'Notification Management',
      path: '/notifications',
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

// GET create/edit notification form
exports.getNotificationForm = async (req, res, next) => {
  const notificationId = req.params.notificationId;
  const editing = !!notificationId;

  let oldInput = {
    user: '',
    type: '',
    message: '',
    status: 'pending',
  };

  try {
    const users = await User.find(); // For user dropdown

    if (editing) {
      const notification = await Notification.findById(notificationId);
      if (!notification) return res.redirect('/notifications');

      oldInput = {
        id: notification._id,
        user: notification.user,
        type: notification.type,
        message: notification.message,
        status: notification.status,
      };
    }

    res.render('notification/create-notification', {
      pageTitle: editing ? 'Edit Notification' : 'Add Notification',
      path: editing ? `/notification/edit/${notificationId}` : '/notification',
      oldInput,
      editing,
      users,
      validationErrors: [],
    });
  } catch (err) {
    next(err);
  }
};

// POST create or update notification
exports.saveNotification = async (req, res, next) => {
  const notificationId = req.body.notificationId;
  const editing = !!notificationId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('notification/create-notification', {
      pageTitle: editing ? 'Edit Notification' : 'Add Notification',
      path: editing ? `/notification/edit/${notificationId}` : '/notification',
      oldInput: req.body,
      users: await User.find(),
      editing,
      validationErrors: errors.array(),
    });
  }

  const { user, type, message, status } = req.body;

  try {
    let notification;
    if (editing) {
      notification = await Notification.findById(notificationId);
      if (!notification) return res.status(404).send('Notification not found');

      notification.user = user;
      notification.type = type;
      notification.message = message;
      notification.status = status;
    } else {
      notification = new Notification({ user, type, message, status });
    }

    await notification.save();
    res.redirect('/notifications');
  } catch (err) {
    next(err);
  }
};

// DELETE notification
exports.deleteNotification = async (req, res, next) => {
  const notificationId = req.params.notificationId;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error('Notification not found');

    await notification.deleteOne();
    res.status(200).json({ message: 'Notification deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting notification failed.' });
  }
};
